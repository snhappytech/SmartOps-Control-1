import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchOrders, fetchProducts } from "../data/mockApi";
import { Card } from "../components/ui/Card";
import { ErrorState } from "../components/ui/ErrorState";

export const OrdersPage = () => {
  const { data: orders, isError: ordersError, refetch: refetchOrders } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });
  const { data: products, isError: productsError, refetch: refetchProducts } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const revenue = useMemo(() => orders?.reduce((sum, order) => sum + order.amount, 0) ?? 0, [orders]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Commerce</p>
          <h1 className="text-2xl font-bold text-slate-900">Orders & Payments</h1>
          <p className="text-sm text-slate-600">Multi-payment type receipts with tenant_id scoping.</p>
        </div>
        <div className="rounded-lg bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
          Revenue: ${revenue.toLocaleString()}
        </div>
      </div>

      {ordersError ? (
        <ErrorState message="Orders unavailable" onRetry={refetchOrders} />
      ) : (
        <Card title="Orders" description="Payments and receipts">
          <div className="divide-y divide-slate-200">
            {orders?.map((order) => (
              <div key={order.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{order.customerName}</p>
                  <p className="text-xs text-slate-500">{order.createdAt}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">${order.amount.toLocaleString()}</p>
                  <p className="text-xs text-slate-500">
                    {order.paymentType.toUpperCase()} • {order.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {productsError ? (
        <ErrorState message="Products failed" onRetry={refetchProducts} />
      ) : (
        <Card title="Inventory" description="Active SKUs">
          <div className="grid gap-3 md:grid-cols-3">
            {products?.map((product) => (
              <div key={product.id} className="rounded-lg border border-slate-200 p-3">
                <p className="text-sm font-semibold text-slate-900">{product.name}</p>
                <p className="text-xs text-slate-600">{product.category}</p>
                <p className="text-sm font-semibold text-slate-900">${product.price}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
