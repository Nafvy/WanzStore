-- WanzStore pricing and HypeTopup payment configuration
alter table public.store_settings
  add column if not exists margin_mode text not null default 'percent'
    check (margin_mode in ('percent', 'fixed')),
  add column if not exists margin_value numeric(14,2) not null default 20
    check (margin_value >= 0 and margin_value <= 100000000),
  add column if not exists hypetopup_enabled boolean not null default false,
  add column if not exists hypetopup_api_key text not null default '',
  add column if not exists hypetopup_secret_key text not null default '',
  add column if not exists hypetopup_webhook_secret text not null default '',
  add column if not exists hypetopup_environment text not null default 'sandbox'
    check (hypetopup_environment in ('sandbox', 'production'));

drop policy if exists "Owner and admin manage store settings" on public.store_settings;
create policy "Owner and admin manage store settings" on public.store_settings
  for all to authenticated
  using (exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid())
      and profiles.role in ('owner', 'admin')
  ))
  with check (exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid())
      and profiles.role in ('owner', 'admin')
  ));

grant select, update on public.store_settings to authenticated;
