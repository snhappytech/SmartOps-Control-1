-- SmartOps Control RLS and policy definitions
-- Run in Supabase SQL editor after creating tables.

-- Enable RLS on all tables
alter table public.user_profiles enable row level security;
alter table public.tenant_branding enable row level security;
alter table public.agents enable row level security;
alter table public.employees enable row level security;
alter table public.clients enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.revenue_entries enable row level security;
alter table public.payroll_entries enable row level security;
alter table public.expenses enable row level security;
alter table public.recurring_expenses enable row level security;
alter table public.recurring_instances enable row level security;
alter table public.investors enable row level security;
alter table public.notifications enable row level security;
alter table public.support_tickets enable row level security;
alter table public.announcements enable row level security;

-- Helper: tenant isolation
create policy "tenant-isolation-select" on public.user_profiles
  for select using (auth.jwt() ->> 'tenant_id' = tenant_id);

create policy "tenant-isolation-all" on public.user_profiles
  for all using (auth.jwt() ->> 'tenant_id' = tenant_id)
  with check (auth.jwt() ->> 'tenant_id' = tenant_id);

-- user_profiles: only admin/manager can manage; self can read own profile
create policy "user-read-own" on public.user_profiles
  for select using (id = auth.uid());

create policy "user-admin-manage" on public.user_profiles
  for all using (
    auth.jwt() ->> 'role' in ('admin','manager')
    and auth.jwt() ->> 'tenant_id' = tenant_id
  ) with check (
    auth.jwt() ->> 'role' in ('admin','manager')
    and auth.jwt() ->> 'tenant_id' = tenant_id
  );

-- tenant_branding: admin only
create policy "branding-admin-only" on public.tenant_branding
  for all using (
    auth.jwt() ->> 'role' = 'admin'
    and auth.jwt() ->> 'tenant_id' = tenant_id
  ) with check (
    auth.jwt() ->> 'role' = 'admin'
    and auth.jwt() ->> 'tenant_id' = tenant_id
  );

-- agents: admin/manager manage; agents read self
create policy "agents-read-self" on public.agents
  for select using (auth.jwt() ->> 'sub' = id);

create policy "agents-manage" on public.agents
  for all using (
    auth.jwt() ->> 'role' in ('admin','manager')
    and auth.jwt() ->> 'tenant_id' = tenant_id
  ) with check (
    auth.jwt() ->> 'role' in ('admin','manager')
    and auth.jwt() ->> 'tenant_id' = tenant_id
  );

-- employees: admin/manager manage; same tenant read
create policy "employees-read" on public.employees
  for select using (auth.jwt() ->> 'tenant_id' = tenant_id);
create policy "employees-manage" on public.employees
  for all using (
    auth.jwt() ->> 'role' in ('admin','manager')
    and auth.jwt() ->> 'tenant_id' = tenant_id
  ) with check (
    auth.jwt() ->> 'role' in ('admin','manager')
    and auth.jwt() ->> 'tenant_id' = tenant_id
  );

-- clients: admin/manager manage; agents only read assigned
create policy "clients-agent-read-assigned" on public.clients
  for select using (
    auth.jwt() ->> 'role' = 'agent'
    and auth.jwt() ->> 'tenant_id' = tenant_id
    and assigned_agent_id = auth.jwt() ->> 'sub'
  );
create policy "clients-admin-manager-read" on public.clients
  for select using (
    auth.jwt() ->> 'role' in ('admin','manager')
    and auth.jwt() ->> 'tenant_id' = tenant_id
  );
create policy "clients-admin-manager-write" on public.clients
  for all using (
    auth.jwt() ->> 'role' in ('admin','manager')
    and auth.jwt() ->> 'tenant_id' = tenant_id
  ) with check (
    auth.jwt() ->> 'role' in ('admin','manager')
    and auth.jwt() ->> 'tenant_id' = tenant_id
  );

-- products: guests can read active only, tenant-scoped
create policy "products-guest-public" on public.products
  for select using (is_active = true);
create policy "products-tenant-manage" on public.products
  for all using (auth.jwt() ->> 'tenant_id' = tenant_id)
  with check (auth.jwt() ->> 'tenant_id' = tenant_id);

-- revenue_entries: admin/manager/accountant full; agent read own; tax based on total revenue
create policy "revenue-agent-read-own" on public.revenue_entries
  for select using (
    auth.jwt() ->> 'role' = 'agent'
    and auth.jwt() ->> 'tenant_id' = tenant_id
    and coalesce(agent_id, '') = auth.jwt() ->> 'sub'
  );
create policy "revenue-admin-manage" on public.revenue_entries
  for all using (
    auth.jwt() ->> 'role' in ('admin','manager','accountant')
    and auth.jwt() ->> 'tenant_id' = tenant_id
  ) with check (
    auth.jwt() ->> 'role' in ('admin','manager','accountant')
    and auth.jwt() ->> 'tenant_id' = tenant_id
  );

-- payroll_entries: agent read own only
create policy "payroll-agent-read-own" on public.payroll_entries
  for select using (
    auth.jwt() ->> 'role' = 'agent'
    and auth.jwt() ->> 'tenant_id' = tenant_id
    and agent_id = auth.jwt() ->> 'sub'
  );
create policy "payroll-admin-manage" on public.payroll_entries
  for all using (
    auth.jwt() ->> 'role' in ('admin','manager','accountant')
    and auth.jwt() ->> 'tenant_id' = tenant_id
  ) with check (
    auth.jwt() ->> 'role' in ('admin','manager','accountant')
    and auth.jwt() ->> 'tenant_id' = tenant_id
  );

-- expenses + recurring (include employee salaries in calculations)
create policy "expenses-tenant-read" on public.expenses
  for select using (auth.jwt() ->> 'tenant_id' = tenant_id);
create policy "expenses-admin-manage" on public.expenses
  for all using (
    auth.jwt() ->> 'role' in ('admin','manager','accountant')
    and auth.jwt() ->> 'tenant_id' = tenant_id
  ) with check (
    auth.jwt() ->> 'role' in ('admin','manager','accountant')
    and auth.jwt() ->> 'tenant_id' = tenant_id
  );

create policy "recurring-tenant-read" on public.recurring_expenses
  for select using (auth.jwt() ->> 'tenant_id' = tenant_id);
create policy "recurring-admin-manage" on public.recurring_expenses
  for all using (
    auth.jwt() ->> 'role' in ('admin','manager','accountant')
    and auth.jwt() ->> 'tenant_id' = tenant_id
  ) with check (
    auth.jwt() ->> 'role' in ('admin','manager','accountant')
    and auth.jwt() ->> 'tenant_id' = tenant_id
  );

create policy "recurring-instances-tenant-read" on public.recurring_instances
  for select using (auth.jwt() ->> 'tenant_id' = tenant_id);

-- investors: admin/manager/accountant read/write; agents blocked
create policy "investors-manage" on public.investors
  for all using (
    auth.jwt() ->> 'role' in ('admin','manager','accountant')
    and auth.jwt() ->> 'tenant_id' = tenant_id
  ) with check (
    auth.jwt() ->> 'role' in ('admin','manager','accountant')
    and auth.jwt() ->> 'tenant_id' = tenant_id
  );

-- notifications: tenant scoped; unread/read update only within tenant
create policy "notifications-tenant-read" on public.notifications
  for select using (auth.jwt() ->> 'tenant_id' = tenant_id);
create policy "notifications-tenant-update" on public.notifications
  for update using (auth.jwt() ->> 'tenant_id' = tenant_id)
  with check (auth.jwt() ->> 'tenant_id' = tenant_id);

-- support tickets and announcements: tenant scoped
create policy "tickets-tenant-all" on public.support_tickets
  for all using (auth.jwt() ->> 'tenant_id' = tenant_id)
  with check (auth.jwt() ->> 'tenant_id' = tenant_id);

create policy "announcements-tenant-all" on public.announcements
  for all using (auth.jwt() ->> 'tenant_id' = tenant_id)
  with check (auth.jwt() ->> 'tenant_id' = tenant_id);

-- Audit logs (if implemented) should be append-only; example:
-- alter table public.audit_logs enable row level security;
-- create policy "audit-append-only" on public.audit_logs
--   for insert using (auth.jwt() ->> 'tenant_id' = tenant_id)
--   with check (auth.jwt() ->> 'tenant_id' = tenant_id);
-- revoke update, delete on public.audit_logs from authenticated, anon;

-- Leaked password protection: enable in Supabase Auth -> Password Strength settings.
-- Edge functions must validate JWT + role/tenant before privileged actions.
