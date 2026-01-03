import { useQuery } from "@tanstack/react-query";
import { fetchAgents, fetchEmployees, fetchBranding } from "../data/mockApi";
import { agents as seedAgents, employees as seedEmployees } from "../data/mockData";

export const LargeBirthdayPage = () => {
  const { data: branding } = useQuery({ queryKey: ["branding"], queryFn: fetchBranding });
  const { data: agents } = useQuery({ queryKey: ["agents"], queryFn: fetchAgents });
  const { data: employees } = useQuery({ queryKey: ["employees"], queryFn: fetchEmployees });
  const people = [...(agents ?? seedAgents), ...(employees ?? seedEmployees)];
  const today = new Date().toISOString().slice(5, 10);
  const birthday = people.find((p: any) => (p.birthdayDate ?? "").slice(5, 10) === today);

  if (!birthday) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900 text-white">
        <div className="text-center">
          <p className="text-2xl font-bold">No birthdays today</p>
          <p className="text-sm opacity-80">Upcoming birthdays will auto-generate a card.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex h-screen items-center justify-center"
      style={{ background: `linear-gradient(135deg, ${branding?.primaryColor ?? "#0F6FFF"}, ${branding?.accentColor ?? "#0B1840"})` }}
    >
      <div className="rounded-3xl bg-white/10 p-10 text-center text-white shadow-2xl backdrop-blur">
        <p className="text-sm uppercase tracking-wide">Happy Birthday</p>
        <h1 className="text-5xl font-black">{birthday.fullName}</h1>
        <p className="mt-4 text-lg opacity-90">— from {branding?.name ?? "SmartOps Control"}</p>
        <div className="mt-6 flex justify-center gap-4">
          <button className="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white">Download PNG</button>
          <button className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900">Share link</button>
        </div>
      </div>
    </div>
  );
};
