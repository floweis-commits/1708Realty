create table if not exists vendors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  categories text[] default '{}',
  notes text,
  created_at timestamptz default now()
);

alter table vendors enable row level security;

create policy "landlord_all" on vendors for all
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'landlord'))
  with check (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'landlord'));
