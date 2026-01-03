-- Initial schema for SmartOps Control (tenant-aware)
create table if not exists public.user_profiles (
  id uuid primary key references auth.users on delete cascade,
  tenant_id text not null,
  role text not null check (role in ('admin','manager','accountant','agent')),
  status text not null default 'active',
  name text not null,
  email text not null,
  created_at timestamptz default now()
);

create table if not exists public.tenant_branding (
  tenant_id text primary key,
  app_name text not null,
  logo_url text,
  primary_color text,
  accent_color text,
  updated_at timestamptz default now()
);

create table if not exists public.agents (
  id text primary key,
  tenant_id text not null,
  full_name text not null,
  address text,
  phone text,
  email text not null,
  birthday_date date,
  photo_url text,
  agent_code text not null,
  hourly_rate numeric not null default 0,
  status text not null default 'active'
);

create table if not exists public.employees (
  id text primary key,
  tenant_id text not null,
  full_name text not null,
  phone text,
  email text,
  birthday_date date,
  photo_url text,
  monthly_salary numeric not null default 0,
  tasks text,
  status text not null default 'active'
);

create table if not exists public.clients (
  id text primary key,
  tenant_id text not null,
  full_name text not null,
  email text not null,
  phone_number text not null,
  address text not null,
  project_name text not null,
  appointment_date date not null,
  appointment_time text not null,
  assigned_agent_id text not null
);

create table if not exists public.products (
  id text primary key,
  tenant_id text not null,
  name text not null,
  description text,
  image_url text,
  category text,
  price numeric,
  is_active boolean default true
);

create table if not exists public.orders (
  id text primary key,
  tenant_id text not null,
  product_id text not null references public.products(id) on delete cascade,
  amount numeric not null,
  status text not null,
  payment_type text not null,
  customer_name text not null,
  created_at date not null default current_date
);

create table if not exists public.revenue_entries (
  id text primary key,
  tenant_id text not null,
  entry_date date not null default current_date,
  hours_worked numeric not null,
  contract_rate_per_hour numeric not null,
  revenue_amount numeric not null,
  agent_id text
);

create table if not exists public.payroll_entries (
  id text primary key,
  tenant_id text not null,
  payroll_date date not null,
  agent_id text not null,
  hours_paid numeric not null,
  pay_amount numeric not null
);

create table if not exists public.expenses (
  id text primary key,
  tenant_id text not null,
  expense_date date not null,
  amount numeric not null,
  category text not null,
  description text
);

create table if not exists public.recurring_expenses (
  id text primary key,
  tenant_id text not null,
  name text not null,
  amount numeric not null,
  is_active boolean default true,
  day_of_month integer not null,
  category text not null,
  description text
);

create table if not exists public.recurring_instances (
  id text primary key,
  tenant_id text not null,
  template_id text not null,
  month text not null,
  expense_date date not null,
  amount numeric not null,
  category text not null
);

create table if not exists public.investors (
  id text primary key,
  tenant_id text not null,
  name text not null,
  percent_share numeric not null
);

create table if not exists public.notifications (
  id text primary key,
  tenant_id text not null,
  type text not null,
  title text not null,
  message text not null,
  created_at timestamptz default now(),
  is_read boolean default false
);

create table if not exists public.support_tickets (
  id text primary key,
  tenant_id text not null,
  title text not null,
  status text not null,
  priority text not null,
  assignee_id text,
  created_at timestamptz default now()
);

create table if not exists public.announcements (
  id text primary key,
  tenant_id text not null,
  message text not null,
  audience text[] not null,
  created_at date default current_date
);
