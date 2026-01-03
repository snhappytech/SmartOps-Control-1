import { useQuery } from "@tanstack/react-query";
import { Card } from "../components/ui/Card";
import { ErrorState } from "../components/ui/ErrorState";
import { fetchAppointments, fetchTickets } from "../data/mockApi";
import { useAuth } from "../context/AuthContext";

export const SupportPage = () => {
  const { user } = useAuth();
  const { data: tickets, isError: ticketError, refetch: refetchTickets } = useQuery({
    queryKey: ["tickets"],
    queryFn: fetchTickets,
  });
  const { data: appointments, isError: appointmentsError, refetch: refetchAppointments } = useQuery({
    queryKey: ["appointments"],
    queryFn: fetchAppointments,
  });

  const assigned = user?.role === "agent" ? tickets?.filter((t) => t.assigneeId === user.id) : tickets;

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">Operations</p>
        <h1 className="text-2xl font-bold text-slate-900">Support & Bookings</h1>
        <p className="text-sm text-slate-600">Tickets, calendar, and staff on-call views.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card
          title="Ticket Dashboard"
          description="Create + manage support tickets"
          actions={
            <button className="rounded-md bg-primary px-3 py-1 text-xs font-semibold text-white">New Ticket</button>
          }
        >
          {ticketError ? (
            <ErrorState message="Tickets failed" onRetry={refetchTickets} />
          ) : (
            <div className="space-y-3">
              {assigned?.map((ticket) => (
                <div key={ticket.id} className="rounded-lg border border-slate-200 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900">{ticket.title}</p>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700">
                      {ticket.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">Priority: {ticket.priority}</p>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Booking / Calendar view" description="Appointments with clients">
          {appointmentsError ? (
            <ErrorState message="Calendar offline" onRetry={refetchAppointments} />
          ) : (
            <div className="space-y-3">
              {appointments?.map((appt) => (
                <div key={appt.id} className="rounded-lg bg-slate-50 p-3">
                  <p className="text-sm font-semibold text-slate-900">{appt.clientName}</p>
                  <p className="text-xs text-slate-600">
                    {appt.project} • {new Date(appt.start).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Client timeline / board" description="Drag-and-drop board ready">
          <div className="space-y-2 text-sm text-slate-700">
            <p>Backlog: 3</p>
            <p>In Progress: 5</p>
            <p>Completed: 7</p>
          </div>
        </Card>
        <Card title="Roster" description="On-call + multi-team roster view">
          <p className="text-sm text-slate-700">Team Alpha: 8 agents</p>
          <p className="text-sm text-slate-700">Team Beta: 6 agents</p>
          <p className="text-sm text-slate-700">Escalation manager: Morgan Manager</p>
        </Card>
        <Card title="Audit History" description="Immutable audit tracking">
          <p className="text-sm text-slate-700">Last change: Ticket SLA updated.</p>
          <p className="text-xs text-slate-500">Tenant data isolated by tenant_id (RLS).</p>
        </Card>
      </div>
    </div>
  );
};
