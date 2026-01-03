import { useQuery } from "@tanstack/react-query";
import { fetchAnnouncements, fetchPayroll } from "../data/mockApi";
import { Card } from "../components/ui/Card";
import { ErrorState } from "../components/ui/ErrorState";
import { useAuth } from "../context/AuthContext";

export const HrPage = () => {
  const { user } = useAuth();
  const { data: payroll, isError, refetch } = useQuery({
    queryKey: ["payroll", user?.role],
    queryFn: () => fetchPayroll(user?.role === "agent" ? user.id : undefined),
    enabled: !!user,
  });
  const { data: announcements } = useQuery({ queryKey: ["announcements"], queryFn: fetchAnnouncements });

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">HR & Payroll</p>
        <h1 className="text-2xl font-bold text-slate-900">Active agents, hours, and on-call</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Active agents" description="Create + manage agent profiles">
          <p className="text-3xl font-bold text-slate-900">42</p>
          <p className="text-xs text-slate-500">Multi-team roster across tenants.</p>
        </Card>
        <Card title="Announcements" description="Admin > send broadcast">
          <div className="space-y-2 text-xs text-slate-700">
            {announcements?.map((a) => (
              <p key={a.id}>• {a.message}</p>
            ))}
          </div>
        </Card>
        <Card title="On-call & Attendance" description="Live attendance + on-call">
          <p className="text-sm text-slate-700">On call: 3 | In-office: 18 | Remote: 21</p>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card
          title="Payroll"
          description={user?.role === "agent" ? "Your payroll record" : "Tenant payroll summary"}
          actions={<button className="rounded-md bg-primary px-3 py-1 text-xs font-semibold text-white">Export</button>}
        >
          {isError ? (
            <ErrorState message="Payroll unavailable" onRetry={refetch} />
          ) : (
            <div className="divide-y divide-slate-200">
              {payroll?.map((p) => (
                <div key={p.agentId} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{p.agentId}</p>
                    <p className="text-xs text-slate-600">Hours: {p.hours}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">${(p.hours * p.hourlyRate).toFixed(2)}</p>
                    <p className="text-xs text-slate-500">Paid: {p.paidDate ?? "Pending"}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
        <Card title="Settings" description="Payroll & attendance settings">
          <ul className="space-y-2 text-sm text-slate-700">
            <li>• PTO accrual + leave management</li>
            <li>• Payroll cycles with audit</li>
            <li>• Role-based visibility (agents only see their record)</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};
