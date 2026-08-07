const TABLE_NAME = process.env.TABLE_NAME || 'Inventory';

const InventoryModel = {
  TABLE_NAME,
  requiredFields: ['productId'],
  fieldTypes: {
    productId: 'string',
    productName: 'string',
    category: 'string',
    price: 'number',
    imageUrl: 'string',
    currentStock: 'number',
    reservedStock: 'number',
    threshold: 'number',
    status: 'string',
    createdAt: 'string',
    updatedAt: 'string',
  },
  statuses: {
    IN_STOCK: 'IN_STOCK',
    LOW_STOCK: 'LOW_STOCK',
    OUT_OF_STOCK: 'OUT_OF_STOCK',
  },
};

module.exports = InventoryModel;
