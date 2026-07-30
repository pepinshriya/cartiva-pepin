const OrderModel = require('../models/order.model');

const validateOrderId = (orderId) => {
  if (!orderId || typeof orderId !== 'string') {
    throw { statusCode: 400, message: 'Valid orderId is required' };
  }
};

const validateUserId = (userId) => {
  if (!userId || typeof userId !== 'string') {
    throw { statusCode: 400, message: 'Valid userId is required' };
  }
};

const validateOrderData = (data) => {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw { statusCode: 400, message: 'Request body must be a non-empty object' };
  }

  for (const field of OrderModel.requiredFields) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      throw { statusCode: 400, message: `Missing required field: ${field}` };
    }
  }

  if (!Array.isArray(data.items) || data.items.length === 0) {
    throw { statusCode: 400, message: 'Items must be a non-empty array' };
  }

  if (typeof data.totalAmount !== 'number' || data.totalAmount <= 0) {
    throw { statusCode: 400, message: 'Total amount must be a positive number' };
  }
};

module.exports = { validateOrderId, validateUserId, validateOrderData };
