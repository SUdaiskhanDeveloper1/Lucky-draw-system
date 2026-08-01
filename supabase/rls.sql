-- =============================================================================
--  Row Level Security (RLS) policies
--  Run AFTER schema.sql
-- =============================================================================

-- Enable RLS on all tables
alter table public.profiles           enable row level security;
alter table public.admins             enable row level security;
alter table public.banners            enable row level security;
alter table public.campaigns          enable row level security;
alter table public.coupons            enable row level security;
alter table public.payments           enable row level security;
alter table public.payment_receipts   enable row level security;
alter table public.tickets            enable row level security;
alter table public.winners            enable row level security;
alter table public.wallets            enable row level security;
alter table public.wallet_transactions enable row level security;
alter table public.referrals          enable row level security;
alter table public.notifications      enable row level security;
alter table public.settings           enable row level security;
alter table public.payment_methods    enable row level security;
alter table public.cms_pages          enable row level security;
alter table public.faqs               enable row level security;
alter table public.support_tickets    enable row level security;
alter table public.activity_logs      enable row level security;

-- Helper to (re)create a policy cleanly
-- (Postgres has no CREATE POLICY IF NOT EXISTS, so drop first.)

-- ---------------------------------------------------------------- profiles ---
drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles
  for select using (auth.uid() = id or public.is_admin());

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
  for update using (auth.uid() = id or public.is_admin());

drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists profiles_admin_all on public.profiles;
create policy profiles_admin_all on public.profiles
  for all using (public.is_admin());

-- ------------------------------------------------------------------ admins ---
drop policy if exists admins_select on public.admins;
create policy admins_select on public.admins
  for select using (auth.uid() = id or public.is_admin());

-- ---------------------------------------------------------------- banners ----
-- Public can read active banners; admins manage all.
drop policy if exists banners_read on public.banners;
create policy banners_read on public.banners
  for select using (is_active or public.is_admin());

drop policy if exists banners_admin on public.banners;
create policy banners_admin on public.banners
  for all using (public.is_admin()) with check (public.is_admin());

-- --------------------------------------------------------------- campaigns ---
drop policy if exists campaigns_read on public.campaigns;
create policy campaigns_read on public.campaigns
  for select using (status <> 'draft' or public.is_admin());

drop policy if exists campaigns_admin on public.campaigns;
create policy campaigns_admin on public.campaigns
  for all using (public.is_admin()) with check (public.is_admin());

-- ----------------------------------------------------------------- coupons ---
-- Users may read active coupons (to validate at checkout); admins manage.
drop policy if exists coupons_read on public.coupons;
create policy coupons_read on public.coupons
  for select using (is_active or public.is_admin());

drop policy if exists coupons_admin on public.coupons;
create policy coupons_admin on public.coupons
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------- payments ---
drop policy if exists payments_select_own on public.payments;
create policy payments_select_own on public.payments
  for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists payments_insert_own on public.payments;
create policy payments_insert_own on public.payments
  for insert with check (auth.uid() = user_id);

-- Users may NOT change status/admin_note; only admins update payments.
drop policy if exists payments_admin_update on public.payments;
create policy payments_admin_update on public.payments
  for update using (public.is_admin()) with check (public.is_admin());

-- -------------------------------------------------------- payment_receipts ---
drop policy if exists receipts_own on public.payment_receipts;
create policy receipts_own on public.payment_receipts
  for select using (
    public.is_admin() or exists (
      select 1 from public.payments p
      where p.id = payment_id and p.user_id = auth.uid()
    )
  );

drop policy if exists receipts_insert_own on public.payment_receipts;
create policy receipts_insert_own on public.payment_receipts
  for insert with check (
    exists (select 1 from public.payments p
            where p.id = payment_id and p.user_id = auth.uid())
  );

-- ----------------------------------------------------------------- tickets ---
drop policy if exists tickets_select_own on public.tickets;
create policy tickets_select_own on public.tickets
  for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists tickets_admin on public.tickets;
create policy tickets_admin on public.tickets
  for all using (public.is_admin()) with check (public.is_admin());

-- ----------------------------------------------------------------- winners ---
-- Winners are public (Winner History section on homepage).
drop policy if exists winners_read on public.winners;
create policy winners_read on public.winners for select using (true);

drop policy if exists winners_admin on public.winners;
create policy winners_admin on public.winners
  for all using (public.is_admin()) with check (public.is_admin());

-- ----------------------------------------------------------------- wallets ---
drop policy if exists wallets_own on public.wallets;
create policy wallets_own on public.wallets
  for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists wallets_admin on public.wallets;
create policy wallets_admin on public.wallets
  for all using (public.is_admin()) with check (public.is_admin());

-- ------------------------------------------------------ wallet_transactions ---
drop policy if exists wallet_txn_own on public.wallet_transactions;
create policy wallet_txn_own on public.wallet_transactions
  for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists wallet_txn_admin on public.wallet_transactions;
create policy wallet_txn_admin on public.wallet_transactions
  for all using (public.is_admin()) with check (public.is_admin());

-- --------------------------------------------------------------- referrals ---
drop policy if exists referrals_own on public.referrals;
create policy referrals_own on public.referrals
  for select using (auth.uid() = referrer_id or auth.uid() = referred_id or public.is_admin());

drop policy if exists referrals_admin on public.referrals;
create policy referrals_admin on public.referrals
  for all using (public.is_admin()) with check (public.is_admin());

-- ----------------------------------------------------------- notifications ---
drop policy if exists notif_own on public.notifications;
create policy notif_own on public.notifications
  for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists notif_update_own on public.notifications;
create policy notif_update_own on public.notifications
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists notif_admin on public.notifications;
create policy notif_admin on public.notifications
  for all using (public.is_admin()) with check (public.is_admin());

-- ----------------------------------------------------------------- settings ---
-- Public read (site name, payment info, social links, etc.); admins write.
drop policy if exists settings_read on public.settings;
create policy settings_read on public.settings for select using (true);

drop policy if exists settings_admin on public.settings;
create policy settings_admin on public.settings
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------- payment_methods ---
drop policy if exists pm_read on public.payment_methods;
create policy pm_read on public.payment_methods
  for select using (is_active or public.is_admin());

drop policy if exists pm_admin on public.payment_methods;
create policy pm_admin on public.payment_methods
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------- cms_pages ---
drop policy if exists cms_read on public.cms_pages;
create policy cms_read on public.cms_pages for select using (true);

drop policy if exists cms_admin on public.cms_pages;
create policy cms_admin on public.cms_pages
  for all using (public.is_admin()) with check (public.is_admin());

-- --------------------------------------------------------------------- faqs ---
drop policy if exists faqs_read on public.faqs;
create policy faqs_read on public.faqs
  for select using (is_active or public.is_admin());

drop policy if exists faqs_admin on public.faqs;
create policy faqs_admin on public.faqs
  for all using (public.is_admin()) with check (public.is_admin());

-- ------------------------------------------------------------ support_tickets ---
drop policy if exists support_insert on public.support_tickets;
create policy support_insert on public.support_tickets
  for insert with check (true);   -- allow guests + users to submit

drop policy if exists support_select on public.support_tickets;
create policy support_select on public.support_tickets
  for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists support_admin on public.support_tickets;
create policy support_admin on public.support_tickets
  for all using (public.is_admin()) with check (public.is_admin());

-- ------------------------------------------------------------- activity_logs ---
drop policy if exists logs_admin on public.activity_logs;
create policy logs_admin on public.activity_logs
  for select using (public.is_admin());

drop policy if exists logs_insert on public.activity_logs;
create policy logs_insert on public.activity_logs
  for insert with check (auth.uid() is not null);
