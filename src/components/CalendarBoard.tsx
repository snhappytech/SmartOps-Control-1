import { format, isSameMonth } from "date-fns";
import { Card } from "./ui/Card";
import { cn } from "../utils/cn";

type CalendarEvent = {
  id: string;
  date: string;
  title: string;
  category: "revenue" | "payroll" | "expense" | "birthday";
  value?: string;
};

type Props = {
  events: CalendarEvent[];
  month: number;
  year: number;
  onNavigate?: (next: { month: number; year: number }) => void;
};

export const CalendarBoard = ({ events, month, year, onNavigate }: Props) => {
  const current = new Date(year, month, 1);
  const monthEvents = events.filter((evt) => isSameMonth(new Date(evt.date), current));

  return (
    <Card
      title="Calendar"
      description="Revenue, payroll, expenses, birthdays"
      actions={
        onNavigate && (
          <div className="flex items-center gap-2">
            <button
              className="rounded-md border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700"
              onClick={() => {
                const prev = new Date(year, month - 1, 1);
                onNavigate({ month: prev.getMonth(), year: prev.getFullYear() });
              }}
            >
              ◀
            </button>
            <button
              className="rounded-md border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700"
              onClick={() => {
                const next = new Date(year, month + 1, 1);
                onNavigate({ month: next.getMonth(), year: next.getFullYear() });
              }}
            >
              ▶
            </button>
          </div>
        )
      }
    >
      <div className="space-y-2">
        {monthEvents.length === 0 && <p className="text-sm text-slate-600">No events for this range.</p>}
        {monthEvents.map((evt) => (
          <div
            key={evt.id}
            className={cn(
              "flex items-center justify-between rounded-lg border p-3 text-sm",
              evt.category === "revenue" && "border-emerald-200 bg-emerald-50 text-emerald-800",
              evt.category === "payroll" && "border-blue-200 bg-blue-50 text-blue-800",
              evt.category === "expense" && "border-rose-200 bg-rose-50 text-rose-800",
              evt.category === "birthday" && "border-amber-200 bg-amber-50 text-amber-800",
            )}
          >
            <div>
              <p className="font-semibold">{evt.title}</p>
              {evt.value && <p className="text-xs opacity-75">{evt.value}</p>}
            </div>
            <span className="text-xs font-semibold">{format(new Date(evt.date), "MMM dd")}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};
