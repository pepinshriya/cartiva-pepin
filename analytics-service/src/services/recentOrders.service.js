const orderRepository = require('../repositories/order.repository');

const getRecentOrders = async () => {
  const orders = await orderRepository.scanAll();

  const sorted = orders.sort((a, b) => {
    const dateA = new Date(a.createdAt || a.created || 0);
    const dateB = new Date(b.createdAt || b.created || 0);
    return dateB - dateA;
  });

  return sorted.slice(0, 5).map((o) => ({
    orderId: o.orderId || o.id,
    customerName: o.customerName || o.customer?.name || '—',
    totalAmount: o.totalAmount || o.total || 0,
    status: o.status || 'UNKNOWN',
    paymentStatus: o.paymentStatus || 'UNPAID',
    createdAt: o.createdAt || o.created || null,
    items: (o.items || []).length,
  }));
};

module.exports = { getRecentOrders };
