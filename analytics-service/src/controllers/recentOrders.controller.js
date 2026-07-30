const recentOrdersService = require("../services/recentOrders.service");
const response = require("../utils/response");

const getRecentOrders = async (req, res, next) => {
  try {
    const data = await recentOrdersService.getRecentOrders();
    return response.success(res, data);
  } catch (err) {
    next(err);
  }
};

module.exports = { getRecentOrders };
