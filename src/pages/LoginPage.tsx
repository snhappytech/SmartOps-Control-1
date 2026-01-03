import { useAuth } from "../context/AuthContext";
import { Card } from "../components/ui/Card";
import { useNavigate } from "react-router-dom";
import type { Role } from "../types";

const demoRoles: { label: string; role: Role }[] = [
  { label: "Admin", role: "admin" },
  { label: "Manager", role: "manager" },
  { label: "Accountant", role: "accountant" },
  { label: "Agent", role: "agent" },
];

export const LoginPage = () => {
  const { loginAs } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (role: Role) => {
    loginAs(role);
    if (role === "guest") {
      navigate("/products");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">Access</p>
        <h1 className="text-2xl font-bold text-slate-900">Sign in (RBAC enforced)</h1>
        <p className="text-sm text-slate-600">
          No public signup. Admin/Manager provision users (Supabase Auth email/password). Guests may only browse products.
        </p>
      </div>

      <Card title="Demo roles">
        <div className="grid gap-3 md:grid-cols-2">
          {demoRoles.map((role) => (
            <button
              key={role.role}
              onClick={() => handleLogin(role.role)}
              className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-left text-sm font-semibold text-slate-800 transition hover:border-primary hover:shadow-sm"
            >
              {role.label}
            </button>
          ))}
          <button
            onClick={() => handleLogin("guest")}
            className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-left text-sm font-semibold text-emerald-800 transition hover:border-emerald-400 hover:shadow-sm"
          >
            Continue as Guest (Products only)
          </button>
        </div>
      </Card>
    </div>
  );
};
