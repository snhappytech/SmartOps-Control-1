import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "../components/ui/Card";
import { ErrorState } from "../components/ui/ErrorState";
import { createUser, fetchAnnouncements, fetchUserByRole } from "../data/mockApi";
import { roleCanManageUsers, users } from "../data/mockData";
import type { Role, User } from "../types";
import { useAuth } from "../context/AuthContext";

const roleOptions: Role[] = ["admin", "manager", "accountant", "agent"];

export const AdminUsersPage = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [newUser, setNewUser] = useState<User>({
    id: "new",
    name: "",
    email: "",
    role: "agent",
    tenantId: "tenant-smartops",
    password: "",
    status: "active",
  });

  const { data: adminUser, isError, refetch } = useQuery({
    queryKey: ["user", "admin"],
    queryFn: () => fetchUserByRole("admin"),
  });
  const { data: announcementData } = useQuery({ queryKey: ["announcements"], queryFn: fetchAnnouncements });

  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const handleCreate = () => {
    mutation.mutate({
      ...newUser,
      id: `user-${Date.now()}`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Access Control</p>
          <h1 className="text-2xl font-bold text-slate-900">User provisioning (No public signup)</h1>
          <p className="text-sm text-slate-600">Only admin/manager can create users + roles. Tenant RLS enforced.</p>
        </div>
        <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          RBAC Strict
        </div>
      </div>

      {!roleCanManageUsers(user?.role ?? "guest") ? (
        <ErrorState message="You do not have permission to manage users" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <Card title="Create user" description="Admin + Manager only">
            <label className="text-sm text-slate-700">
              Name
              <input
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
            </label>
            <label className="mt-3 block text-sm text-slate-700">
              Email
              <input
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </label>
            <label className="mt-3 block text-sm text-slate-700">
              Password
              <input
                type="password"
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              />
              <p className="text-[11px] text-slate-500">Supabase Auth: email + password; public signup disabled.</p>
            </label>
            <label className="mt-3 block text-sm text-slate-700">
              Role
              <select
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value as Role })}
              >
                {roleOptions.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </label>
            <label className="mt-3 block text-sm text-slate-700">
              Status
              <select
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                value={newUser.status}
                onChange={(e) => setNewUser({ ...newUser, status: e.target.value as User["status"] })}
              >
                <option value="active">active</option>
                <option value="inactive">inactive</option>
              </select>
            </label>
            <button
              className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white"
              onClick={handleCreate}
            >
              Create user
            </button>
          </Card>
          <Card title="Existing users" description="Tenant scoped">
            {isError ? (
              <ErrorState message="Cannot load users" onRetry={refetch} />
            ) : (
              <ul className="divide-y divide-slate-200 text-sm text-slate-800">
                {[adminUser, ...users].filter(Boolean).map((u) => (
                  <li key={u!.id} className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-semibold">{u!.name}</p>
                      <p className="text-xs text-slate-500">{u!.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700">
                        {u!.role}
                      </span>
                      <span className="rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700">
                        {u!.status ?? "active"}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      )}

      <Card title="Security notes">
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
          <li>No self-serve signup; roles provisioned by admin/manager.</li>
          <li>Agent role blocked from finance + reports.</li>
          <li>Guest users can only access /products routes (public).</li>
          <li>Supabase RLS with tenant_id protects multi-tenant data.</li>
        </ul>
      </Card>
      {announcementData && (
        <Card title="Audit / History" description="Announcements feed">
          <ul className="space-y-2 text-sm text-slate-700">
            {announcementData.map((a) => (
              <li key={a.id}>• {a.message}</li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
};
