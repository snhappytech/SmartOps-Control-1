import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchUserByRole } from "../data/mockApi";
import type { Role, User } from "../types";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  loginAs: (role: Role) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<Role>("guest");
  const { data, isLoading } = useQuery({
    queryKey: ["user", role],
    queryFn: () => fetchUserByRole(role),
    retry: 1,
  });

  const value = useMemo<AuthContextValue>(
    () => ({
      user: data ?? (role === "guest" ? { id: "guest", name: "Guest", role, email: "", tenantId: "public" } : null),
      loading: isLoading,
      loginAs: setRole,
      logout: () => setRole("guest"),
    }),
    [data, isLoading, role],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
