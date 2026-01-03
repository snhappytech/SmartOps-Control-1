import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { Role } from "../types";

type Props = {
  allow: Role[];
  children: JSX.Element;
  redirectTo?: string;
};

export const RoleGuard = ({ allow, children, redirectTo = "/products" }: Props) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;
  if (!allow.includes(user.role)) {
    return <Navigate to={redirectTo} replace state={{ from: location.pathname }} />;
  }
  return children;
};
