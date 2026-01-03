import { NotificationsCenter } from "../components/NotificationsCenter";

export const NotificationsPage = () => (
  <div className="space-y-4">
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-500">Notifications</p>
      <h1 className="text-2xl font-bold text-slate-900">Inbox for birthdays, payroll, and recurring expenses</h1>
      <p className="text-sm text-slate-600">Mark read/unread. Supports birthday, top agent, payroll completed, and recurring expense alerts.</p>
    </div>
    <NotificationsCenter />
  </div>
);
