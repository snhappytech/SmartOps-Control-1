import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAgents, fetchBranding, fetchRevenueEntries } from "../data/mockApi";
import { agents as seedAgents, revenueEntries as seedRevenue } from "../data/mockData";

export const LargeTopAgentPage = () => {
  const { data: branding } = useQuery({ queryKey: ["branding"], queryFn: fetchBranding });
  const { data: agents } = useQuery({ queryKey: ["agents"], queryFn: fetchAgents });
  const { data: revenue } = useQuery({ queryKey: ["revenue"], queryFn: fetchRevenueEntries });

  const agentsList = agents ?? seedAgents;
  const revenueEntries = revenue ?? seedRevenue;

  const topAgent = useMemo(() => {
    const totals: Record<string, number> = {};
    revenueEntries.forEach((r) => {
      const key = r.agentId ?? "unknown";
      totals[key] = (totals[key] ?? 0) + r.hoursWorked;
    });
    const [agentId] = Object.entries(totals).sort((a, b) => b[1] - a[1])[0] ?? [];
    const agent = agentsList.find((a) => a.id === agentId) ?? agentsList[0];
    return { agent, hours: totals[agent?.id ?? ""] ?? 0 };
  }, [agentsList, revenueEntries]);

  if (!topAgent.agent) {
    return <div className="flex h-screen items-center justify-center bg-slate-900 text-white">No agents found.</div>;
  }

  return (
    <div
      className="flex h-screen items-center justify-center"
      style={{ background: `linear-gradient(135deg, ${branding?.primaryColor ?? "#0F6FFF"}, ${branding?.accentColor ?? "#0B1840"})` }}
    >
      <div className="rounded-3xl bg-white/10 p-10 text-center text-white shadow-2xl backdrop-blur">
        <p className="text-sm uppercase tracking-wide">Agent of the Month</p>
        <h1 className="text-5xl font-black">{topAgent.agent.fullName}</h1>
        <p className="mt-3 text-lg opacity-90">{topAgent.hours.toFixed(0)} hours delivered</p>
        <div className="mt-6 flex justify-center gap-4">
          <button className="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white">Download</button>
          <button className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900">Share link</button>
        </div>
      </div>
    </div>
  );
};
