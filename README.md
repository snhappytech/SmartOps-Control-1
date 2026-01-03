# SmartOps Control

SmartOps Control is a multi-tenant, white-label call center operations control app built with React, TypeScript, Tailwind, React Query, and Supabase (Postgres/Auth/Storage/RLS). The app enforces strict RBAC, removes public signup, and keeps agent/guest access limited while providing dashboards for operations, finance, support, products, payroll, revenue/hours, agents/employees, clients, notifications, and large-screen views.

## Requirements coverage
- Roles: admin, manager, accountant, agent, guest (guest = unauthenticated).
- No public signup; user provisioning only by admin/manager.
- Multi-tenant white-label: tenant_id on domain data and configurable branding (logo, colors, name).
- RBAC enforced in UI routing and module visibility; agent role cannot see finance totals/reports; guest limited to public product catalog.
- Supabase-ready client plus UI for operations (tickets, bookings, roster), finance (revenue/expenses/profit/tax), HR/payroll (hours, payroll, attendance), commerce (products/orders/payments), revenue & hours, recurring expenses, investor payouts, notifications, and access control (user management + agent/employee creation).
- Branding is editable from the Branding page and applies across the UI, large-screen views (birthday / agent of month), and exports. Default brand is “SmartOps Control.”
- No signup flow is exposed; login is role-based only. Admin/Manager provisioning is required to create users and agents.
- Error handling with retry buttons and non-blocking loaders.

## Getting started
1. Install dependencies
   ```bash
   npm install
   ```
2. Run the dev server
   ```bash
   npm run dev
   ```
3. Environment variables
   ```bash
   VITE_SUPABASE_URL=<your-url>
   VITE_SUPABASE_ANON_KEY=<your-anon-key>
   ```

The app ships with mock data to demo flows without a live backend; replace the mock API calls with Supabase queries and Edge Functions for privileged actions (e.g., provisioning users). Branding is editable from the Branding page and applies across the UI.
