create table public.cloud_backups (
  cloud_code text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.cloud_backups enable row level security;

create policy "Public read by code"
  on public.cloud_backups for select
  using (true);

create policy "Public insert"
  on public.cloud_backups for insert
  with check (true);

create policy "Public update"
  on public.cloud_backups for update
  using (true)
  with check (true);