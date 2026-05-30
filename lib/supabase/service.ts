import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

let _admin: SupabaseClient<Database> | null = null;

function getAdmin(): SupabaseClient<Database> {
  if (!_admin) {
    _admin = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }
  return _admin;
}

export const supabaseAdmin = new Proxy({} as SupabaseClient<Database>, {
  get(_, prop: string) {
    return (getAdmin() as any)[prop];
  },
});
