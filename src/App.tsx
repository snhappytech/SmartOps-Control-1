import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Layout } from "./components/Layout";
import { DashboardPage } from "./pages/DashboardPage";
import { ProductsPage } from "./pages/ProductsPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { OrdersPage } from "./pages/OrdersPage";
import { SupportPage } from "./pages/SupportPage";
import { FinancePage } from "./pages/FinancePage";
import { HrPage } from "./pages/HrPage";
import { BrandingPage } from "./pages/BrandingPage";
import { AdminUsersPage } from "./pages/AdminUsersPage";
import { LoginPage } from "./pages/LoginPage";
import { RoleGuard } from "./components/RoleGuard";
import { useAuth } from "./context/AuthContext";
import { BrandingProvider } from "./context/BrandingContext";

const Protected = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
          <p className="text-sm font-semibold text-slate-700">Loading session…</p>
        </div>
      </div>
    );
  }

  if (!user || user.role === "guest") {
    return <Navigate to="/products" replace state={{ from: location.pathname }} />;
  }

  return children;
};

export default function App() {
  return (
    <BrandingProvider>
      <AppRoutes />
    </BrandingProvider>
  );
}

const AppRoutes = () => {
  const shell = (node: JSX.Element) => <Layout>{node}</Layout>;

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Protected>
            {shell(<DashboardPage />)}
          </Protected>
        }
      />
      <Route path="/login" element={shell(<LoginPage />)} />
      <Route path="/products" element={shell(<ProductsPage />)} />
      <Route path="/products/:id" element={shell(<ProductDetailPage />)} />
      <Route
        path="/orders"
        element={
          <RoleGuard allow={["admin", "manager", "accountant"]}>
            {shell(<OrdersPage />)}
          </RoleGuard>
        }
      />
      <Route
        path="/support"
        element={
          <RoleGuard allow={["admin", "manager", "agent"]}>
            {shell(<SupportPage />)}
          </RoleGuard>
        }
      />
      <Route
        path="/finance"
        element={
          <RoleGuard allow={["admin", "manager", "accountant"]}>
            {shell(<FinancePage />)}
          </RoleGuard>
        }
      />
      <Route
        path="/hr"
        element={
          <RoleGuard allow={["admin", "manager", "accountant", "agent"]}>
            {shell(<HrPage />)}
          </RoleGuard>
        }
      />
      <Route
        path="/branding"
        element={
          <RoleGuard allow={["admin"]}>
            {shell(<BrandingPage />)}
          </RoleGuard>
        }
      />
      <Route
        path="/admin/users"
        element={
          <RoleGuard allow={["admin", "manager"]}>
            {shell(<AdminUsersPage />)}
          </RoleGuard>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
