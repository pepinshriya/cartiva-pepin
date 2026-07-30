const axios = require('axios');

const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3001';

const getProductById = async (productId) => {
  console.log('Calling Product URL:', `${PRODUCT_SERVICE_URL}/api/products/${productId}`);

  try {
    const response = await axios.get(`${PRODUCT_SERVICE_URL}/api/products/${productId}`, {
      timeout: 5000,
    });

    console.log('Product Response:', response.data);

    return response.data.data;
  } catch (error) {
    console.log('Product Service Error:', error.message);

    throw {
      statusCode: 500,
      message: 'Product service unavailable',
    };
  }
};

module.exports = {
  getProductById,
};
