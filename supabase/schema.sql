-- ============================================================
--  PropertyScan — Full Database Schema
--  Run this in Supabase → SQL Editor → New Query
-- ============================================================

-- ─── Extensions ──────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── Enums ───────────────────────────────────────────────────
create type user_role as enum ('sourcer', 'investor', 'admin');
create type verification_status as enum ('not_submitted', 'pending', 'approved', 'rejected');
create type deal_type as enum ('BTL', 'HMO', 'BRRR', 'Flip');
create type deal_status as enum ('draft', 'active', 'reserved', 'sold', 'withdrawn');
create type transaction_status as enum ('pending', 'completed', 'refunded', 'disputed');

-- ─── Profiles ────────────────────────────────────────────────
create table public.profiles (
  id                  uuid primary key references auth.users(id) on delete cascade,
  email               text not null,
  full_name           text,
  role                user_role not null default 'investor',
  phone               text,
  company_name        text,
  verification_status verification_status not null default 'not_submitted',
  stripe_account_id   text,
  stripe_customer_id  text,
  avatar_url          text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

-- ─── Verification Documents ──────────────────────────────────
create table public.verification_documents (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  document_type text not null,
  -- e.g. 'photo_id', 'proof_of_address', 'aml_certificate',
  --      'prs_membership', 'pi_insurance', 'ico_registration',
  --      'proof_of_funds', 'source_of_wealth', 'investment_questionnaire',
  --      'proof_of_business_address'
  storage_path  text not null,
  file_name     text not null,
  status        verification_status not null default 'pending',
  admin_notes   text,
  reviewed_by   uuid references public.profiles(id),
  reviewed_at   timestamptz,
  expires_at    timestamptz,
  created_at    timestamptz not null default now()
);

-- ─── Deals ───────────────────────────────────────────────────
create table public.deals (
  id                  uuid primary key default uuid_generate_v4(),
  sourcer_id          uuid not null references public.profiles(id) on delete cascade,
  title               text not null,
  address_line1       text not null,
  address_line2       text,
  city                text not null,
  postcode            text not null,
  deal_type           deal_type not null,
  asking_price        bigint not null,    -- pence
  sourcing_fee        bigint not null,    -- pence
  monthly_rent        bigint,             -- pence
  roi_percent         numeric(5,2),
  gross_yield_percent numeric(5,2),
  bmv_percent         numeric(5,2),
  description         text,
  deal_pack_url       text,
  status              deal_status not null default 'draft',
  reserved_by         uuid references public.profiles(id),
  reserved_at         timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create trigger deals_updated_at
  before update on public.deals
  for each row execute procedure public.handle_updated_at();

create index deals_status_idx  on public.deals(status);
create index deals_sourcer_idx on public.deals(sourcer_id);
create index deals_city_idx    on public.deals(city);
create index deals_type_idx    on public.deals(deal_type);

-- ─── Deal Photos ─────────────────────────────────────────────
create table public.deal_photos (
  id            uuid primary key default uuid_generate_v4(),
  deal_id       uuid not null references public.deals(id) on delete cascade,
  storage_path  text not null,
  display_order integer not null default 0,
  created_at    timestamptz not null default now()
);

-- ─── Transactions ────────────────────────────────────────────
create table public.transactions (
  id                       uuid primary key default uuid_generate_v4(),
  deal_id                  uuid not null references public.deals(id),
  investor_id              uuid not null references public.profiles(id),
  sourcer_id               uuid not null references public.profiles(id),
  sourcing_fee             bigint not null,   -- pence — base sourcing fee
  platform_fee             bigint not null,   -- pence — 5% of sourcing_fee
  vat_amount               bigint not null,   -- pence — VAT on platform_fee
  investor_total           bigint not null,   -- pence — what investor pays
  sourcer_commission       bigint not null,   -- pence — 20% of sourcing_fee
  sourcer_commission_vat   bigint not null,   -- pence — VAT on commission
  sourcer_payout           bigint not null,   -- pence — net to sourcer
  platform_revenue         bigint not null,   -- pence — PropertyScan keeps
  stripe_payment_intent_id text,
  stripe_transfer_id       text,
  status                   transaction_status not null default 'pending',
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

create trigger transactions_updated_at
  before update on public.transactions
  for each row execute procedure public.handle_updated_at();

-- ─── Messages ────────────────────────────────────────────────
create table public.messages (
  id           uuid primary key default uuid_generate_v4(),
  deal_id      uuid not null references public.deals(id) on delete cascade,
  sender_id    uuid not null references public.profiles(id),
  recipient_id uuid not null references public.profiles(id),
  body         text not null,
  read_at      timestamptz,
  created_at   timestamptz not null default now()
);

create index messages_deal_idx      on public.messages(deal_id);
create index messages_recipient_idx on public.messages(recipient_id);

-- ─── Reviews ─────────────────────────────────────────────────
create table public.reviews (
  id          uuid primary key default uuid_generate_v4(),
  deal_id     uuid not null references public.deals(id),
  reviewer_id uuid not null references public.profiles(id),
  reviewee_id uuid not null references public.profiles(id),
  rating      integer not null check (rating between 1 and 5),
  comment     text,
  created_at  timestamptz not null default now(),
  unique (deal_id, reviewer_id)
);

-- ─── Notifications ───────────────────────────────────────────
create table public.notifications (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  title      text not null,
  body       text not null,
  link       text,
  read_at    timestamptz,
  created_at timestamptz not null default now()
);

create index notifications_user_idx on public.notifications(user_id);

-- ============================================================
--  Row Level Security
-- ============================================================
alter table public.profiles              enable row level security;
alter table public.verification_documents enable row level security;
alter table public.deals                 enable row level security;
alter table public.deal_photos           enable row level security;
alter table public.transactions          enable row level security;
alter table public.messages              enable row level security;
alter table public.reviews               enable row level security;
alter table public.notifications         enable row level security;

-- Helper: is the current user an admin?
create or replace function public.is_admin()
returns boolean language sql security definer as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ── profiles ──────────────────────────────────────────────────
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Admins can view all profiles"
  on public.profiles for select
  using (public.is_admin());

create policy "Authenticated users can view approved sourcer profiles"
  on public.profiles for select
  using (
    auth.uid() is not null
    and role = 'sourcer'
    and verification_status = 'approved'
  );

create policy "Admins can update all profiles"
  on public.profiles for update
  using (public.is_admin());

-- ── verification_documents ────────────────────────────────────
create policy "Users can view their own documents"
  on public.verification_documents for select
  using (auth.uid() = user_id);

create policy "Users can insert their own documents"
  on public.verification_documents for insert
  with check (auth.uid() = user_id);

create policy "Admins can view all documents"
  on public.verification_documents for select
  using (public.is_admin());

create policy "Admins can update all documents"
  on public.verification_documents for update
  using (public.is_admin());

-- ── deals ─────────────────────────────────────────────────────
create policy "Approved investors can view active deals"
  on public.deals for select
  using (
    status = 'active'
    and exists (
      select 1 from public.profiles
      where id = auth.uid()
        and role = 'investor'
        and verification_status = 'approved'
    )
  );

create policy "Sourcers can view their own deals"
  on public.deals for select
  using (auth.uid() = sourcer_id);

create policy "Approved sourcers can insert deals"
  on public.deals for insert
  with check (
    auth.uid() = sourcer_id
    and exists (
      select 1 from public.profiles
      where id = auth.uid()
        and role = 'sourcer'
        and verification_status = 'approved'
    )
  );

create policy "Sourcers can update their own deals"
  on public.deals for update
  using (auth.uid() = sourcer_id and status in ('draft', 'active', 'withdrawn'))
  with check (auth.uid() = sourcer_id and status in ('draft', 'active', 'withdrawn'));

-- Verified investors can view deals that are reserved/sold (for their own reservation)
create policy "Investors can view their own reserved deals"
  on public.deals for select
  using (
    reserved_by = auth.uid()
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'investor'
    )
  );

-- Verified investors can reserve an active deal
create policy "Verified investors can reserve active deals"
  on public.deals for update
  using (
    status = 'active'
    and exists (
      select 1 from public.profiles
      where id = auth.uid()
        and role = 'investor'
        and verification_status = 'approved'
    )
  )
  with check (
    status = 'reserved'
    and reserved_by = auth.uid()
  );

-- Verified users can view sourcer profiles (needed for deal detail page)
create policy "Verified users can view sourcer profiles"
  on public.profiles for select
  using (
    role = 'sourcer'
    and exists (
      select 1 from public.profiles as p
      where p.id = auth.uid()
        and p.verification_status = 'approved'
    )
  );

create policy "Admins have full deal access"
  on public.deals for all
  using (public.is_admin());

-- ── deal_photos ───────────────────────────────────────────────
create policy "Photos visible with deal"
  on public.deal_photos for select
  using (
    exists (
      select 1 from public.deals d
      where d.id = deal_id
        and (d.status = 'active' or d.sourcer_id = auth.uid())
    )
  );

create policy "Sourcer can manage their deal photos"
  on public.deal_photos for all
  using (
    exists (
      select 1 from public.deals d
      where d.id = deal_id and d.sourcer_id = auth.uid()
    )
  );

-- ── transactions ──────────────────────────────────────────────
create policy "Investor can view own transactions"
  on public.transactions for select
  using (auth.uid() = investor_id);

create policy "Sourcer can view own transactions"
  on public.transactions for select
  using (auth.uid() = sourcer_id);

create policy "Admins can view all transactions"
  on public.transactions for select
  using (public.is_admin());

-- ── messages ──────────────────────────────────────────────────
create policy "Participants can view their messages"
  on public.messages for select
  using (auth.uid() = sender_id or auth.uid() = recipient_id);

create policy "Verified users can send messages"
  on public.messages for insert
  with check (
    auth.uid() = sender_id
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and verification_status = 'approved'
    )
  );

create policy "Admins can view all messages"
  on public.messages for select
  using (public.is_admin());

-- ── reviews ───────────────────────────────────────────────────
create policy "Anyone can view reviews"
  on public.reviews for select
  using (true);

create policy "Verified users can leave one review per deal"
  on public.reviews for insert
  with check (
    auth.uid() = reviewer_id
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and verification_status = 'approved'
    )
  );

-- ── notifications ─────────────────────────────────────────────
create policy "Users can view own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "Users can mark own notifications read"
  on public.notifications for update
  using (auth.uid() = user_id);

-- ============================================================
--  Storage Buckets
-- ============================================================
insert into storage.buckets (id, name, public)
values
  ('verification-docs', 'verification-docs', false),
  ('deal-photos',       'deal-photos',       true),
  ('deal-packs',        'deal-packs',        false)
on conflict do nothing;

-- Private: only document owner or admin can read verification docs
create policy "Users can upload their own verification docs"
  on storage.objects for insert
  with check (
    bucket_id = 'verification-docs'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can read their own verification docs"
  on storage.objects for select
  using (
    bucket_id = 'verification-docs'
    and (
      auth.uid()::text = (storage.foldername(name))[1]
      or public.is_admin()
    )
  );

-- Public: deal photos readable by all (CDN)
create policy "Anyone can view deal photos"
  on storage.objects for select
  using (bucket_id = 'deal-photos');

create policy "Sourcers can upload deal photos"
  on storage.objects for insert
  with check (
    bucket_id = 'deal-photos'
    and exists (
      select 1 from public.profiles
      where id = auth.uid()
        and role = 'sourcer'
        and verification_status = 'approved'
    )
  );

-- Private: deal packs only for deal participants
create policy "Deal participants can read deal packs"
  on storage.objects for select
  using (
    bucket_id = 'deal-packs'
    and (
      public.is_admin()
      -- Sourcer can always read their own deal packs (path: {user_id}/{deal_id}/deal-pack.pdf)
      or auth.uid()::text = (storage.foldername(name))[1]
      -- Investors can read after a completed purchase
      or exists (
        select 1 from public.transactions t
        where t.investor_id = auth.uid()
          and t.status = 'completed'
      )
    )
  );

create policy "Sourcers can upload deal packs"
  on storage.objects for insert
  with check (
    bucket_id = 'deal-packs'
    and exists (
      select 1 from public.profiles
      where id = auth.uid()
        and role = 'sourcer'
        and verification_status = 'approved'
    )
  );

-- ============================================================
--  Realtime
-- ============================================================
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.notifications;
alter publication supabase_realtime add table public.deals;

-- ─── Message Content Filter ───────────────────────────────────
-- Blocks emails and phone numbers from being sent via messages.
-- Also run this manually in Supabase SQL Editor if schema is already deployed.

create or replace function public.check_message_content()
returns trigger language plpgsql as $$
declare
  stripped text;
begin
  if new.body ~* '[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}' then
    raise exception 'Messages cannot contain email addresses.';
  end if;
  -- Strip spaces, dashes, dots, brackets, plus signs then check for 10+ consecutive digits
  -- Catches: 07539 960669, 0 7 5 3 9 9 6 0 6 6 9, 07-539-960-669, (0753) 9960669, etc.
  stripped := regexp_replace(new.body, '[\s\-+().]', '', 'g');
  if stripped ~ '\d{10,}' then
    raise exception 'Messages cannot contain phone numbers.';
  end if;
  return new;
end;
$$;

create trigger enforce_message_content
  before insert on public.messages
  for each row execute procedure public.check_message_content();
