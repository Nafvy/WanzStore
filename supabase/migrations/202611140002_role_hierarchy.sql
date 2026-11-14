-- WanzStore role hierarchy
-- Roles are assigned server-side; clients cannot promote their own accounts.

alter table public.profiles
  drop constraint if exists profiles_role_check;

alter table public.profiles
  add constraint profiles_role_check
  check (role in ('owner', 'admin', 'reseller', 'customer'));

alter table public.profiles
  alter column role set default 'customer';

-- Ensure existing auth accounts have a profile before assigning the store owner.
insert into public.profiles (id, username)
select id, nullif(raw_user_meta_data ->> 'username', '')
from auth.users
on conflict (id) do nothing;

update public.profiles p
set role = 'owner',
    updated_at = now()
from auth.users u
where p.id = u.id
  and lower(u.email) = lower('nafvysigma@gmail.com');

-- Keep role changes unavailable to authenticated clients.
revoke update on public.profiles from authenticated;
grant update (username, updated_at) on public.profiles to authenticated;
grant select on public.profiles to authenticated;
