const TABLE_NAME = process.env.TABLE_NAME || 'Inventory';

const InventoryModel = {
  TABLE_NAME,
  requiredFields: ['productId', 'quantity'],
  fieldTypes: {
    productId: 'string',
    quantity: 'number',
  },
};

module.exports = InventoryModel;
