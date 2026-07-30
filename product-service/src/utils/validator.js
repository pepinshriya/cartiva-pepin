const ProductModel = require('../models/product.model');

const validateId = (id) => {
  if (!id || typeof id !== 'string') {
    throw { statusCode: 400, message: 'Valid ID is required' };
  }
};

const validateProductData = (data) => {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw { statusCode: 400, message: 'Request body must be a non-empty object' };
  }

  for (const field of ProductModel.requiredFields) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      throw { statusCode: 400, message: `Missing required field: ${field}` };
    }
  }

  if (typeof data.price !== 'number' || data.price <= 0) {
    throw { statusCode: 400, message: 'Price must be a positive number' };
  }
};

const validateUpdateData = (data) => {
  if (!data || typeof data !== 'object' || Array.isArray(data) || Object.keys(data).length === 0) {
    throw { statusCode: 400, message: 'Request body must be a non-empty object' };
  }

  if (data.price !== undefined && (typeof data.price !== 'number' || data.price <= 0)) {
    throw { statusCode: 400, message: 'Price must be a positive number' };
  }
};

module.exports = { validateId, validateProductData, validateUpdateData };
