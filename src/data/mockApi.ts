import {
  announcements,
  appointments,
  financeSnapshots,
  orders,
  payroll,
  products,
  tickets,
  users,
} from "./mockData";
import type { Branding, Order, Product, Role, User } from "../types";
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
