import { useMemo } from "react";
import { cn } from "../utils/cn";

type Props = {
  mode: "monthly" | "yearly";
  month: number;
  year: number;
  onChange: (next: { mode: "monthly" | "yearly"; month: number; year: number }) => void;
};

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const PeriodSelector = ({ mode, month, year, onChange }: Props) => {
  const years = useMemo(() => {
    const current = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => current - 2 + i);
  }, []);

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 shadow-sm">
      <select
        className="rounded-md border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700"
        value={mode}
        onChange={(e) => onChange({ mode: e.target.value as "monthly" | "yearly", month, year })}
      >
        <option value="monthly">Monthly</option>
        <option value="yearly">Yearly</option>
      </select>
      {mode === "monthly" && (
        <select
          className="rounded-md border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700"
          value={month}
          onChange={(e) => onChange({ mode, month: Number(e.target.value), year })}
        >
          {months.map((label, idx) => (
            <option key={label} value={idx}>
              {label}
            </option>
          ))}
        </select>
      )}
      <select
        className="rounded-md border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700"
        value={year}
        onChange={(e) => onChange({ mode, month, year: Number(e.target.value) })}
      >
        {years.map((yr) => (
          <option key={yr} value={yr}>
            {yr}
          </option>
        ))}
      </select>
      <span className={cn("text-[11px] font-semibold uppercase tracking-wide text-slate-500")}>
        {mode === "monthly" ? months[month] : "Year"} {year}
      </span>
    </div>
  );
};
