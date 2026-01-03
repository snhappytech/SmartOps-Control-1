import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchExpenses,
  fetchInvestors,
  fetchPayrollEntries,
  fetchRecurringExpenses,
  fetchRecurringInstances,
  fetchRevenueEntries,
} from "../data/mockApi";
import { Card } from "../components/ui/Card";
import { ErrorState } from "../components/ui/ErrorState";
import {
  employees as seedEmployees,
  expenses as seedExpenses,
  investors as seedInvestors,
  payrollEntries as seedPayroll,
  recurringExpenses as seedRecurring,
  recurringInstances as seedRecurringInstances,
  revenueEntries as seedRevenue,
} from "../data/mockData";
import { PeriodSelector } from "../components/PeriodSelector";

export const FinancePage = () => {
  const [period, setPeriod] = useState({ mode: "monthly" as const, month: new Date().getMonth(), year: new Date().getFullYear() });
  const { data: revenueData, isError: revError, refetch: refetchRevenue } = useQuery({
    queryKey: ["revenue"],
    queryFn: fetchRevenueEntries,
  });
  const { data: payrollData } = useQuery({ queryKey: ["payroll-entries"], queryFn: fetchPayrollEntries });
  const { data: expenseData } = useQuery({ queryKey: ["expenses"], queryFn: fetchExpenses });
  const { data: recurringData } = useQuery({ queryKey: ["recurring"], queryFn: fetchRecurringExpenses });
  const { data: recurringInstanceData } = useQuery({ queryKey: ["recurring-instances"], queryFn: fetchRecurringInstances });
  const { data: investorData } = useQuery({ queryKey: ["investors"], queryFn: fetchInvestors });

  const revenue = revenueData ?? seedRevenue;
  const payroll = payrollData ?? seedPayroll;
  const expenses = expenseData ?? seedExpenses;
  const recurring = recurringData ?? seedRecurring;
  const recurringInstances = recurringInstanceData ?? seedRecurringInstances;
  const investors = investorData ?? seedInvestors;

  const totals = useMemo(
    () => {
      const filterByPeriod = (date: string) => {
        const d = new Date(date);
        return period.mode === "monthly" ? d.getMonth() === period.month && d.getFullYear() === period.year : d.getFullYear() === period.year;
      };

      const revenueTotal = revenue.filter((r) => filterByPeriod(r.entryDate)).reduce((sum, r) => sum + r.revenueAmount, 0);
      const tax = revenueTotal * 0.2;
      const payrollTotal = payroll.filter((p) => filterByPeriod(p.payrollDate)).reduce((sum, p) => sum + p.payAmount, 0);
      const expenseTotal =
        expenses.filter((e) => filterByPeriod(e.expenseDate)).reduce((sum, e) => sum + e.amount, 0) +
        recurringInstances.filter((e) => filterByPeriod(e.expenseDate)).reduce((sum, e) => sum + e.amount, 0) +
        seedEmployees.reduce((sum, emp) => sum + emp.monthlySalary, 0);
      const profit = revenueTotal - tax - payrollTotal - expenseTotal;
      return { revenueTotal, payrollTotal, expenseTotal, tax, profit };
    },
    [expenses, payroll, period, recurringInstances, revenue],
  );

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">Finance</p>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Revenue & Reports</h1>
            <p className="text-sm text-slate-600">Monthly / yearly dashboards with tax, payroll, expenses, and investor distributions.</p>
          </div>
          <PeriodSelector mode={period.mode} month={period.month} year={period.year} onChange={setPeriod} />
        </div>
        <p className="text-sm text-slate-600">Monthly / quarterly / yearly dashboards with tax + audit.</p>
      </div>

      {revError ? (
        <ErrorState message="Finance dashboard offline" onRetry={refetchRevenue} />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <Card title="Revenue">
              <p className="text-2xl font-bold text-slate-900">${totals.revenueTotal.toFixed(2)}</p>
            </Card>
            <Card title="Expenses">
              <p className="text-2xl font-bold text-slate-900">${totals.expenseTotal.toFixed(2)}</p>
            </Card>
            <Card title="Net Profit">
              <p className="text-2xl font-bold text-slate-900">${totals.profit.toFixed(2)}</p>
            </Card>
            <Card title="Revenue Tax">
              <p className="text-2xl font-bold text-slate-900">${totals.tax.toFixed(2)}</p>
            </Card>
          </div>
          <Card title="Business Reports" description="Monthly and yearly summaries">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-sm font-semibold text-slate-900">Revenue Entries</p>
                <ul className="mt-2 space-y-1 text-xs text-slate-700">
                  {revenue
                    .filter((r) => new Date(r.entryDate).getFullYear() === period.year)
                    .map((r) => (
                      <li key={r.id}>
                        {r.entryDate}: ${r.revenueAmount.toFixed(2)}
                      </li>
                    ))}
                </ul>
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-sm font-semibold text-slate-900">Payroll & Expenses</p>
                <ul className="mt-2 space-y-1 text-xs text-slate-700">
                  {payroll.map((p) => (
                    <li key={p.id}>
                      {p.payrollDate}: ${p.payAmount.toFixed(2)} ({p.hoursPaid} hrs)
                    </li>
                  ))}
                  {expenses.map((e) => (
                    <li key={e.id}>
                      {e.expenseDate}: ${e.amount.toFixed(2)} {e.category}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
          <div className="grid gap-4 md:grid-cols-3">
            <Card title="Cashflow & Audit" description="Audit log with immutable history">
              <p className="text-sm text-slate-700">Cash-in/out tracked with receipts and ledger entries.</p>
              <p className="text-xs text-slate-500">All finance data scoped by tenant_id; agent role blocked by RBAC.</p>
            </Card>
            <Card title="Recurring expense templates" description="Activate/deactivate with date rules">
              <ul className="space-y-2 text-xs text-slate-700">
                {recurring.map((r) => (
                  <li key={r.id}>
                    {r.name}: ${r.amount} • day {r.dayOfMonth} • {r.isActive ? "active" : "inactive"}
                  </li>
                ))}
              </ul>
            </Card>
            <Card title="Investors / Payments" description="Monthly investor payout">
              <ul className="space-y-2 text-xs text-slate-700">
                {investors.map((inv) => (
                  <li key={inv.id}>
                    {inv.name}: {(inv.percentShare * 100).toFixed(0)}% → ${(totals.profit * inv.percentShare).toFixed(2)}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};
