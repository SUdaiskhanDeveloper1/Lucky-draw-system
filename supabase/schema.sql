-- =============================================================================
--  Rs. 1 Lucky Draw Platform — Database Schema
--  PostgreSQL / Supabase
--
--  Run this file in the Supabase SQL Editor (or `supabase db push`).
--  It is idempotent-ish: safe to re-run in a fresh project.
-- =============================================================================

-- ----------------------------------------------------------------------------
--  Extensions
-- ----------------------------------------------------------------------------
create extension if not exists "pgcrypto";      -- gen_random_uuid()

-- ----------------------------------------------------------------------------
--  ENUM types
-- ----------------------------------------------------------------------------
do $$ begin
  create type account_status   as enum ('active', 'suspended', 'banned');
exception when duplicate_object then null; end $$;

do $$ begin
  create type campaign_status  as enum ('draft', 'active', 'completed', 'cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type payment_status   as enum ('pending', 'approved', 'rejected');
exception when duplicate_object then null; end $$;

do $$ begin
  create type payment_channel  as enum ('easypaisa', 'jazzcash', 'bank_transfer', 'wallet');
exception when duplicate_object then null; end $$;

do $$ begin
  create type ticket_status    as enum ('active', 'won', 'lost', 'void');
exception when duplicate_object then null; end $$;

do $$ begin
  create type coupon_type      as enum ('percentage', 'flat');
exception when duplicate_object then null; end $$;

do $$ begin
  create type txn_type         as enum ('credit', 'debit');
exception when duplicate_object then null; end $$;

-- =============================================================================
--  TABLES
-- =============================================================================

-- ---- profiles ---------------------------------------------------------------
create table if not exists public.profiles (
  id             uuid primary key references auth.users(id) on delete cascade,
  email          text,
  full_name      text,
  phone          text,
  address        text,
  city           text,
  country        text default 'Pakistan',
  cnic           text,
  avatar_url     text,
  referral_code  text unique,
  referred_by    uuid references public.profiles(id) on delete set null,
  status         account_status not null default 'active',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- ---- admins -----------------------------------------------------------------
create table if not exists public.admins (
  id          uuid primary key references auth.users(id) on delete cascade,
  role        text not null default 'admin',   -- admin | super_admin
  created_at  timestamptz not null default now()
);

-- ---- banners ----------------------------------------------------------------
create table if not exists public.banners (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  subtitle    text,
  image_url   text not null,
  link_url    text,
  sort_order  int not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---- campaigns --------------------------------------------------------------
create table if not exists public.campaigns (
  id             uuid primary key default gen_random_uuid(),
  prize_name     text not null,
  slug           text unique,
  description    text,
  prize_image    text,
  images         text[] default '{}',       -- multiple prize images
  entry_fee      numeric(10,2) not null default 1.00,
  max_entries    int,                        -- null = unlimited
  entries_count  int not null default 0,
  winners_count  int not null default 1,
  start_date     timestamptz,
  end_date       timestamptz,
  status         campaign_status not null default 'draft',
  is_featured    boolean not null default false,
  created_by     uuid references auth.users(id) on delete set null,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index if not exists idx_campaigns_status on public.campaigns(status);
create index if not exists idx_campaigns_featured on public.campaigns(is_featured);

-- ---- coupons ----------------------------------------------------------------
create table if not exists public.coupons (
  id           uuid primary key default gen_random_uuid(),
  code         text unique not null,
  type         coupon_type not null default 'percentage',
  value        numeric(10,2) not null,        -- % or flat amount
  expiry_date  timestamptz,
  usage_limit  int,                            -- null = unlimited
  used_count   int not null default 0,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now()
);

-- ---- payments (submissions) -------------------------------------------------
create table if not exists public.payments (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  campaign_id     uuid references public.campaigns(id) on delete set null,
  amount          numeric(10,2) not null default 1.00,
  method          payment_channel not null,
  transaction_id  text,
  sender_number   text,
  receipt_url     text,                         -- payment screenshot in storage
  note            text,                         -- user optional note
  coupon_id       uuid references public.coupons(id) on delete set null,
  discount        numeric(10,2) not null default 0,
  status          payment_status not null default 'pending',
  admin_note      text,                         -- rejection reason / notes
  reviewed_by     uuid references auth.users(id) on delete set null,
  reviewed_at     timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists idx_payments_user on public.payments(user_id);
create index if not exists idx_payments_status on public.payments(status);
create index if not exists idx_payments_campaign on public.payments(campaign_id);

-- ---- payment_receipts (extra receipt files per payment) ---------------------
create table if not exists public.payment_receipts (
  id          uuid primary key default gen_random_uuid(),
  payment_id  uuid not null references public.payments(id) on delete cascade,
  file_url    text not null,
  created_at  timestamptz not null default now()
);

-- ---- tickets ----------------------------------------------------------------
create table if not exists public.tickets (
  id             uuid primary key default gen_random_uuid(),
  ticket_number  text unique not null,
  user_id        uuid not null references public.profiles(id) on delete cascade,
  campaign_id    uuid not null references public.campaigns(id) on delete cascade,
  payment_id     uuid references public.payments(id) on delete set null,
  status         ticket_status not null default 'active',
  created_at     timestamptz not null default now()
);
create index if not exists idx_tickets_user on public.tickets(user_id);
create index if not exists idx_tickets_campaign on public.tickets(campaign_id);

-- ---- winners ----------------------------------------------------------------
create table if not exists public.winners (
  id            uuid primary key default gen_random_uuid(),
  campaign_id   uuid not null references public.campaigns(id) on delete cascade,
  user_id       uuid not null references public.profiles(id) on delete cascade,
  ticket_id     uuid references public.tickets(id) on delete set null,
  prize_name    text,
  announced_at  timestamptz not null default now(),
  created_at    timestamptz not null default now()
);
create index if not exists idx_winners_campaign on public.winners(campaign_id);

-- ---- wallets ----------------------------------------------------------------
create table if not exists public.wallets (
  user_id     uuid primary key references public.profiles(id) on delete cascade,
  balance     numeric(12,2) not null default 0,
  updated_at  timestamptz not null default now()
);

-- ---- wallet_transactions ----------------------------------------------------
create table if not exists public.wallet_transactions (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  type         txn_type not null,
  amount       numeric(12,2) not null,
  balance_after numeric(12,2),
  reason       text,
  created_at   timestamptz not null default now()
);
create index if not exists idx_wallet_txn_user on public.wallet_transactions(user_id);

-- ---- referrals --------------------------------------------------------------
create table if not exists public.referrals (
  id            uuid primary key default gen_random_uuid(),
  referrer_id   uuid not null references public.profiles(id) on delete cascade,
  referred_id   uuid not null references public.profiles(id) on delete cascade,
  code          text,
  bonus_amount  numeric(10,2) not null default 0,
  status        text not null default 'pending',  -- pending | rewarded
  created_at    timestamptz not null default now(),
  unique (referred_id)
);
create index if not exists idx_referrals_referrer on public.referrals(referrer_id);

-- ---- notifications ----------------------------------------------------------
create table if not exists public.notifications (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  title       text not null,
  body        text,
  type        text not null default 'info',    -- payment | ticket | winner | referral | info
  link        text,
  is_read     boolean not null default false,
  created_at  timestamptz not null default now()
);
create index if not exists idx_notifications_user on public.notifications(user_id, is_read);

-- ---- settings (key / value config) -----------------------------------------
create table if not exists public.settings (
  key         text primary key,
  value       jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

-- ---- payment_methods (structured payout details shown to users) -------------
create table if not exists public.payment_methods (
  id             uuid primary key default gen_random_uuid(),
  method         payment_channel not null,
  account_title  text,
  account_number text,     -- mobile no. for easypaisa/jazzcash, account no. for bank
  iban           text,
  bank_name      text,
  instructions   text,
  is_active      boolean not null default true,
  sort_order     int not null default 0,
  updated_at     timestamptz not null default now()
);

-- ---- cms_pages --------------------------------------------------------------
create table if not exists public.cms_pages (
  slug        text primary key,     -- about | privacy | terms | refund | contact
  title       text not null,
  content     text,
  updated_at  timestamptz not null default now()
);

-- ---- faqs -------------------------------------------------------------------
create table if not exists public.faqs (
  id          uuid primary key default gen_random_uuid(),
  question    text not null,
  answer      text not null,
  sort_order  int not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ---- support_tickets --------------------------------------------------------
create table if not exists public.support_tickets (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references public.profiles(id) on delete set null,
  subject     text not null,
  message     text not null,
  email       text,
  status      text not null default 'open',   -- open | closed
  reply       text,
  created_at  timestamptz not null default now()
);

-- ---- activity_logs ----------------------------------------------------------
create table if not exists public.activity_logs (
  id          uuid primary key default gen_random_uuid(),
  actor_id    uuid references auth.users(id) on delete set null,
  action      text not null,
  entity      text,
  entity_id   text,
  meta        jsonb default '{}'::jsonb,
  created_at  timestamptz not null default now()
);
create index if not exists idx_activity_created on public.activity_logs(created_at desc);

-- =============================================================================
--  HELPER FUNCTIONS
-- =============================================================================

-- Is the current user an admin?
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins a where a.id = auth.uid());
$$;

-- updated_at helper
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Generate a unique ticket number: DRAW-YYYY-000001
create sequence if not exists public.ticket_seq start 1;

create or replace function public.generate_ticket_number()
returns text
language plpgsql
as $$
declare
  next_val bigint;
begin
  next_val := nextval('public.ticket_seq');
  return 'DRAW-' || to_char(now(), 'YYYY') || '-' || lpad(next_val::text, 6, '0');
end;
$$;

-- =============================================================================
--  TRIGGERS
-- =============================================================================

-- ---- updated_at on relevant tables -----------------------------------------
do $$
declare t text;
begin
  foreach t in array array['profiles','banners','campaigns','payments','wallets','settings','payment_methods','cms_pages']
  loop
    execute format('drop trigger if exists trg_%s_updated on public.%s;', t, t);
    execute format('create trigger trg_%s_updated before update on public.%s for each row execute function public.set_updated_at();', t, t);
  end loop;
end $$;

-- ---- New auth user -> profile + wallet + referral code + referral record ----
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_code text;
  ref_code text;
  referrer  uuid;
  bonus     numeric;
begin
  -- unique referral code
  new_code := upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));

  insert into public.profiles (id, email, full_name, avatar_url, referral_code)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url',
    new_code
  )
  on conflict (id) do nothing;

  insert into public.wallets (user_id) values (new.id) on conflict do nothing;

  -- referral handling
  ref_code := new.raw_user_meta_data->>'ref';
  if ref_code is not null and length(ref_code) > 0 then
    select id into referrer from public.profiles where referral_code = ref_code limit 1;
    if referrer is not null and referrer <> new.id then
      update public.profiles set referred_by = referrer where id = new.id;

      select coalesce((value->>'referral_bonus')::numeric, 0) into bonus
        from public.settings where key = 'referral';

      insert into public.referrals (referrer_id, referred_id, code, bonus_amount, status)
      values (referrer, new.id, ref_code, coalesce(bonus, 0), 'pending')
      on conflict (referred_id) do nothing;
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---- Payment approved -> generate ticket + notification ---------------------
create or replace function public.handle_payment_approval()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_ticket text;
begin
  if new.status = 'approved' and (old.status is distinct from 'approved') then
    if new.campaign_id is not null and not exists (
        select 1 from public.tickets where payment_id = new.id) then
      new_ticket := public.generate_ticket_number();

      insert into public.tickets (ticket_number, user_id, campaign_id, payment_id)
      values (new_ticket, new.user_id, new.campaign_id, new.id);

      update public.campaigns
        set entries_count = entries_count + 1
        where id = new.campaign_id;

      insert into public.notifications (user_id, title, body, type, link)
      values (new.user_id, 'Ticket Generated',
              'Your ticket ' || new_ticket || ' has been issued. Good luck!',
              'ticket', '/tickets');
    end if;

    insert into public.notifications (user_id, title, body, type, link)
    values (new.user_id, 'Payment Approved',
            'Your payment has been approved.', 'payment', '/payments');

  elsif new.status = 'rejected' and (old.status is distinct from 'rejected') then
    insert into public.notifications (user_id, title, body, type, link)
    values (new.user_id, 'Payment Rejected',
            coalesce('Reason: ' || new.admin_note, 'Your payment was rejected.'),
            'payment', '/payments');
  end if;

  return new;
end;
$$;

drop trigger if exists on_payment_status_change on public.payments;
create trigger on_payment_status_change
  after update on public.payments
  for each row execute function public.handle_payment_approval();

-- ---- Payment submitted -> confirmation notification -------------------------
create or replace function public.handle_payment_submitted()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.notifications (user_id, title, body, type, link)
  values (new.user_id, 'Payment Submitted',
          'We received your payment and it is now pending review.',
          'payment', '/payments');
  return new;
end;
$$;

drop trigger if exists on_payment_created on public.payments;
create trigger on_payment_created
  after insert on public.payments
  for each row execute function public.handle_payment_submitted();

-- =============================================================================
--  ADMIN RPC: draw winners for a campaign (SECURITY DEFINER, admin-guarded)
-- =============================================================================
create or replace function public.draw_winners(p_campaign uuid, p_count int default null)
returns setof public.winners
language plpgsql
security definer
set search_path = public
as $$
declare
  n int;
  camp public.campaigns%rowtype;
  rec record;
begin
  if not public.is_admin() then
    raise exception 'Only admins can draw winners';
  end if;

  select * into camp from public.campaigns where id = p_campaign;
  if not found then raise exception 'Campaign not found'; end if;

  n := coalesce(p_count, camp.winners_count, 1);

  for rec in
    select t.* from public.tickets t
    where t.campaign_id = p_campaign and t.status = 'active'
    order by random()
    limit n
  loop
    update public.tickets set status = 'won' where id = rec.id;

    insert into public.winners (campaign_id, user_id, ticket_id, prize_name)
    values (p_campaign, rec.user_id, rec.id, camp.prize_name)
    returning * into rec;

    insert into public.notifications (user_id, title, body, type, link)
    values (rec.user_id, 'Congratulations — You Won!',
            'You won "' || camp.prize_name || '". We will contact you shortly.',
            'winner', '/dashboard');

    return next rec;
  end loop;

  -- mark remaining tickets as lost & complete campaign
  update public.tickets set status = 'lost'
    where campaign_id = p_campaign and status = 'active';
  update public.campaigns set status = 'completed' where id = p_campaign;
end;
$$;

-- =============================================================================
--  DONE. See rls.sql for Row Level Security policies and storage.sql for buckets.
-- =============================================================================
