import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { useAuth } from "../context/AuthContext";

export const Layout = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  return (
    <div className="flex h-screen bg-muted">
      {user && <Sidebar />}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl p-6">{children}</div>
      </main>
    </div>
  );
};
