import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchProducts } from "../data/mockApi";
import { Card } from "../components/ui/Card";
import { ErrorState } from "../components/ui/ErrorState";
import { useAuth } from "../context/AuthContext";

export const ProductsPage = () => {
  const { data, isError, refetch } = useQuery({ queryKey: ["products"], queryFn: fetchProducts });
  const { user } = useAuth();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Products</p>
          <h1 className="text-2xl font-bold text-slate-900">Active products (guest friendly)</h1>
        </div>
        <div className="flex items-center gap-2">
          {user?.role === "guest" && (
            <a
              href="/login"
              className="rounded-md bg-primary px-3 py-1 text-xs font-semibold text-white transition hover:bg-primary/90"
            >
              Admin / Manager login
            </a>
          )}
          <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">{user?.role}</span>
        </div>
      </div>
      {isError ? (
        <ErrorState message="Unable to load products" onRetry={refetch} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {data?.map((product) => (
            <Card key={product.id} title={product.name} description={product.category}>
              <p className="text-sm text-slate-700">{product.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-xl font-semibold text-slate-900">
                  ${product.price} <span className="text-sm text-slate-500">{product.currency}</span>
                </p>
                <Link to={`/products/${product.id}`} className="text-sm font-semibold text-primary hover:underline">
                  View
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
