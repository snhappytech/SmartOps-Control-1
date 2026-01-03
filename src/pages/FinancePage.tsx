import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchFinance } from "../data/mockApi";
import { Card } from "../components/ui/Card";
import { ErrorState } from "../components/ui/ErrorState";

export const FinancePage = () => {
  const { data, isError, refetch } = useQuery({ queryKey: ["finance"], queryFn: fetchFinance });

  const totals = useMemo(
    () =>
      data?.reduce(
        (acc, row) => {
          acc.revenue += row.revenue;
          acc.expenses += row.expenses;
          acc.tax += row.tax;
          acc.profit += row.profit;
          return acc;
        },
        { revenue: 0, expenses: 0, tax: 0, profit: 0 },
      ),
    [data],
  );

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">Finance</p>
        <h1 className="text-2xl font-bold text-slate-900">Revenue & Reports</h1>
        <p className="text-sm text-slate-600">Monthly / quarterly / yearly dashboards with tax + audit.</p>
      </div>

      {isError ? (
        <ErrorState message="Finance dashboard offline" onRetry={refetch} />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <Card title="Revenue">
              <p className="text-2xl font-bold text-slate-900">${totals?.revenue.toLocaleString()}</p>
            </Card>
            <Card title="Expenses">
              <p className="text-2xl font-bold text-slate-900">${totals?.expenses.toLocaleString()}</p>
            </Card>
            <Card title="Net Profit">
              <p className="text-2xl font-bold text-slate-900">${totals?.profit.toLocaleString()}</p>
            </Card>
            <Card title="Revenue Tax">
              <p className="text-2xl font-bold text-slate-900">${totals?.tax.toLocaleString()}</p>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card title="Business Reports" description="Custom date & period filters">
              <ul className="space-y-2 text-sm text-slate-700">
                {data?.map((row) => (
                  <li key={row.month} className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
                    <span>{row.month}</span>
                    <span className="font-semibold">${row.profit.toLocaleString()} profit</span>
                  </li>
                ))}
              </ul>
            </Card>
            <Card title="Cashflow & Audit" description="Audit log with immutable history">
              <p className="text-sm text-slate-700">Cash-in/out tracked with receipts and ledger entries.</p>
              <p className="text-xs text-slate-500">All finance data scoped by tenant_id; agent role blocked by RBAC.</p>
            </Card>
            <Card title="Investors / Payments" description="Payments + receipts ledger">
              <p className="text-sm text-slate-700">Investor updates, payment links, and receipt archive.</p>
              <p className="text-xs text-slate-500">Supports card/bank/cash with audit trail.</p>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};
