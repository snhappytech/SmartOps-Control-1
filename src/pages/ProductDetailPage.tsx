import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProduct } from "../data/mockApi";
import { Card } from "../components/ui/Card";
import { ErrorState } from "../components/ui/ErrorState";

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isError, refetch, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id ?? ""),
    enabled: !!id,
  });

  if (isLoading) {
    return <p className="p-6 text-sm text-slate-600">Loading product…</p>;
  }

  if (isError) {
    return <ErrorState message="Failed to load product" onRetry={refetch} />;
  }

  if (!data) {
    return <p className="p-6 text-sm text-slate-600">Product not found.</p>;
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">Products</p>
        <h1 className="text-2xl font-bold text-slate-900">{data.name}</h1>
        <p className="text-sm text-slate-600">{data.description}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Overview" description={data.category}>
          <p className="text-3xl font-bold text-slate-900">
            ${data.price} <span className="text-sm text-slate-500">{data.currency}</span>
          </p>
        </Card>
        <Card title="Availability">
          <p className="text-sm text-slate-700">
            Status: <span className="font-semibold">{data.isActive ? "Active" : "Archived"}</span>
          </p>
          <p className="text-xs text-slate-500">Guests can browse active products only.</p>
        </Card>
      </div>
    </div>
  );
};
