export type UserRole = "sourcer" | "investor" | "admin";
export type VerificationStatus = "pending" | "approved" | "rejected" | "not_submitted";
export type DealType = "BTL" | "HMO" | "BRRR" | "Flip";
export type DealStatus = "draft" | "active" | "reserved" | "sold" | "withdrawn";
export type TransactionStatus = "pending" | "completed" | "refunded" | "disputed";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: UserRole;
          phone: string | null;
          company_name: string | null;
          verification_status: VerificationStatus;
          stripe_account_id: string | null;
          stripe_customer_id: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "created_at" | "updated_at" | "phone" | "company_name" | "stripe_account_id" | "stripe_customer_id" | "avatar_url"> & {
          phone?: string | null;
          company_name?: string | null;
          stripe_account_id?: string | null;
          stripe_customer_id?: string | null;
          avatar_url?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };

      verification_documents: {
        Row: {
          id: string;
          user_id: string;
          document_type: string;
          storage_path: string;
          file_name: string;
          status: VerificationStatus;
          admin_notes: string | null;
          reviewed_by: string | null;
          reviewed_at: string | null;
          expires_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["verification_documents"]["Row"], "id" | "created_at" | "admin_notes" | "reviewed_by" | "reviewed_at" | "expires_at"> & {
          admin_notes?: string | null;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          expires_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["verification_documents"]["Insert"]>;
        Relationships: [];
      };

      deals: {
        Row: {
          id: string;
          sourcer_id: string;
          title: string;
          address_line1: string;
          address_line2: string | null;
          city: string;
          postcode: string;
          deal_type: DealType;
          asking_price: number;
          sourcing_fee: number;
          monthly_rent: number | null;
          roi_percent: number | null;
          gross_yield_percent: number | null;
          bmv_percent: number | null;
          description: string | null;
          deal_pack_url: string | null;
          status: DealStatus;
          reserved_by: string | null;
          reserved_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["deals"]["Row"], "id" | "created_at" | "updated_at" | "address_line2" | "monthly_rent" | "roi_percent" | "gross_yield_percent" | "bmv_percent" | "description" | "deal_pack_url" | "reserved_by" | "reserved_at"> & {
          address_line2?: string | null;
          monthly_rent?: number | null;
          roi_percent?: number | null;
          gross_yield_percent?: number | null;
          bmv_percent?: number | null;
          description?: string | null;
          deal_pack_url?: string | null;
          reserved_by?: string | null;
          reserved_at?: string | null;
          status?: Database["public"]["Tables"]["deals"]["Row"]["status"];
        };
        Update: Partial<Database["public"]["Tables"]["deals"]["Insert"]>;
        Relationships: [];
      };

      deal_photos: {
        Row: {
          id: string;
          deal_id: string;
          storage_path: string;
          display_order: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["deal_photos"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["deal_photos"]["Insert"]>;
        Relationships: [];
      };

      transactions: {
        Row: {
          id: string;
          deal_id: string;
          investor_id: string;
          sourcer_id: string;
          sourcing_fee: number;
          platform_fee: number;
          vat_amount: number;
          investor_total: number;
          sourcer_commission: number;
          sourcer_commission_vat: number;
          sourcer_payout: number;
          platform_revenue: number;
          stripe_payment_intent_id: string | null;
          stripe_transfer_id: string | null;
          status: TransactionStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["transactions"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["transactions"]["Insert"]>;
        Relationships: [];
      };

      messages: {
        Row: {
          id: string;
          deal_id: string;
          sender_id: string;
          recipient_id: string;
          body: string;
          read_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["messages"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["messages"]["Insert"]>;
        Relationships: [];
      };

      reviews: {
        Row: {
          id: string;
          deal_id: string;
          reviewer_id: string;
          reviewee_id: string;
          rating: number;
          comment: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["reviews"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["reviews"]["Insert"]>;
        Relationships: [];
      };

      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          body: string;
          link: string | null;
          read_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["notifications"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["notifications"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      verification_status: VerificationStatus;
      deal_type: DealType;
      deal_status: DealStatus;
      transaction_status: TransactionStatus;
    };
    CompositeTypes: Record<string, never>;
  };
};

// Convenience row types
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Deal = Database["public"]["Tables"]["deals"]["Row"];
export type Transaction = Database["public"]["Tables"]["transactions"]["Row"];
export type Message = Database["public"]["Tables"]["messages"]["Row"];
export type VerificationDocument = Database["public"]["Tables"]["verification_documents"]["Row"];
export type Review = Database["public"]["Tables"]["reviews"]["Row"];
export type Notification = Database["public"]["Tables"]["notifications"]["Row"];
