-- WanzStore admin dashboard access and order creation
create or replace function public.is_store_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

drop policy if exists "Admins read orders" on public.orders;
create policy "Admins read orders" on public.orders
  for select to authenticated using (public.is_store_admin());

create or replace function public.admin_create_order(
  selected_service_id uuid,
  order_target text,
  order_quantity integer
)
returns table (created_order_id uuid, created_order_code text)
language plpgsql
security definer
set search_path = ''
as $$
declare
  selected_price numeric(14,2);
  new_id uuid;
  new_code text;
begin
  if not public.is_store_admin() then
    raise exception 'Akses admin diperlukan';
  end if;
  if selected_service_id is null or order_target is null or length(trim(order_target)) = 0
     or length(order_target) > 500 or order_quantity is null
     or order_quantity < 1 or order_quantity > 1000000 then
    raise exception 'Data pesanan tidak valid';
  end if;

  select price into selected_price
  from public.services
  where id = selected_service_id and active = true;

  if not found then
    raise exception 'Layanan tidak tersedia';
  end if;

  insert into public.orders(user_id, service_id, customer_email, target, quantity, total, status)
  values ((select auth.uid()), selected_service_id,
    coalesce((select email::text from auth.users where id = (select auth.uid())), ''),
    trim(order_target), order_quantity, selected_price * order_quantity, 'pending')
  returning id, order_code into new_id, new_code;

  return query select new_id, new_code;
end;
$$;

grant execute on function public.is_store_admin() to authenticated;
grant execute on function public.admin_create_order(uuid,text,integer) to authenticated;
