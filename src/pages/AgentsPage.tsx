import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "../components/ui/Card";
import { ErrorState } from "../components/ui/ErrorState";
import { createAgent, createEmployee, fetchAgents, fetchEmployees } from "../data/mockApi";
import { agents as seedAgents, employees as seedEmployees } from "../data/mockData";
import { Agent, Employee } from "../types";
import { useAuth } from "../context/AuthContext";

const buildAgentCode = (existing: Agent[]) => {
  const max = existing
    .map((a) => Number(a.agentCode.replace(/\D/g, "")))
    .filter(Number.isFinite)
    .reduce((m, n) => Math.max(m, n), 0);
  return `AGT-${String(max + 1).padStart(3, "0")}`;
};

export const AgentsPage = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { data: agentData, isError: agentError, refetch: refetchAgents } = useQuery({
    queryKey: ["agents"],
    queryFn: fetchAgents,
  });
  const { data: employeeData, isError: employeeError, refetch: refetchEmployees } = useQuery({
    queryKey: ["employees"],
    queryFn: fetchEmployees,
  });
  const agents = agentData ?? seedAgents;
  const employeesList = employeeData ?? seedEmployees;

  const [agentForm, setAgentForm] = useState<Agent>({
    id: "new",
    fullName: "",
    address: "",
    phone: "",
    email: "",
    birthdayDate: "",
    photoUrl: "",
    agentCode: buildAgentCode(agents),
    hourlyRate: 20,
    assignedClients: [],
    status: "active",
    tenantId: "tenant-smartops",
  });

  const [employeeForm, setEmployeeForm] = useState<Employee>({
    id: "new",
    fullName: "",
    phone: "",
    email: "",
    birthdayDate: "",
    photoUrl: "",
    monthlySalary: 4000,
    tasks: "",
    status: "active",
    tenantId: "tenant-smartops",
  });

  const agentMutation = useMutation({
    mutationFn: createAgent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agents"] });
      setAgentForm((prev) => ({ ...prev, id: "new", fullName: "", email: "", agentCode: buildAgentCode(agents) }));
    },
  });

  const employeeMutation = useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setEmployeeForm((prev) => ({ ...prev, id: "new", fullName: "", email: "" }));
    },
  });

  const topAgent = useMemo(
    () =>
      agents.reduce(
        (best, agent) => {
          const hours = agent.assignedClients.length * 8;
          if (hours > best.hours) return { agent, hours };
          return best;
        },
        { agent: agents[0], hours: agents[0]?.assignedClients.length ?? 0 },
      ),
    [agents],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Agents & Employees</p>
          <h1 className="text-2xl font-bold text-slate-900">Create agents + employees (Admin/Manager only)</h1>
          <p className="text-sm text-slate-600">Agent creation also provisions a system user. Forms are scrollable for long input.</p>
        </div>
        <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Top agent: {topAgent.agent?.fullName ?? "N/A"}</div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Create Agent" description="Auto agent code & hourly rate">
          {agentError ? (
            <ErrorState message="Agents failed to load" onRetry={refetchAgents} />
          ) : (
            <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
              <div className="grid gap-2 md:grid-cols-2">
                <label className="text-sm text-slate-700">
                  Full name
                  <input
                    className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                    value={agentForm.fullName}
                    onChange={(e) => setAgentForm({ ...agentForm, fullName: e.target.value })}
                  />
                </label>
                <label className="text-sm text-slate-700">
                  Email
                  <input
                    className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                    value={agentForm.email}
                    onChange={(e) => setAgentForm({ ...agentForm, email: e.target.value })}
                  />
                </label>
                <label className="text-sm text-slate-700">
                  Phone
                  <input
                    className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                    value={agentForm.phone}
                    onChange={(e) => setAgentForm({ ...agentForm, phone: e.target.value })}
                  />
                </label>
                <label className="text-sm text-slate-700">
                  Address
                  <input
                    className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                    value={agentForm.address}
                    onChange={(e) => setAgentForm({ ...agentForm, address: e.target.value })}
                  />
                </label>
                <label className="text-sm text-slate-700">
                  Birthday
                  <input
                    type="date"
                    className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                    value={agentForm.birthdayDate}
                    onChange={(e) => setAgentForm({ ...agentForm, birthdayDate: e.target.value })}
                  />
                </label>
                <label className="text-sm text-slate-700">
                  Photo URL
                  <input
                    className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                    value={agentForm.photoUrl}
                    onChange={(e) => setAgentForm({ ...agentForm, photoUrl: e.target.value })}
                  />
                </label>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                <label className="text-sm text-slate-700">
                  Agent code
                  <input className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" value={agentForm.agentCode} readOnly />
                </label>
                <label className="text-sm text-slate-700">
                  Hourly rate
                  <input
                    type="number"
                    className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                    value={agentForm.hourlyRate}
                    onChange={(e) => setAgentForm({ ...agentForm, hourlyRate: Number(e.target.value) })}
                  />
                </label>
              </div>
              <button
                className="mt-2 w-full rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white"
                onClick={() => agentMutation.mutate({ ...agentForm, id: `ag-${Date.now()}` })}
                disabled={user?.role === "agent"}
              >
                Create agent + system user
              </button>
            </div>
          )}
        </Card>

        <Card title="Create Employee" description="Salaries flow into expenses">
          {employeeError ? (
            <ErrorState message="Employees failed to load" onRetry={refetchEmployees} />
          ) : (
            <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
              <label className="text-sm text-slate-700">
                Full name
                <input
                  className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                  value={employeeForm.fullName}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, fullName: e.target.value })}
                />
              </label>
              <label className="text-sm text-slate-700">
                Email
                <input
                  className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                  value={employeeForm.email}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })}
                />
              </label>
              <label className="text-sm text-slate-700">
                Phone
                <input
                  className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                  value={employeeForm.phone}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, phone: e.target.value })}
                />
              </label>
              <label className="text-sm text-slate-700">
                Birthday (optional)
                <input
                  type="date"
                  className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                  value={employeeForm.birthdayDate}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, birthdayDate: e.target.value })}
                />
              </label>
              <label className="text-sm text-slate-700">
                Photo URL
                <input
                  className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                  value={employeeForm.photoUrl}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, photoUrl: e.target.value })}
                />
              </label>
              <label className="text-sm text-slate-700">
                Monthly salary
                <input
                  type="number"
                  className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                  value={employeeForm.monthlySalary}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, monthlySalary: Number(e.target.value) })}
                />
              </label>
              <label className="text-sm text-slate-700">
                Tasks / notes
                <textarea
                  className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                  rows={2}
                  value={employeeForm.tasks}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, tasks: e.target.value })}
                />
              </label>
              <button
                className="mt-2 w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                onClick={() => employeeMutation.mutate({ ...employeeForm, id: `emp-${Date.now()}` })}
              >
                Create employee
              </button>
            </div>
          )}
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Agents" description="Sorted by code">
          <div className="divide-y divide-slate-200">
            {agents.map((agent) => (
              <div key={agent.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {agent.fullName} ({agent.agentCode})
                  </p>
                  <p className="text-xs text-slate-600">
                    {agent.email} • {agent.phone}
                  </p>
                  <p className="text-xs text-slate-500">
                    Hourly: ${agent.hourlyRate} • Birthday: {agent.birthdayDate ?? "n/a"}
                  </p>
                </div>
                <span className="rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700">
                  {agent.status}
                </span>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Employees" description="Salaries in expenses">
          <div className="divide-y divide-slate-200">
            {employeesList.map((emp) => (
              <div key={emp.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{emp.fullName}</p>
                  <p className="text-xs text-slate-600">
                    {emp.email ?? "n/a"} • {emp.phone ?? "n/a"}
                  </p>
                  <p className="text-xs text-slate-500">
                    Salary: ${emp.monthlySalary.toLocaleString()} • Birthday: {emp.birthdayDate ?? "n/a"}
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700">{emp.status}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
