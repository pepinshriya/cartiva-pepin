const axios = require('axios');

const INVENTORY_SERVICE_URL = process.env.INVENTORY_SERVICE_URL || 'http://localhost:3002';

const getStock = async (productId) => {
  try {
    const response = await axios.get(`${INVENTORY_SERVICE_URL}/api/inventory/${productId}`, {
      timeout: 5000,
    });

    return response.data.data;
  } catch (error) {
    throw {
      statusCode: error.response?.status || 500,
      message: error.response?.data?.error || 'Inventory service unavailable',
    };
  }
};

const reduceStock = async (productId, quantity) => {
  try {
    const response = await axios.patch(
      `${INVENTORY_SERVICE_URL}/api/inventory/${productId}/reduce`,
      {
        currentStock: quantity,
      },
      {
        timeout: 5000,
      }
    );

    return response.data.data;
  } catch (error) {
    throw {
      statusCode: error.response?.status || 500,
      message: error.response?.data?.error || 'Inventory service unavailable',
    };
  }
};

module.exports = {
  getStock,
  reduceStock,
};
