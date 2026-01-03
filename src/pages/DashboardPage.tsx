import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "../components/ui/Card";
import { ErrorState } from "../components/ui/ErrorState";
import { useAuth } from "../context/AuthContext";
import { fetchAnnouncements, fetchAppointments, fetchPayroll, fetchTickets } from "../data/mockApi";
import { appointments as seedAppointments, tickets as seedTickets } from "../data/mockData";
import { cn } from "../utils/cn";

export const DashboardPage = () => {
  const { user } = useAuth();
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

  const tickets = ticketData ?? seedTickets;
  const appointments = appointmentData ?? seedAppointments;

  const agentAppointments = useMemo(
    () => appointments.filter((appt) => appt.agentId === user?.id),
    [appointments, user?.id],
  );

  const isAgent = user?.role === "agent";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">SmartOps Control</p>
          <h1 className="text-2xl font-bold text-slate-900">Unified control center</h1>
          <p className="text-sm text-slate-600">Multi-tenant RBAC with tenant_id enforced across modules.</p>
        </div>
        <div className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white">
          Role: {user?.role ?? "guest"}
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
                <div className="flex items-center gap-3">
                  <img src="https://placekitten.com/60/60" alt="Birthday" className="h-10 w-10 rounded-full" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Casey Agent</p>
                    <p className="text-xs text-slate-600">Oct 4</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <img src="https://placekitten.com/60/61" alt="Birthday" className="h-10 w-10 rounded-full" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Jordan Support</p>
                    <p className="text-xs text-slate-600">Oct 12</p>
                  </div>
                </div>
              </div>
            </Card>
            <Card title="Happy Birthday card" description="Celebrate teammates">
              <div className="rounded-lg border border-amber-100 bg-amber-50 p-4 text-amber-800">
                🎉 Happy Birthday Casey! Enjoy your day and thank you for the great work.
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
    </div>
  );
};
