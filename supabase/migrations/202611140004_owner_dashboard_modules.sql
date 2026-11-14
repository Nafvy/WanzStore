-- WanzStore owner dashboard modules
create or replace function public.is_store_owner()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'owner'
  );
$$;

create table if not exists public.store_settings (
  id boolean primary key default true check (id),
  store_name text not null default 'WanzStore',
  store_description text not null default 'Layanan digital terpercaya.',
  support_contact text not null default '',
  maintenance_mode boolean not null default false,
  updated_at timestamptz not null default now()
);
insert into public.store_settings (id) values (true) on conflict (id) do nothing;

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null default 'Umum',
  description text not null default '',
  price numeric(14,2) not null default 0 check (price >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_code text not null unique default ('WZ-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10))),
  user_id uuid references auth.users(id) on delete set null,
  service_id uuid references public.services(id) on delete set null,
  customer_email text not null default '',
  target text not null default '',
  quantity integer not null default 1 check (quantity > 0),
  total numeric(14,2) not null default 0 check (total >= 0),
  status text not null default 'pending' check (status in ('pending','processing','completed','failed','cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.owner_activity_logs (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  detail text not null default '',
  created_at timestamptz not null default now()
);

alter table public.store_settings enable row level security;
alter table public.services enable row level security;
alter table public.orders enable row level security;
alter table public.owner_activity_logs enable row level security;

drop policy if exists "Owner manages store settings" on public.store_settings;
create policy "Owner manages store settings" on public.store_settings
  for all to authenticated using (public.is_store_owner()) with check (public.is_store_owner());
drop policy if exists "Public reads active services" on public.services;
create policy "Public reads active services" on public.services
  for select to anon, authenticated using (active or public.is_store_owner());
drop policy if exists "Owner manages services" on public.services;
create policy "Owner manages services" on public.services
  for all to authenticated using (public.is_store_owner()) with check (public.is_store_owner());
drop policy if exists "Owner reads all orders" on public.orders;
create policy "Owner reads all orders" on public.orders
  for select to authenticated using (public.is_store_owner());
drop policy if exists "Owner updates orders" on public.orders;
create policy "Owner updates orders" on public.orders
  for update to authenticated using (public.is_store_owner()) with check (public.is_store_owner());
drop policy if exists "Owner reads activity logs" on public.owner_activity_logs;
create policy "Owner reads activity logs" on public.owner_activity_logs
  for select to authenticated using (public.is_store_owner());

create or replace function public.owner_list_users()
returns table (id uuid, email text, username text, role text, created_at timestamptz)
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_store_owner() then raise exception 'Akses pemilik toko diperlukan'; end if;
  return query
    select u.id, u.email::text, p.username, p.role, u.created_at
    from auth.users u
    left join public.profiles p on p.id = u.id
    order by u.created_at desc;
end;
$$;

create or replace function public.owner_set_user_role(target_user_id uuid, new_role text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare target_role text;
begin
  if not public.is_store_owner() then raise exception 'Akses pemilik toko diperlukan'; end if;
  if new_role not in ('admin','reseller','customer') then raise exception 'Role tidak valid'; end if;
  select role into target_role from public.profiles where id = target_user_id for update;
  if not found then raise exception 'Profil pengguna tidak ditemukan'; end if;
  if target_role = 'owner' or target_user_id = (select auth.uid()) then
    raise exception 'Role pemilik dan akun sendiri tidak dapat diubah dari menu ini';
  end if;
  update public.profiles set role = new_role, updated_at = now() where id = target_user_id;
  insert into public.owner_activity_logs(actor_id, action, detail)
  values ((select auth.uid()), 'user.role.updated', target_user_id::text || ' → ' || new_role);
end;
$$;

create or replace function public.owner_update_store(
  new_name text, new_description text, new_contact text, new_maintenance boolean
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_store_owner() then raise exception 'Akses pemilik toko diperlukan'; end if;
  update public.store_settings set store_name = left(trim(new_name), 80),
    store_description = left(trim(new_description), 300),
    support_contact = left(trim(new_contact), 120),
    maintenance_mode = new_maintenance, updated_at = now()
  where id = true;
  insert into public.owner_activity_logs(actor_id, action, detail)
  values ((select auth.uid()), 'store.settings.updated', 'Pengaturan toko diperbarui');
end;
$$;

create or replace function public.owner_save_service(
  service_id uuid, service_name text, service_category text, service_description text,
  service_price numeric, service_active boolean
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare saved_id uuid;
begin
  if not public.is_store_owner() then raise exception 'Akses pemilik toko diperlukan'; end if;
  if trim(service_name) = '' or service_price < 0 then raise exception 'Nama dan harga layanan wajib valid'; end if;
  if service_id is null then
    insert into public.services(name, category, description, price, active)
    values (left(trim(service_name),100), left(trim(service_category),60), left(trim(service_description),500), service_price, service_active)
    returning id into saved_id;
  else
    update public.services set name=left(trim(service_name),100), category=left(trim(service_category),60),
      description=left(trim(service_description),500), price=service_price, active=service_active, updated_at=now()
    where id=service_id returning id into saved_id;
    if saved_id is null then raise exception 'Layanan tidak ditemukan'; end if;
  end if;
  insert into public.owner_activity_logs(actor_id, action, detail)
  values ((select auth.uid()), 'service.saved', service_name);
  return saved_id;
end;
$$;

create or replace function public.owner_update_order_status(target_order_id uuid, new_status text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare old_status text;
begin
  if not public.is_store_owner() then raise exception 'Akses pemilik toko diperlukan'; end if;
  if new_status not in ('pending','processing','completed','failed','cancelled') then raise exception 'Status tidak valid'; end if;
  update public.orders set status=new_status, updated_at=now()
  where id=target_order_id returning status into old_status;
  if not found then raise exception 'Pesanan tidak ditemukan'; end if;
  insert into public.owner_activity_logs(actor_id, action, detail)
  values ((select auth.uid()), 'order.status.updated', target_order_id::text || ' → ' || new_status);
end;
$$;

grant execute on function public.is_store_owner() to anon, authenticated;
grant execute on function public.owner_list_users() to authenticated;
grant execute on function public.owner_set_user_role(uuid,text) to authenticated;
grant execute on function public.owner_update_store(text,text,text,boolean) to authenticated;
grant execute on function public.owner_save_service(uuid,text,text,text,numeric,boolean) to authenticated;
grant execute on function public.owner_update_order_status(uuid,text) to authenticated;
grant select on public.services to anon;
grant select, insert, update, delete on public.store_settings, public.services, public.orders, public.owner_activity_logs to authenticated;
