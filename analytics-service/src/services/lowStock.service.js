const inventoryRepository = require("../repositories/inventory.repository");
const productRepository = require("../repositories/product.repository");

const getLowStock = async () => {
  const [inventory, products] = await Promise.all([
    inventoryRepository.scanAll(),
    productRepository.scanAll(),
  ]);

  const productMap = {};
  for (const p of products) {
    productMap[p.productId || p.id] = p;
  }

  const low = inventory
    .filter(
      (item) =>
        (item.currentStock ?? item.stock ?? 0) <= (item.threshold || 0)
    )
    .map((item) => {
      const product = productMap[item.productId || item.id] || {};
      return {
        productId: item.productId || item.id,
        name: product.name || "Unknown Product",
        category: product.category || "",
        currentStock: item.currentStock ?? item.stock ?? 0,
        threshold: item.threshold || 0,
        lastUpdated: item.lastUpdated || item.updatedAt || null,
      };
    })
    .sort((a, b) => a.currentStock - b.currentStock);

  return low;
};

module.exports = { getLowStock };
