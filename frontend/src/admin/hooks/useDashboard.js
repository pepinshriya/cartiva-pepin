import { useState, useEffect, useCallback } from 'react';
import {
  getDashboardStats,
  getRevenueAnalytics,
  getRecentOrders,
  getTopProducts,
  getLowStockProducts,
} from '../services/dashboardService';

const STATUS_MAP = {
  DELIVERED: 'Delivered',
  SHIPPED: 'Shipped',
  PENDING: 'Pending',
  CONFIRMED: 'Processing',
  CANCELLED: 'Cancelled',
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formatShortDate = (iso) => {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
  } catch {
    return iso;
  }
};

const formatDate = (iso) => {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  } catch {
    return iso;
  }
};

const buildStats = (data) => [
  {
    id: 'revenue',
    label: 'Total Revenue',
    value: `$${(data.revenue ?? 0).toLocaleString()}`,
    icon: 'TrendingUp',
    color: '#3b82f6',
    bgColor: '#eff6ff',
  },
  {
    id: 'orders',
    label: 'Orders',
    value: (data.orders ?? 0).toLocaleString(),
    icon: 'ShoppingCart',
    color: '#10b981',
    bgColor: '#ecfdf5',
  },
  {
    id: 'products',
    label: 'Products',
    value: (data.products ?? 0).toLocaleString(),
    icon: 'Package',
    color: '#f59e0b',
    bgColor: '#fffbeb',
  },
  {
    id: 'customers',
    label: 'Customers',
    value: (data.customers ?? 0).toLocaleString(),
    icon: 'Users',
    color: '#8b5cf6',
    bgColor: '#f5f3ff',
  },
];

const buildRevenue = (data) => {
  if (!Array.isArray(data)) return [];
  return data.map((d) => ({
    month: formatShortDate(d.date),
    revenue: d.revenue ?? 0,
    orders: d.orders ?? 0,
  }));
};

const buildRecentOrders = (data) => {
  if (!Array.isArray(data)) return [];
  return data.map((o) => ({
    id: o.orderId || '—',
    customer: o.customerName || '—',
    email: o.customerEmail || '',
    date: formatDate(o.createdAt),
    status: STATUS_MAP[o.status] || o.status,
    amount: o.totalAmount ?? 0,
  }));
};

const buildTopProducts = (data) => {
  if (!Array.isArray(data)) return [];
  return data.map((p) => ({
    id: p.productId || p.id,
    name: p.name || 'Unknown',
    category: p.category || '',
    sold: p.sold ?? 0,
    revenue: p.revenue ?? 0,
    growth: '—',
  }));
};

const buildLowStock = (data) => {
  if (!Array.isArray(data)) return [];
  return data.map((item) => {
    const ratio = item.threshold > 0 ? (item.currentStock ?? 0) / item.threshold : 1;
    return {
      id: item.productId || item.id,
      name: item.name || 'Unknown',
      category: item.category || '',
      stock: item.currentStock ?? 0,
      threshold: item.threshold ?? 10,
      status: ratio <= 0.3 ? 'critical' : 'low',
    };
  });
};

const useDashboard = () => {
  const [stats, setStats] = useState([]);
  const [revenueAnalytics, setRevenueAnalytics] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [dashboardData, revenueData, ordersData, productsData, lowStockData] =
        await Promise.all([
          getDashboardStats(),
          getRevenueAnalytics(),
          getRecentOrders(),
          getTopProducts(),
          getLowStockProducts(),
        ]);

      setStats(buildStats(dashboardData));
      setRevenueAnalytics(buildRevenue(revenueData));
      setRecentOrders(buildRecentOrders(ordersData));
      setTopProducts(buildTopProducts(productsData));
      setLowStockProducts(buildLowStock(lowStockData));
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to load dashboard data';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    stats,
    revenueAnalytics,
    recentOrders,
    topProducts,
    lowStockProducts,
    loading,
    error,
    refresh: fetch,
  };
};

export default useDashboard;
