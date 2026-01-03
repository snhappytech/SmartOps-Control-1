import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "../components/ui/Card";
import { ErrorState } from "../components/ui/ErrorState";
import { useAuth } from "../context/AuthContext";
import {
  fetchAnnouncements,
  fetchAppointments,
  fetchClients,
  fetchPayroll,
  fetchRevenueEntries,
  fetchTickets,
} from "../data/mockApi";
import {
  appointments as seedAppointments,
  clients as seedClients,
  tickets as seedTickets,
  revenueEntries as seedRevenue,
  agents as seedAgents,
  employees as seedEmployees,
} from "../data/mockData";
import { cn } from "../utils/cn";
import { PeriodSelector } from "../components/PeriodSelector";
import { CalendarBoard } from "../components/CalendarBoard";

export const DashboardPage = () => {
  const { user } = useAuth();
  const [period, setPeriod] = useState({ mode: "monthly" as const, month: new Date().getMonth(), year: new Date().getFullYear() });
  const { data: ticketData, isError: ticketError, refetch: refetchTickets } = useQuery({
    queryKey: ["tickets"],
    queryFn: fetchTickets,
  });
  const { data: appointmentData, isError: apptError, refetch: refetchAppts } = useQuery({
    queryKey: ["appointments"],
    queryFn: fetchAppointments,
  });
  const { data: payrollData, isError: payrollError, refetch: refetchPayroll } = useQuery({
    queryKey: ["payroll", user?.role],
    queryFn: () => fetchPayroll(user?.role === "agent" ? user.id : undefined),
    enabled: !!user,
  });
  const { data: announcementData } = useQuery({
    queryKey: ["announcements"],
    queryFn: fetchAnnouncements,
  });
  const { data: revenueData } = useQuery({ queryKey: ["revenue"], queryFn: fetchRevenueEntries });
  const { data: clientsData } = useQuery({ queryKey: ["clients"], queryFn: fetchClients });

  const tickets = ticketData ?? seedTickets;
  const appointments = appointmentData ?? seedAppointments;
  const revenue = revenueData ?? seedRevenue;
  const clients = clientsData ?? seedClients;

  const agentAppointments = useMemo(
    () => appointments.filter((appt) => appt.agentId === user?.id),
    [appointments, user?.id],
  );

  const myProjects = useMemo(() => {
    const now = new Date();
    const assigned = clients.filter((c) => c.assignedAgentId === (user?.id ?? "ag-001"));
    const withDate = assigned.map((c) => ({
      ...c,
      start: new Date(`${c.appointmentDate}T${c.appointmentTime}:00`),
    }));
    return {
      upcoming: withDate.filter((c) => c.start > now).sort((a, b) => a.start.getTime() - b.start.getTime()),
      started: withDate.filter((c) => c.start <= now).sort((a, b) => b.start.getTime() - a.start.getTime()),
    };
  }, [clients, user?.id]);

  const topAgent = useMemo(() => {
    const totals: Record<string, number> = {};
    revenue.forEach((r) => {
      const key = r.agentId ?? "unknown";
      totals[key] = (totals[key] ?? 0) + r.hoursWorked;
    });
    const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1]);
    const [agentId, hours] = sorted[0] ?? [];
    return { agentId, hours: hours ?? 0 };
  }, [revenue]);

  const calendarEvents = useMemo(() => {
    const base = appointments.map((appt) => ({
      id: appt.id,
      date: appt.start,
      title: `Appt: ${appt.clientName}`,
      category: "revenue" as const,
      value: appt.project,
    }));
    const payrollEvents =
      payrollData?.map((p, idx) => {
        const amount = typeof (p as any).payAmount === "number" ? (p as any).payAmount : p.hours * p.hourlyRate;
        return {
          id: `pay-${idx}`,
          date: (p as any).paidDate ?? (p as any).payrollDate ?? new Date().toISOString(),
          title: "Payroll",
          category: "payroll" as const,
          value: `$${amount.toFixed(2)}`,
        };
      }) ?? [];
    const birthdayEvents = [...seedAgents, ...seedEmployees]
      .filter((p) => p.birthdayDate)
      .map((p) => ({
        id: `bday-${p.id}`,
        date: `${new Date().getFullYear()}-${p.birthdayDate!.slice(5)}`,
        title: `Birthday: ${p.fullName}`,
        category: "birthday" as const,
        value: p.photoUrl,
      }));
    return [...base, ...payrollEvents, ...birthdayEvents];
  }, [appointments, payrollData]);

  const isAgent = user?.role === "agent";
  const handleRecalculate = () => {
    refetchTickets();
    refetchAppts();
    refetchPayroll();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">SmartOps Control</p>
          <h1 className="text-2xl font-bold text-slate-900">Unified control center</h1>
          <p className="text-sm text-slate-600">Multi-tenant RBAC with tenant_id enforced across modules.</p>
        </div>
        <div className="flex items-center gap-2">
          <PeriodSelector mode={period.mode} month={period.month} year={period.year} onChange={setPeriod} />
          <div className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white">Role: {user?.role ?? "guest"}</div>
          {["admin", "manager"].includes(user?.role ?? "") && (
            <button
              className="rounded-md bg-slate-900 px-3 py-1 text-xs font-semibold text-white"
              onClick={handleRecalculate}
            >
              Recalculate Month/Year
            </button>
          )}
        </div>
      </div>

      {announcementData && (
        <Card title="Announcements" className="border-primary/30 bg-primary/5">
          <ul className="divide-y divide-slate-200">
            {announcementData.map((ann) => (
              <li key={ann.id} className="py-2 text-sm text-slate-800">
                <span className="font-semibold">{ann.createdAt}:</span> {ann.message}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {isAgent ? (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <Card title="My Hours" description="This pay period">
              {payrollError ? (
                <ErrorState message="Could not load hours" onRetry={refetchPayroll} />
              ) : (
                <p className="text-3xl font-bold text-slate-900">
                  {payrollData?.[0]?.hours ?? 0}
                  <span className="text-base font-medium text-slate-500"> hrs</span>
                </p>
              )}
            </Card>
            <Card title="My Payroll" description="Amount + paid date">
              {payrollError ? (
                <ErrorState message="Payroll failed to load" onRetry={refetchPayroll} />
              ) : (
                <div>
                  <p className="text-3xl font-bold text-slate-900">
                    $
                    {payrollData && payrollData[0]
                      ? (payrollData[0].hours * payrollData[0].hourlyRate).toLocaleString()
                      : 0}
                  </p>
                  <p className="text-xs text-slate-500">Paid: {payrollData?.[0]?.paidDate ?? "Pending"}</p>
                </div>
              )}
            </Card>
            <Card title="Hour Goal" description="Progress to 40 hrs">
              <div className="flex items-center gap-3">
                <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="absolute inset-y-0 left-0 bg-primary"
                    style={{ width: `${Math.min(100, ((payrollData?.[0]?.hours ?? 0) / 40) * 100)}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-slate-800">
                  {Math.min(40, payrollData?.[0]?.hours ?? 0)} / 40
                </span>
              </div>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card title="Upcoming Birthdays" description="Public name + photo">
              <div className="space-y-3">
                {[...seedAgents, ...seedEmployees]
                  .filter((p) => p.birthdayDate)
                  .sort((a, b) => a.birthdayDate!.localeCompare(b.birthdayDate!))
                  .map((p) => (
                    <div key={p.id} className="flex items-center gap-3">
                      <img src={p.photoUrl ?? "https://placekitten.com/60/60"} alt="Birthday" className="h-10 w-10 rounded-full" />
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{p.fullName}</p>
                        <p className="text-xs text-slate-600">{p.birthdayDate}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </Card>
            <Card title="Happy Birthday card" description="Celebrate teammates">
              <div className="rounded-lg border border-amber-100 bg-amber-50 p-4 text-amber-800">
                🎉 Happy Birthday Casey! Enjoy your day and thank you for the great work.
              </div>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card title="My Projects" description="Upcoming">
              <div className="space-y-2 text-sm text-slate-700">
                {myProjects.upcoming.map((p) => (
                  <div key={p.id} className="rounded-lg bg-slate-50 p-3">
                    <p className="font-semibold">{p.projectName}</p>
                    <p className="text-xs text-slate-600">
                      {p.appointmentDate} {p.appointmentTime} • {p.fullName}
                    </p>
                  </div>
                ))}
                {myProjects.upcoming.length === 0 && <p className="text-xs text-slate-600">No upcoming projects.</p>}
              </div>
            </Card>
            <Card title="My Projects" description="In progress / started">
              <div className="space-y-2 text-sm text-slate-700">
                {myProjects.started.map((p) => (
                  <div key={p.id} className="rounded-lg bg-slate-50 p-3">
                    <p className="font-semibold">{p.projectName}</p>
                    <p className="text-xs text-slate-600">
                      {p.appointmentDate} {p.appointmentTime} • {p.fullName}
                    </p>
                  </div>
                ))}
                {myProjects.started.length === 0 && <p className="text-xs text-slate-600">No started projects.</p>}
              </div>
            </Card>
          </div>
        </>
      ) : (
        <div className="grid gap-4 md:grid-cols-4">
          <Card title="Ops Tickets" description="Open and in-progress">
            {ticketError ? (
              <ErrorState message="Tickets failed" onRetry={refetchTickets} />
            ) : (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Open</span>
                  <span className="font-semibold">{tickets.filter((t) => t.status === "open").length}</span>
                </div>
                <div className="flex justify-between">
                  <span>In progress</span>
                  <span className="font-semibold">{tickets.filter((t) => t.status === "in_progress").length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Closed</span>
                  <span className="font-semibold">{tickets.filter((t) => t.status === "closed").length}</span>
                </div>
              </div>
            )}
          </Card>
          <Card title="Bookings" description="Calendar & appointments">
            {apptError ? (
              <ErrorState message="Bookings failed" onRetry={refetchAppts} />
            ) : (
              <p className="text-3xl font-bold text-slate-900">{appointments.length}</p>
            )}
          </Card>
          <Card title="Roster" description="On-call + multi-team">
            <div className="space-y-2">
              <p className="text-sm text-slate-700">Team A: 8 agents</p>
              <p className="text-sm text-slate-700">Team B: 6 agents</p>
              <p className="text-sm text-slate-700">On-call now: 3</p>
            </div>
          </Card>
          <Card title="Audit history" description="RLS enforced with tenant_id">
            <p className="text-sm text-slate-700">Latest audit: user provisioning updated (RBAC)</p>
          </Card>
        </div>
        <Card title="Create client / project / appointment" description="Operations creation flows">
          <div className="flex flex-wrap gap-2">
            <button className="rounded-md bg-primary px-3 py-1 text-xs font-semibold text-white">New Client</button>
            <button className="rounded-md bg-slate-900 px-3 py-1 text-xs font-semibold text-white">New Project</button>
            <button className="rounded-md bg-emerald-500 px-3 py-1 text-xs font-semibold text-white">New Appointment</button>
          </div>
          <p className="mt-2 text-xs text-slate-500">Bookings feed calendar & timeline views.</p>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title={isAgent ? "My Assigned Clients" : "Client timeline"} description="Projects and appointments">
          {apptError ? (
            <ErrorState message="Appointments unavailable" onRetry={refetchAppts} />
          ) : (
            <div className="space-y-3">
              {(isAgent ? agentAppointments : appointments).map((appt) => (
                <div key={appt.id} className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{appt.clientName}</p>
                    <p className="text-xs text-slate-600">
                      Project: {appt.project} • {new Date(appt.start).toLocaleString()}
                    </p>
                  </div>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    {appt.agentId === user?.id ? "Assigned" : "Shared"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
        <Card
          title={isAgent ? "Agent of the Month" : "Timeline board"}
          description={isAgent ? "Top agent highlights" : "Operations timeline view"}
        >
          {isAgent ? (
            <div className="rounded-lg border border-amber-100 bg-amber-50 p-4">
              <p className="text-sm font-semibold text-amber-800">Agent of the Month</p>
              <p className="text-xs text-amber-700">Consistency, CSAT 98%, 42 hours delivered.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="rounded-lg border border-slate-200 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900">{ticket.title}</p>
                    <span
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-semibold",
                        ticket.status === "open"
                          ? "bg-amber-100 text-amber-800"
                          : ticket.status === "in_progress"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-emerald-100 text-emerald-800",
                      )}
                    >
                      {ticket.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">Priority: {ticket.priority}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
      <CalendarBoard events={calendarEvents} month={period.month} year={period.year} onNavigate={(next) => setPeriod({ ...period, ...next })} />
    </div>
  );
};
