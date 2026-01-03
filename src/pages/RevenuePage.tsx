import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "../components/ui/Card";
import { ErrorState } from "../components/ui/ErrorState";
import {
  createRevenueEntry,
  fetchAgents,
  fetchExpenses,
  fetchPayrollEntries,
  fetchRevenueEntries,
  fetchRecurringExpenses,
  fetchRecurringInstances,
} from "../data/mockApi";
import {
  agents as seedAgents,
  employees as seedEmployees,
  expenses as seedExpenses,
  payrollEntries as seedPayrollEntries,
  recurringExpenses as seedRecurring,
  recurringInstances as seedRecurringInstances,
  revenueEntries as seedRevenue,
  tenantId,
} from "../data/mockData";
import { PeriodSelector } from "../components/PeriodSelector";
import { CalendarBoard } from "../components/CalendarBoard";
import { useAuth } from "../context/AuthContext";

export const RevenuePage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [period, setPeriod] = useState({ mode: "monthly" as const, month: new Date().getMonth(), year: new Date().getFullYear() });
  const { data: revenueData, isError, refetch } = useQuery({ queryKey: ["revenue"], queryFn: fetchRevenueEntries });
  const { data: payrollData } = useQuery({ queryKey: ["payroll-entries"], queryFn: fetchPayrollEntries });
  const { data: expensesData } = useQuery({ queryKey: ["expenses"], queryFn: fetchExpenses });
  const { data: recurringData } = useQuery({ queryKey: ["recurring"], queryFn: fetchRecurringExpenses });
  const { data: recurringInstanceData } = useQuery({ queryKey: ["recurring-instances"], queryFn: fetchRecurringInstances });
  const { data: agentsData } = useQuery({ queryKey: ["agents"], queryFn: fetchAgents });

  const revenueEntries = revenueData ?? seedRevenue;
  const payrollEntries = payrollData ?? seedPayrollEntries;
  const expenses = expensesData ?? seedExpenses;
  const recurringTemplates = recurringData ?? seedRecurring;
  const recurringInstances = recurringInstanceData ?? seedRecurringInstances;
  const agents = agentsData ?? seedAgents;

  const [form, setForm] = useState({
    entryDate: new Date().toISOString().slice(0, 10),
    hoursWorked: 1,
    contractRatePerHour: 80,
    agentId: agents[0]?.id ?? "",
  });

  const mutation = useMutation({
    mutationFn: createRevenueEntry,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["revenue"] }),
  });

  const filteredRevenue = useMemo(
    () =>
      revenueEntries.filter((r) => {
        const d = new Date(r.entryDate);
        return period.mode === "monthly" ? d.getMonth() === period.month && d.getFullYear() === period.year : d.getFullYear() === period.year;
      }),
    [revenueEntries, period],
  );

  const filteredPayroll = useMemo(
    () =>
      payrollEntries.filter((p) => {
        const d = new Date(p.payrollDate);
        return period.mode === "monthly" ? d.getMonth() === period.month && d.getFullYear() === period.year : d.getFullYear() === period.year;
      }),
    [payrollEntries, period],
  );

  const filteredExpenses = useMemo(
    () =>
      expenses.filter((e) => {
        const d = new Date(e.expenseDate);
        return period.mode === "monthly" ? d.getMonth() === period.month && d.getFullYear() === period.year : d.getFullYear() === period.year;
      }),
    [expenses, period],
  );

  const filteredRecurringInstances = useMemo(
    () =>
      recurringInstances.filter((e) => {
        const d = new Date(e.expenseDate);
        return period.mode === "monthly" ? d.getMonth() === period.month && d.getFullYear() === period.year : d.getFullYear() === period.year;
      }),
    [recurringInstances, period],
  );

  const revenueTotal = filteredRevenue.reduce((sum, r) => sum + r.revenueAmount, 0);
  const payrollTotal = filteredPayroll.reduce((sum, p) => sum + p.payAmount, 0);
  const expenseTotal =
    filteredExpenses.reduce((sum, e) => sum + e.amount, 0) +
    filteredRecurringInstances.reduce((sum, e) => sum + e.amount, 0) +
    seedEmployees.reduce((sum, emp) => sum + emp.monthlySalary, 0); // salaries into expenses
  const taxAmount = revenueTotal * 0.2;
  const netProfit = revenueTotal - taxAmount - payrollTotal - expenseTotal;

  const calendarEvents = [
    ...filteredRevenue.map((r) => ({
      id: r.id,
      date: r.entryDate,
      title: "Revenue entry",
      category: "revenue" as const,
      value: `$${r.revenueAmount.toFixed(2)}`,
    })),
    ...filteredPayroll.map((p) => ({
      id: p.id,
      date: p.payrollDate,
      title: "Payroll",
      category: "payroll" as const,
      value: `$${p.payAmount.toFixed(2)}`,
    })),
    ...filteredExpenses.map((e) => ({
      id: e.id,
      date: e.expenseDate,
      title: e.category,
      category: "expense" as const,
      value: `$${e.amount.toFixed(2)}`,
    })),
    ...filteredRecurringInstances.map((e) => ({
      id: e.id,
      date: e.expenseDate,
      title: e.category,
      category: "expense" as const,
      value: `$${e.amount.toFixed(2)}`,
    })),
  ];

  const handleRecalculate = () => {
    const monthKey = `${period.year}-${String(period.month + 1).padStart(2, "0")}`;
    recurringTemplates
      .filter((t) => t.isActive)
      .forEach((t) => {
        const date = new Date(period.year, period.month, t.dayOfMonth);
        const inst = {
          id: `rec-inst-${Date.now()}-${t.id}`,
          templateId: t.id,
          month: monthKey,
          expenseDate: date.toISOString().slice(0, 10),
          amount: t.amount,
          category: t.category,
          tenantId,
        };
        recurringInstances.push(inst);
      });
    queryClient.invalidateQueries({ queryKey: ["recurring-instances"] });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Revenue & Hours</p>
          <h1 className="text-2xl font-bold text-slate-900">Revenue entries, payroll, and expenses</h1>
          <p className="text-sm text-slate-600">Revenue amount auto-calculates from hours * rate. Period selector supports monthly/yearly.</p>
        </div>
        <PeriodSelector mode={period.mode} month={period.month} year={period.year} onChange={setPeriod} />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card title="Revenue total">
          <p className="text-2xl font-bold text-slate-900">${revenueTotal.toFixed(2)}</p>
        </Card>
        <Card title="Tax (20%)">
          <p className="text-2xl font-bold text-slate-900">${taxAmount.toFixed(2)}</p>
        </Card>
        <Card title="Payroll total">
          <p className="text-2xl font-bold text-slate-900">${payrollTotal.toFixed(2)}</p>
        </Card>
        <Card title="Net profit">
          <p className="text-2xl font-bold text-slate-900">${netProfit.toFixed(2)}</p>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Add Entry" description="hours_worked * contract_rate_per_hour = revenue_amount">
          {isError ? (
            <ErrorState message="Revenue failed to load. Check network or Supabase policy access." onRetry={refetch} />
          ) : (
            <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
              <label className="text-sm text-slate-700">
                Entry date
                <input
                  type="date"
                  className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                  value={form.entryDate}
                  onChange={(e) => setForm({ ...form, entryDate: e.target.value })}
                />
              </label>
              <label className="text-sm text-slate-700">
                Hours worked
                <input
                  type="number"
                  className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                  value={form.hoursWorked}
                  onChange={(e) => setForm({ ...form, hoursWorked: Number(e.target.value) })}
                />
              </label>
              <label className="text-sm text-slate-700">
                Contract rate per hour
                <input
                  type="number"
                  className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                  value={form.contractRatePerHour}
                  onChange={(e) => setForm({ ...form, contractRatePerHour: Number(e.target.value) })}
                />
              </label>
              <label className="text-sm text-slate-700">
                Agent
                <select
                  className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                  value={form.agentId}
                  onChange={(e) => setForm({ ...form, agentId: e.target.value })}
                >
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.fullName}
                    </option>
                  ))}
                </select>
              </label>
              <div className="rounded-md bg-slate-50 p-2 text-xs text-slate-700">
                Revenue amount: ${(form.hoursWorked * form.contractRatePerHour).toFixed(2)}
              </div>
              <button
                className="w-full rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white"
                onClick={() =>
                  mutation.mutate({
                    id: `rev-${Date.now()}`,
                    ...form,
                    revenueAmount: form.hoursWorked * form.contractRatePerHour,
                    tenantId,
                  })
                }
              >
                Add entry
              </button>
            </div>
          )}
        </Card>
        <Card
          title="Recurring expenses"
          description="Monthly schedule; recalc month generates instances"
          actions={
            <button
              className="rounded-md bg-slate-900 px-3 py-1 text-xs font-semibold text-white"
              onClick={handleRecalculate}
              disabled={!["admin", "manager"].includes(user?.role ?? "")}
            >
              Recalculate Month
            </button>
          }
        >
          <div className="space-y-2 text-sm text-slate-700">
            {recurringTemplates.map((t) => (
              <div key={t.id} className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-xs text-slate-500">
                    Day {t.dayOfMonth} • ${t.amount} • {t.category}
                  </p>
                </div>
                <span className="text-[11px] font-semibold text-slate-600">{t.isActive ? "Active" : "Inactive"}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card title="Summary table" description="Revenue, payroll, expenses">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-lg border border-slate-200 p-3">
            <p className="text-sm font-semibold text-slate-900">Revenue entries</p>
            <ul className="mt-2 space-y-1 text-xs text-slate-700">
              {filteredRevenue.map((r) => (
                <li key={r.id}>
                  {r.entryDate}: ${r.revenueAmount.toFixed(2)} ({r.hoursWorked} hrs @ {r.contractRatePerHour})
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <p className="text-sm font-semibold text-slate-900">Payroll</p>
            <ul className="mt-2 space-y-1 text-xs text-slate-700">
              {filteredPayroll.map((p) => (
                <li key={p.id}>
                  {p.payrollDate}: ${p.payAmount.toFixed(2)} ({p.hoursPaid} hrs)
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <p className="text-sm font-semibold text-slate-900">Expenses</p>
            <ul className="mt-2 space-y-1 text-xs text-slate-700">
              {filteredExpenses.map((e) => (
                <li key={e.id}>
                  {e.expenseDate}: ${e.amount.toFixed(2)} {e.category}
                </li>
              ))}
              {filteredRecurringInstances.map((e) => (
                <li key={e.id}>
                  {e.expenseDate}: ${e.amount.toFixed(2)} {e.category} (recurring)
                </li>
              ))}
              {seedEmployees.map((emp) => (
                <li key={emp.id}>
                  Salary: ${emp.monthlySalary.toFixed(2)} ({emp.fullName})
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      <CalendarBoard events={calendarEvents} month={period.month} year={period.year} onNavigate={(next) => setPeriod({ ...period, ...next })} />
    </div>
  );
};
