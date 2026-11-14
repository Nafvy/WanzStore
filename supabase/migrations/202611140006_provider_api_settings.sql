-- Provider API settings managed from the WanzStore dashboard.
create table if not exists public.provider_configs (
  id uuid primary key default gen_random_uuid(),
  provider_name text not null default 'SprintPedia',
  endpoint text not null,
  api_key text not null,
  api_key_param text not null default 'key',
  action_param text not null default 'action',
  balance_action text not null default 'balance',
  services_action text not null default 'services',
  add_action text not null default 'add',
  status_action text not null default 'status',
  request_method text not null default 'POST' check (request_method in ('POST')),
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.provider_configs enable row level security;

drop policy if exists "Owners and admins manage provider configs" on public.provider_configs;
create policy "Owners and admins manage provider configs"
on public.provider_configs
for all to authenticated
using (
  exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid())
      and profiles.role in ('owner', 'admin')
  )
)
with check (
  exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid())
      and profiles.role in ('owner', 'admin')
  )
);

grant select, insert, update, delete on public.provider_configs to authenticated;
