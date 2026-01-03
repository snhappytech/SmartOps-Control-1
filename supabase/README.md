# Supabase security hardening (SmartOps Control)

1) Auth
- Disable public email/password signup. Only Admin/Manager can provision accounts (via Edge Function or dashboard).
- Enable “Leaked password protection” and strong password rules in Supabase Auth.
- Configure JWT custom claims to include `role` and `tenant_id` for RLS.

2) RLS
- Apply `policies.sql` in this folder after tables are created. It enables RLS everywhere and restricts:
  - tenant isolation on all data
  - agents: only own payroll/hours/clients
  - guests: only active products
  - admin/manager/accountant: finance + investor access
  - audit logs: append-only (see commented block)

3) Edge Functions
- Require a valid JWT, verify role + tenant_id before any privileged action (e.g., provisioning users/agents, recalculating recurring expenses).
- Never ship service keys to the frontend. Use service role only inside Edge Functions.

4) Storage (if added)
- Bucket-level policies should also include tenant_id checks and disallow public writes for PII (avatars, IDs).

5) Auditing
- Keep audit_log append-only; do not allow UPDATE/DELETE to avoid tampering.
