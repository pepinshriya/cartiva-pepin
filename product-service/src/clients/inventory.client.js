const axios = require('axios');

const INVENTORY_SERVICE_URL = process.env.INVENTORY_SERVICE_URL || 'http://localhost:3002';

const createInventory = async (data, authHeader) => {
  try {
    const response = await axios.post(`${INVENTORY_SERVICE_URL}/api/inventory`, data, {
      headers: authHeader ? { Authorization: authHeader } : {},
      timeout: 5000,
    });

    return response.data.data;
  } catch (error) {
    throw {
      statusCode: error.response?.status || 500,
      message: error.response?.data?.error || error.message || 'Inventory service unavailable',
    };
  }
};

module.exports = {
  createInventory,
};
