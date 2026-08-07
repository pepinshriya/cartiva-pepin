const InventoryModel = require('../models/inventory.model');

const validateProductId = (productId) => {
  if (!productId || typeof productId !== 'string') {
    throw { statusCode: 400, message: 'Valid productId is required' };
  }
};

const validateStockData = (data) => {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw { statusCode: 400, message: 'Request body must be a non-empty object' };
  }

  for (const field of InventoryModel.requiredFields) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      throw { statusCode: 400, message: `Missing required field: ${field}` };
    }
  }

  if (data.currentStock !== undefined) {
    if (typeof data.currentStock !== 'number' || data.currentStock < 0) {
      throw { statusCode: 400, message: 'currentStock must be a non-negative number' };
    }
  }

  if (data.reservedStock !== undefined) {
    if (typeof data.reservedStock !== 'number' || data.reservedStock < 0) {
      throw { statusCode: 400, message: 'reservedStock must be a non-negative number' };
    }
  }

  if (data.threshold !== undefined) {
    if (typeof data.threshold !== 'number' || data.threshold < 0) {
      throw { statusCode: 400, message: 'threshold must be a non-negative number' };
    }
  }

  if (data.status !== undefined) {
    throw {
      statusCode: 400,
      message: 'status cannot be updated manually; it is calculated automatically',
    };
  }
  if (data.createdAt !== undefined) {
    throw { statusCode: 400, message: 'createdAt cannot be modified manually' };
  }
  if (data.updatedAt !== undefined) {
    throw { statusCode: 400, message: 'updatedAt cannot be modified manually' };
  }
};

module.exports = { validateProductId, validateStockData };
