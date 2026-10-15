import axios from 'axios';

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Paths that require ADMIN auth (override guest token)
const ADMIN_PATHS = [
  '/admin/',
  '/audit',
  '/invitations/tenant/',
  '/invitations/',
  '/orders',
  '/payments/manual/pending',
  '/payments/manual/', // verify/reject endpoints
  '/uniforms/tenant/',
  '/uniforms/',
  '/upload',
];

function isAdminEndpoint(url: string): boolean {
  if (!url) return false;
  return ADMIN_PATHS.some((p) => url.startsWith(p));
}

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const url = config.url || '';
    const adminToken = localStorage.getItem('admin_token');
    const guestToken = localStorage.getItem('token');

    // Prefer admin token for admin endpoints
    let token = '';
    if (isAdminEndpoint(url) && adminToken) {
      token = adminToken;
    } else if (adminToken && !guestToken) {
      // Fallback: only admin logged in
      token = adminToken;
    } else if (guestToken) {
      token = guestToken;
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['accept-language'] = localStorage.getItem('lang') || 'sw';
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      const url = err.config?.url || '';
      if (isAdminEndpoint(url)) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('erick-admin');
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('erick-auth');
      }
      // 🔑 NO redirect here — layouts handle navigation
    }
    return Promise.reject(err);
  },
);

// ---- Types ----
export interface TenantConfig {
  slug: string; honoreName: string; eventType: string; brandColor: string;
  logoUrl?: string; heroImageUrl?: string; phonePrimary: string;
  phoneSecondary: string; whatsappNumber: string; mixxBusinessNumber: string;
  enabledPayments: string[]; defaultLocale: string;
}
export interface Category {
  id: string; slug: string; titleSw: string; titleEn: string;
  descSw?: string; descEn?: string; icon?: string; imageUrl?: string;
}
export interface Product {
  id: string; sku: string; nameSw: string; nameEn: string;
  descSw?: string; descEn?: string; price: number; comparePrice?: number;
  images: string[]; sizes: string[]; colors: string[]; stock: number; categoryId?: string;
}
export interface OrderItem {
  id: string; productId: string; productName: string; imageUrl?: string;
  size?: string; color?: string; unitPrice: number; quantity: number; lineTotal: number;
}
export interface Order {
  id: string; orderNumber: string; status: string; customerName: string;
  customerPhone: string; total: number; currency: string;
  items: OrderItem[]; createdAt: string;
}
export interface ManualPaymentInit {
  paymentId: string; referenceCode: string; businessNumber: string;
  amount: number; currency: string; status: string; expiresInMinutes: number;
  ussdSteps: string[];
  supportPhones: { primary: string; secondary: string; whatsapp: string; };
  message?: string;
}
export interface LoginResponse {
  accessToken: string;
  user: { id: string; role: 'guest'; name: string; phone: string; inviteCode: string; tenantId: string; };
  tenant: { slug: string; honoreName: string; brandColor: string; whatsappNumber: string; phonePrimary: string; phoneSecondary: string; };
}
import type { GuestUser, GuestTenant } from './store';

export const Api = {
  loginUnified: (phone: string, code: string) =>
    api.post('/auth/login', { phone, code }).then((r) => r.data),
  getTenantConfig: (slug: string) => api.get<TenantConfig>(`/tenants/${slug}/config`).then((r) => r.data),
  loginByCode: (code: string) => api.post<LoginResponse>('/guest/login/code', { code }).then((r) => r.data),
  loginByPhone: (phone: string, tenantSlug: string) => api.post<LoginResponse>('/guest/login/phone', { phone, tenantSlug }).then((r) => r.data),
  getMyInvitation: () => api.get('/guest/me').then((r) => r.data),
  getCategories: (tenantId: string) => api.get<Category[]>(`/categories/tenant/${tenantId}`).then((r) => r.data),
  getProducts: (tenantId: string, categoryId?: string) => api.get<{ items: Product[]; total: number }>('/products', { params: { tenantId, categoryId, limit: 100 } }).then((r) => r.data),
  getProduct: (id: string) => api.get<Product>(`/products/${id}`).then((r) => r.data),
  createOrder: (payload: any) => api.post<Order>('/orders', payload).then((r) => r.data),
  getOrder: (id: string) => api.get<Order>(`/orders/${id}`).then((r) => r.data),
  initManualPayment: (payload: { orderId: string; customerPhone: string; customerName?: string }) =>
    api.post<ManualPaymentInit>('/payments/manual/initiate', payload).then((r) => r.data),
  confirmManualPayment: (paymentId: string) =>
    api.post(`/payments/manual/${paymentId}/confirm`).then((r) => r.data),
  getPaymentStatus: (paymentId: string) =>
    api.get<{ id: string; status: string; referenceCode: string; amount: number }>(
      `/payments/manual/${paymentId}/status`,
    ).then((r) => r.data),
};

export const AdminApi = {
  login: (password: string) =>
    api.post<{ accessToken: string; user: any }>('/admin/login', { password }).then((r) => r.data),
  analytics: (tenantId: string) =>
    api.get('/admin/analytics', { params: { tenantId } }).then((r) => r.data),
};
