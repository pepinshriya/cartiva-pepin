const inventoryRepository = require('../repositories/inventory.repository');
const { validateProductId, validateStockData } = require('../utils/validator');

const calculateStatus = (currentStock, threshold) => {
  if (currentStock === 0) {
    return 'OUT_OF_STOCK';
  }
  if (currentStock <= threshold) {
    return 'LOW_STOCK';
  }
  return 'IN_STOCK';
};

const addStock = async (data) => {
  validateStockData(data);

  if (!data.productId) {
    throw { statusCode: 400, message: 'productId is required' };
  }

  const existing = await inventoryRepository.findByProductId(data.productId);
  if (existing) {
    throw { statusCode: 409, message: 'Stock entry already exists for this product' };
  }

  const currentStock = data.currentStock || 0;
  const threshold = data.threshold || 10;

  const inventory = {
    productId: data.productId,
    currentStock,
    reservedStock: data.reservedStock || 0,
    threshold,
    status: calculateStatus(currentStock, threshold),
    createdAt: new Date().toISOString(),
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
  validateStockData(data);

  const existing = await inventoryRepository.findByProductId(productId);
  if (!existing) {
    throw { statusCode: 404, message: 'Stock not found for this product' };
  }

  const updates = {};
  let newCurrentStock = existing.currentStock || 0;
  let newThreshold = existing.threshold || 10;

  if (data.currentStock !== undefined) {
    updates.currentStock = data.currentStock;
    newCurrentStock = data.currentStock;
  }
  if (data.reservedStock !== undefined) {
    updates.reservedStock = data.reservedStock;
  }
  if (data.threshold !== undefined) {
    updates.threshold = data.threshold;
    newThreshold = data.threshold;
  }

  updates.status = calculateStatus(newCurrentStock, newThreshold);
  updates.updatedAt = new Date().toISOString();

  return await inventoryRepository.update(productId, updates);
};

const reduceStock = async (productId, data) => {
  validateProductId(productId);
  validateStockData(data);

  if (data.currentStock === undefined) {
    throw { statusCode: 400, message: 'currentStock delta is required to reduce stock' };
  }

  const existing = await inventoryRepository.findByProductId(productId);
  if (!existing) {
    throw { statusCode: 404, message: 'Stock not found for this product' };
  }

  const current = existing.currentStock || 0;
  if (current < data.currentStock) {
    throw { statusCode: 400, message: 'Insufficient stock' };
  }

  const newCurrentStock = current - data.currentStock;
  const newThreshold = existing.threshold || 10;

  const updates = {
    currentStock: newCurrentStock,
    status: calculateStatus(newCurrentStock, newThreshold),
    updatedAt: new Date().toISOString(),
  };

  return await inventoryRepository.update(productId, updates);
};

const increaseStock = async (productId, data) => {
  validateProductId(productId);
  validateStockData(data);

  if (data.currentStock === undefined) {
    throw { statusCode: 400, message: 'currentStock delta is required to increase stock' };
  }

  const existing = await inventoryRepository.findByProductId(productId);
  if (!existing) {
    throw { statusCode: 404, message: 'Stock not found for this product' };
  }

  const current = existing.currentStock || 0;
  const newCurrentStock = current + data.currentStock;
  const newThreshold = existing.threshold || 10;

  const updates = {
    currentStock: newCurrentStock,
    status: calculateStatus(newCurrentStock, newThreshold),
    updatedAt: new Date().toISOString(),
  };

  return await inventoryRepository.update(productId, updates);
};

const getAllInventory = async () => {
  const items = await inventoryRepository.findAll();
  return items;
};

module.exports = { addStock, getStock, updateStock, reduceStock, increaseStock, getAllInventory };
