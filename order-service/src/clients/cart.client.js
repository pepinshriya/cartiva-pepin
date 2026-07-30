const axios = require("axios");

const CART_SERVICE_URL =
  process.env.CART_SERVICE_URL || "http://localhost:3003";


const getCartByUserId = async (userId) => {
  try {

    const response = await axios.get(
      `${CART_SERVICE_URL}/api/cart/${userId}`,
      {
        timeout: 5000
      }
    );

    return response.data.data;

  } catch (error) {

    throw {
      statusCode: error.response?.status || 500,
      message:
        error.response?.data?.error ||
        "Cart service unavailable",
    };
  }
};


module.exports = {
  getCartByUserId,
};