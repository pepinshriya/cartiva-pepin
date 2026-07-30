const topProductsService = require("../services/topProducts.service");
const response = require("../utils/response");

const getTopProducts = async (req, res, next) => {
  try {
    const data = await topProductsService.getTopProducts();
    return response.success(res, data);
  } catch (err) {
    next(err);
  }
};

module.exports = { getTopProducts };
