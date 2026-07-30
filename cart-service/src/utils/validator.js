const CartModel = require('../models/cart.model');

const validateUserId = (userId) => {
  if (!userId || typeof userId !== 'string') {
    throw { statusCode: 400, message: 'Valid userId is required' };
  }
};

const validateCartData = (data) => {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw { statusCode: 400, message: 'Request body must be a non-empty object' };
  }

  for (const field of CartModel.requiredFields) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      throw { statusCode: 400, message: `Missing required field: ${field}` };
    }
  }
};

const validateCartItem = (data) => {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw {
      statusCode: 400,
      message: 'Request body must be a non-empty object',
    };
  }

  const required = ['productId', 'quantity'];

  for (const field of required) {
    if (
      data[field] === undefined ||
      data[field] === null ||
      data[field] === ''
    ) {
      throw {
        statusCode: 400,
        message: `Missing required field: ${field}`,
      };
    }
  }

  if (typeof data.quantity !== 'number' || data.quantity <= 0) {
    throw {
      statusCode: 400,
      message: 'Quantity must be a positive number',
    };
  }
};

const validateProductId = (productId) => {
  if (!productId || typeof productId !== 'string') {
    throw { statusCode: 400, message: 'Valid productId is required' };
  }
};

const validateUpdateQuantity = (data) => {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw {
      statusCode: 400,
      message: 'Request body must be a non-empty object',
    };
  }

  if (data.quantity === undefined || data.quantity === null) {
    throw {
      statusCode: 400,
      message: 'Missing required field: quantity',
    };
  }

  if (typeof data.quantity !== 'number' || data.quantity <= 0) {
    throw {
      statusCode: 400,
      message: 'Quantity must be a positive number',
    };
  }
};

module.exports = { validateUserId, validateCartData, validateCartItem, validateProductId, validateUpdateQuantity };
