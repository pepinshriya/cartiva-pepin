const orderRepository = require('../repositories/order.repository');
const productRepository = require('../repositories/product.repository');

const getTopProducts = async () => {
  const [orders, products] = await Promise.all([
    orderRepository.scanAll(),
    productRepository.scanAll(),
  ]);

  const productSales = {};

  for (const order of orders) {
    const items = order.items || [];
    for (const item of items) {
      const productId = item.productId || item.id || item.productId;
      if (!productId) {
        continue;
      }

      if (!productSales[productId]) {
        productSales[productId] = { sold: 0, revenue: 0 };
      }

      productSales[productId].sold += item.quantity || 1;
      productSales[productId].revenue += (item.price || 0) * (item.quantity || 1);
    }
  }

  const productMap = {};
  for (const p of products) {
    productMap[p.productId || p.id] = p;
  }

  const ranked = Object.entries(productSales)
    .map(([productId, sales]) => {
      const product = productMap[productId] || {};
      return {
        productId,
        name: product.name || 'Unknown Product',
        category: product.category || '',
        sold: sales.sold,
        revenue: sales.revenue,
      };
    })
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 10);

  return ranked;
};

module.exports = { getTopProducts };
