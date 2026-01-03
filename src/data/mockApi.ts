import {
  agents,
  announcements,
  appointments,
  clients,
  employees,
  expenses,
  financeSnapshots,
  investors,
  notifications,
  orders,
  payroll,
  payrollEntries,
  products,
  recurringExpenses,
  recurringInstances,
  revenueEntries,
  tickets,
  users,
} from "./mockData";
import type {
  Agent,
  Branding,
  Client,
  Employee,
  Investor,
  Notification,
  Order,
  Product,
  RecurringExpense,
  RecurringInstance,
  RevenueEntry,
  Role,
  User,
} from "../types";
import { seedBrand, tenantId } from "./mockData";

const simulateLatency = async <T>(payload: T, fail = false) =>
  new Promise<T>((resolve, reject) => {
    setTimeout(() => {
      if (fail) {
        reject(new Error("SmartOps Control demo API unavailable"));
      } else {
        resolve(payload);
      }
    }, 120);
  });

export const fetchUserByRole = (role: Role) => {
  const found = users.find((u) => u.role === role);
  return simulateLatency(found ?? null);
};

export const fetchProducts = () => simulateLatency(products.filter((p) => p.isActive));

export const fetchProduct = (id: string) => simulateLatency(products.find((p) => p.id === id) ?? null);

export const fetchOrders = () => simulateLatency(orders);

export const fetchTickets = () => simulateLatency(tickets);

export const fetchAppointments = () => simulateLatency(appointments);

export const fetchPayroll = (agentId?: string) =>
  simulateLatency(agentId ? payroll.filter((p) => p.agentId === agentId) : payroll);

export const fetchAnnouncements = () => simulateLatency(announcements);

export const fetchFinance = () => simulateLatency(financeSnapshots);

let brandingState: Branding = seedBrand;

export const fetchBranding = () => simulateLatency(brandingState);

export const updateBranding = (branding: Branding) => {
  brandingState = { ...branding, tenantId };
  return simulateLatency(brandingState);
};

export const createUser = (user: User) => {
  const exists = users.some((u) => u.email === user.email);
  if (exists) {
    return simulateLatency(null, true);
  }
  users.push(user);
  return simulateLatency(user);
};

export const fetchAgents = () => simulateLatency(agents);
export const createAgent = (agent: Agent) => {
  agents.push(agent);
  return simulateLatency(agent);
};

export const fetchEmployees = () => simulateLatency(employees);
export const createEmployee = (employee: Employee) => {
  employees.push(employee);
  return simulateLatency(employee);
};

export const fetchClients = () => simulateLatency(clients);
export const createClient = (client: Client) => {
  clients.push(client);
  return simulateLatency(client);
};

export const fetchRevenueEntries = () => simulateLatency(revenueEntries);
export const createRevenueEntry = (entry: RevenueEntry) => {
  revenueEntries.push(entry);
  return simulateLatency(entry);
};

export const fetchPayrollEntries = () => simulateLatency(payrollEntries);
export const createPayrollEntry = (entry: RevenueEntry) => {
  payrollEntries.push(entry as any);
  return simulateLatency(entry);
};

export const fetchExpenses = () => simulateLatency(expenses);
export const fetchRecurringExpenses = () => simulateLatency(recurringExpenses);
export const fetchRecurringInstances = () => simulateLatency(recurringInstances);
export const createRecurringInstance = (instance: RecurringInstance) => {
  recurringInstances.push(instance);
  return simulateLatency(instance);
};

export const fetchInvestors = () => simulateLatency(investors);
export const fetchNotifications = () => simulateLatency(notifications);
export const markNotificationRead = (id: string) => {
  const found = notifications.find((n) => n.id === id);
  if (found) found.isRead = true;
  return simulateLatency(found);
};
