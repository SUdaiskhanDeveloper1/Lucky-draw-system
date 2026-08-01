// Hand-written types mirroring supabase/schema.sql.
// You can regenerate with: npx supabase gen types typescript --project-id <ref>
//
// NOTE: entity types are `type` aliases (not `interface`) so they satisfy the
// `Record<string, unknown>` constraint that supabase-js applies to table rows.

export type AccountStatus = "active" | "suspended" | "banned";
export type CampaignStatus = "draft" | "active" | "completed" | "cancelled";
export type PaymentStatus = "pending" | "approved" | "rejected";
export type PaymentChannel =
  | "easypaisa"
  | "jazzcash"
  | "bank_transfer"
  | "wallet";
export type TicketStatus = "active" | "won" | "lost" | "void";
export type CouponType = "percentage" | "flat";
export type TxnType = "credit" | "debit";

export type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  cnic: string | null;
  avatar_url: string | null;
  referral_code: string | null;
  referred_by: string | null;
  status: AccountStatus;
  created_at: string;
  updated_at: string;
};

export type Campaign = {
  id: string;
  prize_name: string;
  slug: string | null;
  description: string | null;
  prize_image: string | null;
  images: string[];
  entry_fee: number;
  max_entries: number | null;
  entries_count: number;
  winners_count: number;
  start_date: string | null;
  end_date: string | null;
  status: CampaignStatus;
  is_featured: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type Payment = {
  id: string;
  user_id: string;
  campaign_id: string | null;
  amount: number;
  method: PaymentChannel;
  transaction_id: string | null;
  sender_number: string | null;
  receipt_url: string | null;
  note: string | null;
  coupon_id: string | null;
  discount: number;
  status: PaymentStatus;
  admin_note: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Ticket = {
  id: string;
  ticket_number: string;
  user_id: string;
  campaign_id: string;
  payment_id: string | null;
  status: TicketStatus;
  created_at: string;
};

export type Winner = {
  id: string;
  campaign_id: string;
  user_id: string;
  ticket_id: string | null;
  prize_name: string | null;
  announced_at: string;
  created_at: string;
};

export type Banner = {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string;
  link_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Coupon = {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  expiry_date: string | null;
  usage_limit: number | null;
  used_count: number;
  is_active: boolean;
  created_at: string;
};

export type Notification = {
  id: string;
  user_id: string;
  title: string;
  body: string | null;
  type: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
};

export type Wallet = {
  user_id: string;
  balance: number;
  updated_at: string;
};

export type WalletTransaction = {
  id: string;
  user_id: string;
  type: TxnType;
  amount: number;
  balance_after: number | null;
  reason: string | null;
  created_at: string;
};

export type Referral = {
  id: string;
  referrer_id: string;
  referred_id: string;
  code: string | null;
  bonus_amount: number;
  status: string;
  created_at: string;
};

export type PaymentMethod = {
  id: string;
  method: PaymentChannel;
  account_title: string | null;
  account_number: string | null;
  iban: string | null;
  bank_name: string | null;
  instructions: string | null;
  is_active: boolean;
  sort_order: number;
  updated_at: string;
};

export type CmsPage = {
  slug: string;
  title: string;
  content: string | null;
  updated_at: string;
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
};

export type SupportTicket = {
  id: string;
  user_id: string | null;
  subject: string;
  message: string;
  email: string | null;
  status: string;
  reply: string | null;
  created_at: string;
};

export type Setting = {
  key: string;
  value: Record<string, unknown>;
  updated_at: string;
};

export type Admin = {
  id: string;
  role: string;
  created_at: string;
};

export type PaymentReceipt = {
  id: string;
  payment_id: string;
  file_url: string;
  created_at: string;
};

export type ActivityLog = {
  id: string;
  actor_id: string | null;
  action: string;
  entity: string | null;
  entity_id: string | null;
  meta: Record<string, unknown>;
  created_at: string;
};

// Generic table shape supabase-js expects.
type TableDef<TRow> = {
  Row: TRow;
  Insert: Partial<TRow>;
  Update: Partial<TRow>;
  Relationships: [];
};

export interface Database {
  public: {
    Tables: {
      profiles: TableDef<Profile>;
      admins: TableDef<Admin>;
      campaigns: TableDef<Campaign>;
      payments: TableDef<Payment>;
      tickets: TableDef<Ticket>;
      winners: TableDef<Winner>;
      banners: TableDef<Banner>;
      coupons: TableDef<Coupon>;
      notifications: TableDef<Notification>;
      wallets: TableDef<Wallet>;
      wallet_transactions: TableDef<WalletTransaction>;
      referrals: TableDef<Referral>;
      payment_methods: TableDef<PaymentMethod>;
      cms_pages: TableDef<CmsPage>;
      faqs: TableDef<Faq>;
      support_tickets: TableDef<SupportTicket>;
      settings: TableDef<Setting>;
      payment_receipts: TableDef<PaymentReceipt>;
      activity_logs: TableDef<ActivityLog>;
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
      draw_winners: {
        Args: { p_campaign: string; p_count?: number };
        Returns: Winner[];
      };
    };
    Enums: {
      account_status: AccountStatus;
      campaign_status: CampaignStatus;
      payment_status: PaymentStatus;
      payment_channel: PaymentChannel;
      ticket_status: TicketStatus;
      coupon_type: CouponType;
      txn_type: TxnType;
    };
    CompositeTypes: Record<string, never>;
  };
}
