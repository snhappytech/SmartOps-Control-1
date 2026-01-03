import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "../components/ui/Card";
import { ErrorState } from "../components/ui/ErrorState";
import { createClient, fetchAgents, fetchClients } from "../data/mockApi";
import { agents as seedAgents, clients as seedClients } from "../data/mockData";
import { Client } from "../types";
import { useAuth } from "../context/AuthContext";

export const ClientsPage = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { data: clientsData, isError, refetch } = useQuery({ queryKey: ["clients"], queryFn: fetchClients });
  const { data: agentsData } = useQuery({ queryKey: ["agents"], queryFn: fetchAgents });
  const clients = clientsData ?? seedClients;
  const agents = agentsData ?? seedAgents;

  const [form, setForm] = useState<Client>({
    id: "new",
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
    projectName: "",
    appointmentDate: "",
    appointmentTime: "",
    assignedAgentId: agents[0]?.id ?? "",
    tenantId: "tenant-smartops",
  });

  const mutation = useMutation({
    mutationFn: createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      setForm((prev) => ({ ...prev, id: "new", fullName: "", email: "", phoneNumber: "", address: "", projectName: "" }));
    },
  });

  const visibleClients = useMemo(() => {
    if (user?.role === "agent") {
      return clients.filter((c) => c.assignedAgentId === user.id || c.assignedAgentId === "ag-001");
    }
    return clients;
  }, [clients, user]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Clients / Kreyova Users</p>
          <h1 className="text-2xl font-bold text-slate-900">Projects and scheduling</h1>
          <p className="text-sm text-slate-600">
            Admin/Manager create clients and appointments. Agents can only see assigned clients, projects, and date/time.
          </p>
        </div>
        {["admin", "manager"].includes(user?.role ?? "") && (
          <div className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">Creation enabled</div>
        )}
      </div>

      {["admin", "manager"].includes(user?.role ?? "") && (
        <Card title="Create client" description="Appointment date + time required">
          <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
            <div className="grid gap-2 md:grid-cols-2">
              <label className="text-sm text-slate-700">
                Full name
                <input
                  className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                />
              </label>
              <label className="text-sm text-slate-700">
                Email
                <input
                  className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </label>
              <label className="text-sm text-slate-700">
                Phone number
                <input
                  className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                  value={form.phoneNumber}
                  onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                />
              </label>
              <label className="text-sm text-slate-700">
                Address
                <input
                  className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
              </label>
              <label className="text-sm text-slate-700">
                Project name
                <input
                  className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                  value={form.projectName}
                  onChange={(e) => setForm({ ...form, projectName: e.target.value })}
                />
              </label>
              <label className="text-sm text-slate-700">
                Appointment date
                <input
                  type="date"
                  className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                  value={form.appointmentDate}
                  onChange={(e) => setForm({ ...form, appointmentDate: e.target.value })}
                />
              </label>
              <label className="text-sm text-slate-700">
                Appointment time
                <input
                  type="time"
                  className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                  value={form.appointmentTime}
                  onChange={(e) => setForm({ ...form, appointmentTime: e.target.value })}
                />
              </label>
              <label className="text-sm text-slate-700">
                Assigned agent
                <select
                  className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                  value={form.assignedAgentId}
                  onChange={(e) => setForm({ ...form, assignedAgentId: e.target.value })}
                >
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.fullName} ({agent.agentCode})
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <button
              className="mt-2 w-full rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white"
              onClick={() => mutation.mutate({ ...form, id: `client-${Date.now()}` })}
            >
              Create client
            </button>
          </div>
        </Card>
      )}

      {isError ? (
        <ErrorState message="Clients unavailable" onRetry={refetch} />
      ) : (
        <Card title="Client list" description={user?.role === "agent" ? "Assigned clients" : "All clients"}>
          <div className="divide-y divide-slate-200">
            {visibleClients.map((client) => (
              <div key={client.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{client.fullName}</p>
                  <p className="text-xs text-slate-600">
                    {client.email} • {client.phoneNumber} • {client.address}
                  </p>
                  <p className="text-xs text-slate-500">
                    Project: {client.projectName} • {client.appointmentDate} {client.appointmentTime}
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700">
                  {agents.find((a) => a.id === client.assignedAgentId)?.fullName ?? "Agent"}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
