alter table public.provider_configs
  add column if not exists secret_key text;

comment on column public.provider_configs.secret_key is
  'SprintPedia secret key; server-side only.';
