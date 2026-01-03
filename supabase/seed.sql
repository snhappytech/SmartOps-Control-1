insert into public.user_profiles (id, tenant_id, role, status, name, email)
values
  ('u-admin', 'tenant-smartops', 'admin', 'active', 'Alex Admin', 'admin@smartops.control'),
  ('u-manager', 'tenant-smartops', 'manager', 'active', 'Morgan Manager', 'manager@smartops.control'),
  ('u-accountant', 'tenant-smartops', 'accountant', 'active', 'Avery Accountant', 'accountant@smartops.control'),
  ('ag-001', 'tenant-smartops', 'agent', 'active', 'Casey Agent', 'agent@smartops.control'),
  ('ag-002', 'tenant-smartops', 'agent', 'active', 'Taylor Agent', 'taylor.agent@smartops.control');

insert into public.agents (id, tenant_id, full_name, address, phone, email, birthday_date, photo_url, agent_code, hourly_rate, status)
values
  ('ag-001', 'tenant-smartops', 'Casey Agent', '123 Market St', '+1 555-1001', 'agent@smartops.control', '1996-10-04', 'https://placekitten.com/140/140', 'AGT-001', 22, 'active'),
  ('ag-002', 'tenant-smartops', 'Taylor Agent', '88 King St', '+1 555-1002', 'taylor.agent@smartops.control', '1994-11-12', 'https://placekitten.com/141/141', 'AGT-002', 24, 'active');

insert into public.employees (id, tenant_id, full_name, phone, email, birthday_date, photo_url, monthly_salary, tasks, status)
values
  ('emp-001', 'tenant-smartops', 'Jordan Support', '+1 555-2001', 'jordan@smartops.control', '1990-10-12', 'https://placekitten.com/142/142', 4200, 'People Ops & onboarding', 'active'),
  ('emp-002', 'tenant-smartops', 'Riley Finance', '+1 555-2002', 'riley@smartops.control', null, null, 5300, 'Accounting & payroll approvals', 'active');

insert into public.clients (id, tenant_id, full_name, email, phone_number, address, project_name, appointment_date, appointment_time, assigned_agent_id)
values
  ('client-1', 'tenant-smartops', 'Nova Telecom', 'ops@novatelecom.com', '+1 555-3001', '88 Sunset Blvd', 'Renewal', '2024-10-11', '17:00', 'ag-001'),
  ('client-2', 'tenant-smartops', 'Helio Support', 'hello@heliosupport.com', '+1 555-3002', '42 Lake View', 'Onboarding', '2024-10-10', '15:00', 'ag-001'),
  ('client-3', 'tenant-smartops', 'Airlift Corp', 'team@airlift.com', '+1 555-3003', '11 Harbor Way', 'Implementation', '2024-10-18', '10:00', 'ag-002');

insert into public.products (id, tenant_id, name, description, image_url, category, price, is_active)
values
  ('prod-ai-assist', 'tenant-smartops', 'AI Call Assist', 'Realtime AI assistance for call agents with sentiment and script guidance.', null, 'SaaS', 79, true),
  ('prod-quality', 'tenant-smartops', 'Quality Tracker', 'QA scorecards, coaching, and compliance automation.', null, 'SaaS', 59, true),
  ('prod-legacy', 'tenant-smartops', 'Legacy Archive', 'Archived data access', null, 'Service', 25, false);

insert into public.revenue_entries (id, tenant_id, entry_date, hours_worked, contract_rate_per_hour, revenue_amount, agent_id)
values
  ('rev-1', 'tenant-smartops', '2024-10-01', 6, 80, 480, 'ag-001'),
  ('rev-2', 'tenant-smartops', '2024-10-02', 5, 90, 450, 'ag-002'),
  ('rev-3', 'tenant-smartops', '2024-09-15', 8, 85, 680, 'ag-001');

insert into public.payroll_entries (id, tenant_id, payroll_date, agent_id, hours_paid, pay_amount)
values
  ('pay-1', 'tenant-smartops', '2024-09-28', 'ag-001', 32, 704),
  ('pay-2', 'tenant-smartops', '2024-10-05', 'ag-002', 18, 432);

insert into public.expenses (id, tenant_id, expense_date, amount, category, description)
values
  ('exp-1', 'tenant-smartops', '2024-10-03', 1200, 'Software', 'Dialer seats'),
  ('exp-2', 'tenant-smartops', '2024-10-05', 980, 'Training', 'QA workshop');

insert into public.recurring_expenses (id, tenant_id, name, amount, is_active, day_of_month, category, description)
values
  ('rec-1', 'tenant-smartops', 'Office Lease', 5500, true, 1, 'Rent', 'Monthly rent'),
  ('rec-2', 'tenant-smartops', 'Dialer subscription', 1400, true, 5, 'Software', 'Per seat billing');

insert into public.recurring_instances (id, tenant_id, template_id, month, expense_date, amount, category)
values
  ('rec-inst-1', 'tenant-smartops', 'rec-1', '2024-10', '2024-10-01', 5500, 'Rent'),
  ('rec-inst-2', 'tenant-smartops', 'rec-2', '2024-10', '2024-10-05', 1400, 'Software');

insert into public.investors (id, tenant_id, name, percent_share)
values
  ('inv-1', 'tenant-smartops', 'Northstar Capital', 0.12),
  ('inv-2', 'tenant-smartops', 'Summit Ventures', 0.08);

insert into public.notifications (id, tenant_id, type, title, message, created_at, is_read)
values
  ('n1', 'tenant-smartops', 'birthday', 'Birthday', 'Wish Casey Agent a happy birthday!', now(), false),
  ('n2', 'tenant-smartops', 'top_agent', 'Agent of the Month', 'Casey Agent is leading hours for October.', now(), true),
  ('n3', 'tenant-smartops', 'recurring_expense', 'Recurring Expense', 'Dialer subscription posted for October.', now(), false);

insert into public.tenant_branding (tenant_id, app_name, logo_url, primary_color, accent_color)
values ('tenant-smartops', 'SmartOps Control', '/soc-logo.svg', '#0F6FFF', '#0B1840')
on conflict (tenant_id) do nothing;
