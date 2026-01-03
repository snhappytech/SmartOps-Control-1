import {
  Agent,
  AgentPayroll,
  Announcement,
  Branding,
  Client,
  ClientAppointment,
  Employee,
  Expense,
  FinancialSnapshot,
  Investor,
  Notification,
  Order,
  PayrollEntry,
  Product,
  RecurringExpense,
  RecurringInstance,
  RevenueEntry,
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

export const agents: Agent[] = [
  {
    id: "ag-001",
    fullName: "Casey Agent",
    address: "123 Market St",
    phone: "+1 555-1001",
    email: "agent@smartops.control",
    birthdayDate: "1996-10-04",
    photoUrl: "https://placekitten.com/140/140",
    agentCode: "AGT-001",
    hourlyRate: 22,
    assignedClients: ["client-1", "client-2"],
    status: "active",
    tenantId,
  },
  {
    id: "ag-002",
    fullName: "Taylor Agent",
    address: "88 King St",
    phone: "+1 555-1002",
    email: "taylor.agent@smartops.control",
    birthdayDate: "1994-11-12",
    photoUrl: "https://placekitten.com/141/141",
    agentCode: "AGT-002",
    hourlyRate: 24,
    assignedClients: ["client-3"],
    status: "active",
    tenantId,
  },
];

export const employees: Employee[] = [
  {
    id: "emp-001",
    fullName: "Jordan Support",
    phone: "+1 555-2001",
    email: "jordan@smartops.control",
    birthdayDate: "1990-10-12",
    photoUrl: "https://placekitten.com/142/142",
    monthlySalary: 4200,
    tasks: "People Ops & onboarding",
    status: "active",
    tenantId,
  },
  {
    id: "emp-002",
    fullName: "Riley Finance",
    phone: "+1 555-2002",
    email: "riley@smartops.control",
    monthlySalary: 5300,
    tasks: "Accounting & payroll approvals",
    status: "active",
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

export const clients: Client[] = [
  {
    id: "client-1",
    fullName: "Nova Telecom",
    email: "ops@novatelecom.com",
    phoneNumber: "+1 555-3001",
    address: "88 Sunset Blvd",
    projectName: "Renewal",
    appointmentDate: "2024-10-11",
    appointmentTime: "17:00",
    assignedAgentId: "ag-001",
    tenantId,
  },
  {
    id: "client-2",
    fullName: "Helio Support",
    email: "hello@heliosupport.com",
    phoneNumber: "+1 555-3002",
    address: "42 Lake View",
    projectName: "Onboarding",
    appointmentDate: "2024-10-10",
    appointmentTime: "15:00",
    assignedAgentId: "ag-001",
    tenantId,
  },
  {
    id: "client-3",
    fullName: "Airlift Corp",
    email: "team@airlift.com",
    phoneNumber: "+1 555-3003",
    address: "11 Harbor Way",
    projectName: "Implementation",
    appointmentDate: "2024-10-18",
    appointmentTime: "10:00",
    assignedAgentId: "ag-002",
    tenantId,
  },
];

export const revenueEntries: RevenueEntry[] = [
  {
    id: "rev-1",
    entryDate: "2024-10-01",
    hoursWorked: 6,
    contractRatePerHour: 80,
    revenueAmount: 480,
    agentId: "ag-001",
    tenantId,
  },
  {
    id: "rev-2",
    entryDate: "2024-10-02",
    hoursWorked: 5,
    contractRatePerHour: 90,
    revenueAmount: 450,
    agentId: "ag-002",
    tenantId,
  },
  {
    id: "rev-3",
    entryDate: "2024-09-15",
    hoursWorked: 8,
    contractRatePerHour: 85,
    revenueAmount: 680,
    agentId: "ag-001",
    tenantId,
  },
];

export const payrollEntries: PayrollEntry[] = [
  {
    id: "pay-1",
    payrollDate: "2024-09-28",
    agentId: "ag-001",
    hoursPaid: 32,
    payAmount: 704,
    tenantId,
  },
  {
    id: "pay-2",
    payrollDate: "2024-10-05",
    agentId: "ag-002",
    hoursPaid: 18,
    payAmount: 432,
    tenantId,
  },
];

export const expenses: Expense[] = [
  { id: "exp-1", expenseDate: "2024-10-03", amount: 1200, category: "Software", description: "Dialer seats", tenantId },
  { id: "exp-2", expenseDate: "2024-10-05", amount: 980, category: "Training", description: "QA workshop", tenantId },
];

export const recurringExpenses: RecurringExpense[] = [
  {
    id: "rec-1",
    name: "Office Lease",
    amount: 5500,
    isActive: true,
    dayOfMonth: 1,
    category: "Rent",
    description: "Monthly rent",
    tenantId,
  },
  {
    id: "rec-2",
    name: "Dialer subscription",
    amount: 1400,
    isActive: true,
    dayOfMonth: 5,
    category: "Software",
    description: "Per seat billing",
    tenantId,
  },
];

export const recurringInstances: RecurringInstance[] = [
  {
    id: "rec-inst-1",
    templateId: "rec-1",
    month: "2024-10",
    expenseDate: "2024-10-01",
    amount: 5500,
    category: "Rent",
    tenantId,
  },
  {
    id: "rec-inst-2",
    templateId: "rec-2",
    month: "2024-10",
    expenseDate: "2024-10-05",
    amount: 1400,
    category: "Software",
    tenantId,
  },
];

export const investors: Investor[] = [
  { id: "inv-1", name: "Northstar Capital", percentShare: 0.12, tenantId },
  { id: "inv-2", name: "Summit Ventures", percentShare: 0.08, tenantId },
];

export const notifications: Notification[] = [
  {
    id: "n1",
    type: "birthday",
    title: "Birthday",
    message: "Wish Casey Agent a happy birthday!",
    createdAt: "2024-10-04T09:00:00Z",
    isRead: false,
    tenantId,
  },
  {
    id: "n2",
    type: "top_agent",
    title: "Agent of the Month",
    message: "Casey Agent is leading hours for October.",
    createdAt: "2024-10-02T10:00:00Z",
    isRead: true,
    tenantId,
  },
  {
    id: "n3",
    type: "recurring_expense",
    title: "Recurring Expense",
    message: "Dialer subscription posted for October.",
    createdAt: "2024-10-05T08:00:00Z",
    isRead: false,
    tenantId,
  },
];

export const roleCanManageUsers = (role: Role) => role === "admin" || role === "manager";
