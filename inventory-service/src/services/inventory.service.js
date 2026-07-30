const inventoryRepository = require('../repositories/inventory.repository');
const { validateProductId, validateStockData, validateQuantity } = require('../utils/validator');

const addStock = async (data) => {
  validateStockData(data);

  const existing = await inventoryRepository.findByProductId(data.productId);
  if (existing) {
    throw { statusCode: 409, message: 'Stock entry already exists for this product' };
  }

  const inventory = {
    productId: data.productId,
    quantity: data.quantity,
    updatedAt: new Date().toISOString(),
  };

  return await inventoryRepository.create(inventory);
};

const getStock = async (productId) => {
  validateProductId(productId);

  const stock = await inventoryRepository.findByProductId(productId);
  if (!stock) {
    throw { statusCode: 404, message: 'Stock not found for this product' };
  }

  return stock;
};

const updateStock = async (productId, data) => {
  validateProductId(productId);
  validateQuantity(data.quantity);

  const existing = await inventoryRepository.findByProductId(productId);
  if (!existing) {
    throw { statusCode: 404, message: 'Stock not found for this product' };
  }

  const updates = {
    quantity: data.quantity,
    updatedAt: new Date().toISOString(),
  };

  return await inventoryRepository.update(productId, updates);
};

const reduceStock = async (productId, data) => {
  validateProductId(productId);
  validateQuantity(data.quantity);

  const existing = await inventoryRepository.findByProductId(productId);
  if (!existing) {
    throw { statusCode: 404, message: 'Stock not found for this product' };
  }

  if (existing.quantity < data.quantity) {
    throw { statusCode: 400, message: 'Insufficient stock' };
  }

  const updates = {
    quantity: existing.quantity - data.quantity,
    updatedAt: new Date().toISOString(),
  };

  return await inventoryRepository.update(productId, updates);
};

const increaseStock = async (productId, data) => {
  validateProductId(productId);
  validateQuantity(data.quantity);

  const existing = await inventoryRepository.findByProductId(productId);
  if (!existing) {
    throw { statusCode: 404, message: 'Stock not found for this product' };
  }

  const updates = {
    quantity: existing.quantity + data.quantity,
    updatedAt: new Date().toISOString(),
  };

  return await inventoryRepository.update(productId, updates);
};

const getAllInventory = async () => {
  const items = await inventoryRepository.findAll();
  return items;
};

module.exports = { addStock, getStock, updateStock, reduceStock, increaseStock, getAllInventory };
