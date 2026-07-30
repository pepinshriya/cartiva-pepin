import axios from "axios";
import { getAccessToken } from "../auth/cognitoService";
import API_CONFIG from "../config/api";

const customerApi = axios.create({
  baseURL: API_CONFIG.customerOrders.baseURL,
  headers: { "Content-Type": "application/json" },
});

customerApi.interceptors.request.use(
  async (config) => {
    try {
      const token = await getAccessToken();
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch { /* noop */ }
    return config;
  },
  (error) => Promise.reject(error)
);

const transformOrder = (order) => ({
  id: order.orderId || order.id,
  orderId: order.orderId || order.id,
  customer: order.customer || { name: order.customerName || "—", email: order.customerEmail || "" },
  items: (order.items || []).map((item) => ({
    name: item.name || item.productName || "—",
    quantity: item.quantity ?? 1,
    price: item.price ?? 0,
    image: item.imageUrl || item.image || "",
  })),
  totalAmount: order.totalAmount ?? order.total ?? 0,
  paymentStatus: order.paymentStatus || "UNPAID",
  status: order.status || "PENDING",
  createdAt: order.createdAt || order.created || new Date().toISOString(),
  updatedAt: order.updatedAt || order.updated || "",
  shippingAddress: order.shippingAddress || null,
  notes: order.notes || "",
});

const transformTimeline = (entry) => ({
  id: entry.id || entry.eventId,
  status: entry.status || "",
  timestamp: entry.timestamp || entry.createdAt || new Date().toISOString(),
  note: entry.note || entry.message || "",
  performedBy: entry.performedBy || entry.user || "System",
});

export const getOrders = async () => {
  try {
    const response = await customerApi.get("/");
    const orders = response.data?.data ?? response.data ?? [];
    return orders.map(transformOrder);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    throw error;
  }
};

export const getOrderById = async (orderId) => {
  try {
    const response = await customerApi.get(`/${orderId}`);
    const order = response.data?.data ?? response.data;
    return transformOrder(order);
  } catch (error) {
    console.error("Failed to fetch order:", error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId, status, note) => {
  try {
    const response = await customerApi.put(`/${orderId}/status`, {
      status,
      note: note || "",
    });
    const updated = response.data?.data ?? response.data;
    return transformOrder(updated);
  } catch (error) {
    console.error("Failed to update order status:", error);
    throw error;
  }
};

export const getOrderTimeline = async (orderId) => {
  try {
    const response = await customerApi.get(`/${orderId}/timeline`);
    const entries = response.data?.data ?? response.data ?? [];
    return entries.map(transformTimeline);
  } catch (error) {
    console.error("Failed to fetch order timeline:", error);
    throw error;
  }
};

export const placeOrder = async (userId) => {
  const response = await customerApi.post("/", { userId });
  return response.data.data;
};

export const getOrder = async (orderId) => {
  const response = await customerApi.get(`/${orderId}`);
  return response.data.data;
};

export const getUserOrders = async (userId) => {
  const response = await customerApi.get(`/user/${userId}`);
  return response.data.data;
};

export const cancelOrder = async (orderId) => {
  const response = await customerApi.put(`/${orderId}/cancel`);
  return response.data.data;
};
