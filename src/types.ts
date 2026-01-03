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
  password?: string;
  status?: "active" | "inactive";
};

export type Branding = {
  name: string;
  logoUrl: string;
  primaryColor: string;
  accentColor: string;
  tagline?: string;
  tenantId?: string;
};

export type Agent = TenantScoped & {
  id: string;
  fullName: string;
  address?: string;
  phone?: string;
  email: string;
  birthdayDate?: string;
  photoUrl?: string;
  agentCode: string;
  hourlyRate: number;
  assignedClients: string[];
  status: "active" | "inactive";
};

export type Employee = TenantScoped & {
  id: string;
  fullName: string;
  phone?: string;
  email?: string;
  birthdayDate?: string;
  photoUrl?: string;
  monthlySalary: number;
  tasks?: string;
  status: "active" | "inactive";
};

export type Client = TenantScoped & {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  projectName: string;
  appointmentDate: string;
  appointmentTime: string;
  assignedAgentId: string;
};

export type RevenueEntry = TenantScoped & {
  id: string;
  entryDate: string;
  hoursWorked: number;
  contractRatePerHour: number;
  revenueAmount: number;
  agentId?: string;
};

export type PayrollEntry = TenantScoped & {
  id: string;
  payrollDate: string;
  agentId: string;
  hoursPaid: number;
  payAmount: number;
};

export type Expense = TenantScoped & {
  id: string;
  expenseDate: string;
  amount: number;
  category: string;
  description: string;
};

export type RecurringExpense = TenantScoped & {
  id: string;
  name: string;
  amount: number;
  isActive: boolean;
  dayOfMonth: number;
  category: string;
  description?: string;
};

export type RecurringInstance = TenantScoped & {
  id: string;
  templateId: string;
  month: string;
  expenseDate: string;
  amount: number;
  category: string;
};

export type Investor = TenantScoped & {
  id: string;
  name: string;
  percentShare: number;
};

export type NotificationType = "birthday" | "top_agent" | "payroll" | "recurring_expense";

export type Notification = TenantScoped & {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
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
