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

  if (typeof data.quantity !== 'number' || data.quantity < 0) {
    throw { statusCode: 400, message: 'Quantity must be a non-negative number' };
  }
};

const validateQuantity = (quantity) => {
  if (quantity === undefined || quantity === null || typeof quantity !== 'number' || quantity < 0) {
    throw { statusCode: 400, message: 'Valid quantity must be a non-negative number' };
  }
};

module.exports = { validateProductId, validateStockData, validateQuantity };
