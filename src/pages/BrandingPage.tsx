import { useEffect, useState } from "react";
import { Card } from "../components/ui/Card";
import { useBranding } from "../context/BrandingContext";
import { ErrorState } from "../components/ui/ErrorState";

export const BrandingPage = () => {
  const { branding, loading, update } = useBranding();
  const [name, setName] = useState(branding?.name ?? "SmartOps Control");
  const [logoUrl, setLogoUrl] = useState(branding?.logoUrl ?? "/soc-logo.svg");
  const [primaryColor, setPrimaryColor] = useState(branding?.primaryColor ?? "#0F6FFF");
  const [accentColor, setAccentColor] = useState(branding?.accentColor ?? "#0B1840");

  useEffect(() => {
    if (branding) {
      setName(branding.name);
      setLogoUrl(branding.logoUrl);
      setPrimaryColor(branding.primaryColor);
      setAccentColor(branding.accentColor);
    }
  }, [branding]);

  if (loading) return <p className="p-6 text-sm text-slate-600">Loading branding…</p>;
  if (!branding) return <ErrorState message="Branding unavailable" />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Branding</p>
          <h1 className="text-2xl font-bold text-slate-900">White-label configuration</h1>
          <p className="text-sm text-slate-600">Update brand name, logo, and theme. Applied across UI and exports.</p>
        </div>
        <button
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white"
          onClick={() =>
            update({
              ...branding,
              name,
              logoUrl,
              primaryColor,
              accentColor,
            })
          }
        >
          Save brand
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Brand identity">
          <label className="text-sm text-slate-700">
            Name
            <input
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label className="mt-3 block text-sm text-slate-700">
            Logo URL
            <input
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
            />
          </label>
        </Card>
        <Card title="Theme colors">
          <label className="text-sm text-slate-700">
            Primary color
            <input
              type="color"
              className="mt-1 block h-10 w-20 rounded-md border border-slate-200"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
            />
          </label>
          <label className="mt-3 block text-sm text-slate-700">
            Accent color
            <input
              type="color"
              className="mt-1 block h-10 w-20 rounded-md border border-slate-200"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
            />
          </label>
        </Card>
      </div>
      <Card title="Preview">
        <div
          className="rounded-xl p-6 text-white"
          style={{ background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})` }}
        >
          <p className="text-sm uppercase tracking-wide">SmartOps Control</p>
          <h2 className="text-2xl font-bold">{name}</h2>
          <p className="text-sm opacity-80">Tenant-ready white-label theme</p>
        </div>
      </Card>
    </div>
  );
};
