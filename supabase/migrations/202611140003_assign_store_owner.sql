-- Ensure the configured store owner receives the owner role,
-- including accounts created after the original role migration.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, username, role)
  values (
    new.id,
    nullif(new.raw_user_meta_data ->> 'username', ''),
    case
      when lower(coalesce(new.email, '')) = 'nafvysigma@gmail.com' then 'owner'
      else 'customer'
    end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

insert into public.profiles (id, username, role)
select
  id,
  nullif(raw_user_meta_data ->> 'username', ''),
  case
    when lower(coalesce(email, '')) = 'nafvysigma@gmail.com' then 'owner'
    else 'customer'
  end
from auth.users
on conflict (id) do update
set role = 'owner', updated_at = now()
where lower(coalesce((select email from auth.users where auth.users.id = profiles.id), '')) = 'nafvysigma@gmail.com';
