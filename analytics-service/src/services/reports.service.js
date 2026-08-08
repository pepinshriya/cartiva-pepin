const orderRepository = require('../repositories/order.repository');
const inventoryRepository = require('../repositories/inventory.repository');
const productRepository = require('../repositories/product.repository');
const axios = require('axios');

const CUSTOMER_SERVICE_URL = process.env.CUSTOMER_SERVICE_URL || 'http://localhost:3001';

const getSalesReport = async (startDate, endDate) => {
  const orders = await orderRepository.scanAll();
  const start = startDate ? new Date(startDate) : new Date(0);
  const end = endDate ? new Date(endDate) : new Date();

  if (endDate) {
    end.setHours(23, 59, 59, 999);
  }

  const dailyMap = {};

  for (const order of orders) {
    const createdAt = order.createdAt || order.created;
    if (!createdAt) {
      continue;
    }

    const orderDate = new Date(createdAt);
    if (orderDate < start || orderDate > end) {
      continue;
    }

    const dateKey = orderDate.toISOString().slice(0, 10);
    if (!dailyMap[dateKey]) {
      dailyMap[dateKey] = { date: dateKey, revenue: 0, orders: 0 };
    }

    const amount = order.totalAmount || order.total || 0;
    dailyMap[dateKey].revenue += amount;
    dailyMap[dateKey].orders += 1;
  }

  return Object.values(dailyMap).sort((a, b) => a.date.localeCompare(b.date));
};

const getInventoryReport = async () => {
  const [inventory, products] = await Promise.all([
    inventoryRepository.scanAll(),
    productRepository.scanAll(),
  ]);

  const productMap = {};
  for (const p of products) {
    productMap[p.productId || p.id] = p;
  }

  return inventory.map((item) => {
    const product = productMap[item.productId || item.id] || {};
    const currentStock = item.currentStock ?? item.stock ?? 0;
    const price = product.price || 0;
    return {
      productId: item.productId || item.id,
      productName: product.name || 'Unknown Product',
      currentStock,
      threshold: item.threshold || 0,
      inventoryValue: currentStock * price,
    };
  });
};

const getCustomerReport = async (authHeader) => {
  try {
    const response = await axios.get(`${CUSTOMER_SERVICE_URL}/api/customers`, {
      headers: authHeader ? { Authorization: authHeader } : {},
    });

    const customers = response.data?.data ?? response.data ?? [];
    return customers.map((c) => ({
      name: c.name || '—',
      email: c.email || '',
      totalOrders: c.totalOrders || 0,
      totalSpending: c.totalSpending || 0,
      lastPurchase: c.latestOrder?.createdAt || c.latestOrder?.created || '',
    }));
  } catch (err) {
    console.error('Error fetching customers for report:', err.message);
    return [];
  }
};

module.exports = { getSalesReport, getInventoryReport, getCustomerReport };
