import axios from "axios";
import { getAccessToken } from "../../auth/cognitoService";
import API_CONFIG from "../../config/api";

const customersApi = axios.create({
  baseURL: API_CONFIG.customers.baseURL,
  headers: { "Content-Type": "application/json" },
});

customersApi.interceptors.request.use(
  async (config) => {
    try {
      const token = await getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // Token unavailable — proceed without header
    }
    return config;
  },
  (error) => Promise.reject(error)
);

customersApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

const transformCustomer = (c) => ({
  id: c.customerId || c.id,
  customerId: c.customerId || c.id,
  name: c.name || '—',
  email: c.email || '',
  phone: c.phone || '',
  totalOrders: c.totalOrders ?? 0,
  totalSpending: c.totalSpending ?? 0,
  status: c.status || 'ACTIVE',
  createdAt: c.createdAt || c.created || new Date().toISOString(),
  shippingAddresses: c.shippingAddresses || [],
  latestOrder: c.latestOrder || null,
});

const transformOrder = (o) => ({
  id: o.orderId || o.id,
  orderId: o.orderId || o.id,
  totalAmount: o.totalAmount ?? 0,
  status: o.status || 'PENDING',
  createdAt: o.createdAt || o.created || new Date().toISOString(),
  items: (o.items || []).map((item) => ({
    name: item.name || item.productName || '—',
    quantity: item.quantity ?? 1,
    price: item.price ?? 0,
  })),
});

export const getCustomers = async () => {
  try {
    const response = await customersApi.get('/api/customers');
    const items = response.data?.data ?? response.data ?? [];
    return items.map(transformCustomer);
  } catch (error) {
    console.error('Failed to fetch customers:', error);
    throw error;
  }
};

export const getCustomerById = async (id) => {
  try {
    const response = await customersApi.get(`/api/customers/${id}`);
    const data = response.data?.data ?? response.data;
    return transformCustomer(data);
  } catch (error) {
    console.error('Failed to fetch customer:', error);
    throw error;
  }
};

export const getCustomerOrders = async (id) => {
  try {
    const response = await customersApi.get(`/api/customers/${id}/orders`);
    const items = response.data?.data ?? response.data ?? [];
    return items.map(transformOrder);
  } catch (error) {
    console.error('Failed to fetch customer orders:', error);
    throw error;
  }
};

export const updateCustomerStatus = async (id, status) => {
  try {
    const response = await customersApi.put(`/api/customers/${id}/status`, { status });
    const data = response.data?.data ?? response.data;
    return transformCustomer(data);
  } catch (error) {
    console.error('Failed to update customer status:', error);
    throw error;
  }
};
