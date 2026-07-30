import axios from 'axios';
import { getAccessToken } from '../../auth/cognitoService';
import API_CONFIG from '../../config/api';

const analyticsApi = axios.create({
  baseURL: API_CONFIG.analytics.baseURL,
  headers: { 'Content-Type': 'application/json' },
});

analyticsApi.interceptors.request.use(
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

analyticsApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const getDashboardStats = async () => {
  const response = await analyticsApi.get('/api/analytics/dashboard');
  return response.data?.data ?? response.data;
};

export const getRevenueAnalytics = async () => {
  const response = await analyticsApi.get('/api/analytics/revenue');
  return response.data?.data ?? response.data;
};

export const getRecentOrders = async () => {
  const response = await analyticsApi.get('/api/analytics/recent-orders');
  return response.data?.data ?? response.data;
};

export const getTopProducts = async () => {
  const response = await analyticsApi.get('/api/analytics/top-products');
  return response.data?.data ?? response.data;
};

export const getLowStockProducts = async () => {
  const response = await analyticsApi.get('/api/analytics/low-stock');
  return response.data?.data ?? response.data;
};
