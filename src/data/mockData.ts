import {
  AgentPayroll,
  Announcement,
  Branding,
  ClientAppointment,
  FinancialSnapshot,
  Order,
  Product,
  Role,
  SupportTicket,
  User,
} from "../types";

export const tenantId = "tenant-smartops";

export const seedBrand: Branding = {
  name: "SmartOps Control",
  logoUrl: "/soc-logo.svg",
  primaryColor: "#0F6FFF",
  accentColor: "#0B1840",
  tagline: "White-label control center for operations teams",
};

export const users: User[] = [
  {
    id: "u-admin",
    name: "Alex Admin",
    role: "admin",
    email: "admin@smartops.control",
    tenantId,
  },
  {
    id: "u-manager",
    name: "Morgan Manager",
    role: "manager",
    email: "manager@smartops.control",
    tenantId,
  },
  {
    id: "u-accountant",
    name: "Avery Accountant",
    role: "accountant",
    email: "accountant@smartops.control",
    tenantId,
  },
  {
    id: "u-agent",
    name: "Casey Agent",
    role: "agent",
    email: "agent@smartops.control",
    tenantId,
  },
];

export const products: Product[] = [
  {
    id: "prod-ai-assist",
    name: "AI Call Assist",
    description: "Realtime AI assistance for call agents with sentiment and script guidance.",
    price: 79,
    currency: "USD",
    isActive: true,
    category: "SaaS",
    tenantId,
  },
  {
    id: "prod-quality",
    name: "Quality Tracker",
    description: "QA scorecards, coaching, and compliance automation.",
    price: 59,
    currency: "USD",
    isActive: true,
    category: "SaaS",
    tenantId,
  },
  {
    id: "prod-legacy",
    name: "Legacy Archive",
    description: "Archived data access",
    price: 25,
    currency: "USD",
    isActive: false,
    category: "Service",
    tenantId,
  },
];

export const orders: Order[] = [
  {
    id: "ord-1",
    productId: "prod-ai-assist",
    amount: 790,
    status: "paid",
    paymentType: "card",
    customerName: "Nova Telecom",
    createdAt: "2024-10-01",
    tenantId,
  },
  {
    id: "ord-2",
    productId: "prod-quality",
    amount: 1180,
    status: "pending",
    paymentType: "bank",
    customerName: "Helio Support",
    createdAt: "2024-10-05",
    tenantId,
  },
];

export const payroll: AgentPayroll[] = [
  {
    agentId: "u-agent",
    hours: 32,
    hourlyRate: 22,
    paidDate: "2024-09-28",
    tenantId,
  },
];

export const tickets: SupportTicket[] = [
  {
    id: "t1",
    title: "Escalated billing issue",
    status: "in_progress",
    priority: "high",
    assigneeId: "u-agent",
    createdAt: "2024-10-07T10:00:00Z",
    tenantId,
  },
  {
    id: "t2",
    title: "Feature request: export by team",
    status: "open",
    priority: "medium",
    assigneeId: "u-manager",
    createdAt: "2024-10-02T09:00:00Z",
    tenantId,
  },
];

export const appointments: ClientAppointment[] = [
  {
    id: "a1",
    clientName: "Helio Support",
    project: "Onboarding",
    agentId: "u-agent",
    start: "2024-10-10T15:00:00Z",
    tenantId,
  },
  {
    id: "a2",
    clientName: "Nova Telecom",
    project: "Renewal",
    agentId: "u-manager",
    start: "2024-10-11T17:00:00Z",
    tenantId,
  },
];

export const announcements: Announcement[] = [
  {
    id: "ann1",
    message: "SmartOps Control v1.0 launched with white-label branding.",
    audience: ["admin", "manager", "accountant", "agent"],
    createdAt: "2024-10-01",
    tenantId,
  },
  {
    id: "ann2",
    message: "Happy Birthday Casey Agent! 🎂",
    audience: ["agent"],
    createdAt: "2024-10-04",
    tenantId,
  },
];

export const financeSnapshots: FinancialSnapshot[] = [
  { month: "2024-08", revenue: 210000, expenses: 132000, profit: 78000, tax: 15600, tenantId },
  { month: "2024-09", revenue: 225000, expenses: 140000, profit: 85000, tax: 17000, tenantId },
  { month: "2024-10", revenue: 232000, expenses: 142500, profit: 89500, tax: 17900, tenantId },
];

export const roleCanManageUsers = (role: Role) => role === "admin" || role === "manager";
