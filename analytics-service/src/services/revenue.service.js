const orderRepository = require('../repositories/order.repository');

const getDailyRevenue = async () => {
  const orders = await orderRepository.scanAll();

  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const dailyMap = {};

  for (const order of orders) {
    const createdAt = order.createdAt || order.created;
    if (!createdAt) {
      continue;
    }

    const orderDate = new Date(createdAt);
    if (orderDate < thirtyDaysAgo) {
      continue;
    }

    const dateKey = orderDate.toISOString().slice(0, 10);
    const amount = order.totalAmount || order.total || 0;

    if (!dailyMap[dateKey]) {
      dailyMap[dateKey] = { date: dateKey, revenue: 0, orders: 0 };
    }

    dailyMap[dateKey].revenue += amount;
    dailyMap[dateKey].orders += 1;
  }

  const result = Object.values(dailyMap).sort((a, b) => a.date.localeCompare(b.date));

  return result;
};

module.exports = { getDailyRevenue };
