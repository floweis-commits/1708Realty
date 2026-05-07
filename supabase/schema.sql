create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  role text not null check (role in ('tenant','landlord')),
  full_name text, email text, created_at timestamptz default now()
);

create table if not exists work_orders (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references profiles(id) on delete cascade,
  title text not null, description text,
  category text not null check (category in ('Plumbing','Electrical','HVAC / Heating / Cooling','Roof / Leak','Appliance','Pest Control','General Maintenance','Other')),
  status text not null default 'Submitted' check (status in ('Submitted','In Progress','Vendor Chosen','Completed','Closed')),
  created_at timestamptz default now(), updated_at timestamptz default now()
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references profiles(id) on delete cascade,
  stripe_customer_id text, stripe_sub_id text unique,
  amount integer,
  status text check (status in ('active','past_due','canceled','incomplete','trialing','unpaid')),
  current_period_end timestamptz, created_at timestamptz default now()
);

alter table profiles enable row level security;
alter table work_orders enable row level security;
alter table payments enable row level security;

create policy "profiles_self_read" on profiles for select using (auth.uid() = id or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'landlord'));
create policy "wo_tenant_rw" on work_orders for all using (tenant_id = auth.uid()) with check (tenant_id = auth.uid());
create policy "wo_landlord_read" on work_orders for select using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'landlord'));
create policy "wo_landlord_update" on work_orders for update using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'landlord'));
create policy "pay_tenant_read" on payments for select using (tenant_id = auth.uid());
create policy "pay_landlord_read" on payments for select using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'landlord'));

create or replace function set_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

drop trigger if exists work_orders_updated_at on work_orders;
create trigger work_orders_updated_at before update on work_orders for each row execute function set_updated_at();
