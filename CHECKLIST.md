# SmartOps Control verification checklist

- [ ] Guest can only access `/products` and `/products/:id` (active products only).
- [ ] Agent cannot open Finance or Orders routes (UI redirect + policy).
- [ ] Agent sees only their payroll/hours/assigned clients/projects.
- [ ] Admin/Manager can create users via provisioning flow; signup is not exposed.
- [ ] Admin/Manager can create agents/employees and clients; agents cannot create clients.
- [ ] Revenue totals include tax calculation; recurring expenses + salaries roll into expenses.
- [ ] Investor payout uses net profit * percent_share.
- [ ] Period selector updates dashboard, revenue, and finance summaries.
- [ ] Sidebar stays fixed on desktop while page scrolls; long forms show vertical scrollbar.
- [ ] Notifications center allows marking unread → read.
- [ ] RLS policies deployed; tenant_id matches JWT; guests limited to active products.
- [ ] Edge function `provision-user` requires JWT with admin/manager role and tenant_id.
