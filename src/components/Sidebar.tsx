import { NavLink } from "react-router-dom";
import { cn } from "../utils/cn";
import { useAuth } from "../context/AuthContext";
import { useBranding } from "../context/BrandingContext";
import { roleCanManageUsers } from "../data/mockData";

const links = [
  { to: "/", label: "Dashboard", roles: ["admin", "manager", "accountant", "agent"] },
  { to: "/products", label: "Products", roles: ["guest", "admin", "manager", "accountant", "agent"] },
  { to: "/orders", label: "Orders", roles: ["admin", "manager", "accountant"] },
  { to: "/support", label: "Support", roles: ["admin", "manager", "agent"] },
  { to: "/hr", label: "HR & Payroll", roles: ["admin", "manager", "accountant", "agent"] },
  { to: "/finance", label: "Finance", roles: ["admin", "manager", "accountant"] },
  { to: "/branding", label: "Branding", roles: ["admin"] },
  { to: "/admin/users", label: "User Access", roles: ["admin", "manager"] },
];

export const Sidebar = () => {
  const { user } = useAuth();
  const { branding } = useBranding();

  if (!user) return null;

  const filtered = links.filter((link) => link.roles.includes(user.role));

  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-200 bg-white/70 backdrop-blur">
      <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3">
        <img src={branding?.logoUrl ?? "/soc-logo.svg"} alt="Logo" className="h-10 w-10 rounded-full bg-slate-100 p-1" />
        <div>
          <p className="text-sm font-semibold">{branding?.name ?? "SmartOps Control"}</p>
          <p className="text-xs text-slate-500">{branding?.tagline ?? "Multi-tenant control center"}</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {filtered.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              cn(
                "block rounded-md px-3 py-2 text-sm font-medium transition",
                isActive ? "bg-primary text-white shadow-sm" : "text-slate-700 hover:bg-slate-100",
              )
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-slate-200 px-4 py-3 text-xs text-slate-500">
        RBAC: {user.role}
        {roleCanManageUsers(user.role) && <p className="text-[11px] text-slate-400">User provisioning enabled</p>}
      </div>
    </aside>
  );
};
