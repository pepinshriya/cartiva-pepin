const orderRepository = require('../repositories/order.repository');
const productRepository = require('../repositories/product.repository');
const inventoryRepository = require('../repositories/inventory.repository');

const getDashboard = async () => {
  const [orders, products, inventory] = await Promise.all([
    orderRepository.scanAll(),
    productRepository.scanAll(),
    inventoryRepository.scanAll(),
  ]);

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || o.total || 0), 0);

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (o) => o.status === 'PENDING' || o.status === 'pending'
  ).length;

  const uniqueCustomers = new Set(
    orders.map((o) => o.customerEmail || o.userId || o.customer?.email).filter(Boolean)
  );

  const lowStockItems = inventory.filter(
    (item) => (item.currentStock ?? item.stock ?? 0) <= (item.threshold || 0)
  );

  return {
    revenue: totalRevenue,
    orders: totalOrders,
    pendingOrders,
    products: products.length,
    customers: uniqueCustomers.size,
    lowStock: lowStockItems.length,
  };
};

module.exports = { getDashboard };
