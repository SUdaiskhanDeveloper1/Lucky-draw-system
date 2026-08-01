-- =============================================================================
--  Seed data — default settings, payment methods, CMS pages, sample content
--  Run AFTER schema.sql / rls.sql / storage.sql
-- =============================================================================

-- ---- Site settings (key/value jsonb) ---------------------------------------
insert into public.settings (key, value) values
  ('general', jsonb_build_object(
      'site_name', 'Rs.1 Lucky Draw',
      'logo_url', '',
      'favicon_url', '',
      'primary_color', '#7c3aed',
      'maintenance_mode', false
  )),
  ('contact', jsonb_build_object(
      'email', 'support@luckydraw.pk',
      'phone', '+92 300 0000000',
      'address', 'Karachi, Pakistan',
      'whatsapp', '+92 300 0000000'
  )),
  ('social', jsonb_build_object(
      'facebook', 'https://facebook.com',
      'instagram', 'https://instagram.com',
      'youtube', 'https://youtube.com',
      'tiktok', ''
  )),
  ('referral', jsonb_build_object(
      'referral_bonus', 50,
      'referral_commission', 5
  )),
  ('email', jsonb_build_object('from_name', 'Rs.1 Lucky Draw', 'from_email', 'no-reply@luckydraw.pk')),
  ('sms',   jsonb_build_object('provider', '', 'api_key', ''))
on conflict (key) do nothing;

-- ---- Payment methods --------------------------------------------------------
insert into public.payment_methods (method, account_title, account_number, bank_name, iban, instructions, sort_order) values
  ('easypaisa',     'Lucky Draw Official', '0300-0000000', null, null, 'Send Rs.1 to this Easypaisa number and upload the screenshot.', 1),
  ('jazzcash',      'Lucky Draw Official', '0300-0000000', null, null, 'Send Rs.1 to this JazzCash number and upload the screenshot.', 2),
  ('bank_transfer', 'Lucky Draw Pvt Ltd',  '01234567890123', 'Meezan Bank', 'PK00MEZN0000000000000000', 'Transfer to this account and upload the receipt.', 3)
on conflict do nothing;

-- ---- CMS pages --------------------------------------------------------------
insert into public.cms_pages (slug, title, content) values
  ('about',   'About Us',            'We run transparent Rs.1 lucky draws across Pakistan.'),
  ('privacy', 'Privacy Policy',      'Your data is protected and never shared without consent.'),
  ('terms',   'Terms & Conditions',  'By joining a draw you agree to our terms. Must be 18+.'),
  ('refund',  'Refund Policy',       'Entry fees are non-refundable once a payment is approved.'),
  ('contact', 'Contact Us',          'Reach us any time via the contact form or WhatsApp.')
on conflict (slug) do nothing;

-- ---- FAQs -------------------------------------------------------------------
insert into public.faqs (question, answer, sort_order) values
  ('How much does it cost to enter?', 'Just Rs.1 per entry for most campaigns.', 1),
  ('How are winners chosen?',         'Winners are drawn randomly from all approved tickets.', 2),
  ('When do I get my ticket?',        'A unique ticket is generated automatically once an admin approves your payment.', 3),
  ('How will I know if I win?',       'You will receive an in-app notification and we will contact you directly.', 4)
on conflict do nothing;

-- ---- Sample banners ---------------------------------------------------------
insert into public.banners (title, subtitle, image_url, sort_order, is_active) values
  ('Win Big for Just Rs.1', 'Join thousands of winners across Pakistan', 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=1600', 1, true),
  ('New iPhone Draw Live',  'Enter now before entries close',            'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1600', 2, true)
on conflict do nothing;

-- ---- Sample campaigns -------------------------------------------------------
insert into public.campaigns (prize_name, slug, description, prize_image, entry_fee, max_entries, winners_count, start_date, end_date, status, is_featured)
values
  ('iPhone 15 Pro Max', 'iphone-15-pro-max', 'Brand new 256GB, sealed box.', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800', 1, 5000, 1, now() - interval '2 days', now() + interval '10 days', 'active', true),
  ('Honda CD 70 Bike',  'honda-cd-70', 'Latest model, registered.', 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800', 1, 10000, 1, now() - interval '1 day', now() + interval '20 days', 'active', false),
  ('PKR 100,000 Cash',  'cash-100k', 'Straight cash prize to your account.', 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=800', 1, 8000, 2, now(), now() + interval '15 days', 'active', false)
on conflict (slug) do nothing;

-- =============================================================================
--  To make yourself an admin, run (replace the email):
--
--    insert into public.admins (id, role)
--    select id, 'super_admin' from auth.users where email = 'you@example.com'
--    on conflict (id) do nothing;
-- =============================================================================
