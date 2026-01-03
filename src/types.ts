export type Role = "admin" | "manager" | "accountant" | "agent" | "guest";

export type TenantScoped = {
  tenantId: string;
};

export type User = {
  id: string;
  name: string;
  role: Role;
  email: string;
  tenantId: string;
  avatarUrl?: string;
};

export type Branding = {
  name: string;
  logoUrl: string;
  primaryColor: string;
  accentColor: string;
  tagline?: string;
  tenantId?: string;
};

export type Product = TenantScoped & {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  isActive: boolean;
  category: string;
};

export type Order = TenantScoped & {
  id: string;
  productId: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  paymentType: "card" | "bank" | "cash";
  customerName: string;
  createdAt: string;
};

export type AgentPayroll = TenantScoped & {
  agentId: string;
  hours: number;
  hourlyRate: number;
  paidDate?: string;
};

export type SupportTicket = TenantScoped & {
  id: string;
  title: string;
  status: "open" | "in_progress" | "closed";
  priority: "low" | "medium" | "high";
  assigneeId: string;
  createdAt: string;
};

export type ClientAppointment = TenantScoped & {
  id: string;
  clientName: string;
  project: string;
  agentId: string;
  start: string;
};

export type Announcement = TenantScoped & {
  id: string;
  message: string;
  audience: Role[];
  createdAt: string;
};

export type FinancialSnapshot = TenantScoped & {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
  tax: number;
};
