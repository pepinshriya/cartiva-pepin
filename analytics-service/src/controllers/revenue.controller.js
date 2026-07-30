const revenueService = require('../services/revenue.service');
const response = require('../utils/response');

const getRevenue = async (req, res, next) => {
  try {
    const data = await revenueService.getDailyRevenue();
    return response.success(res, data);
  } catch (err) {
    next(err);
  }
};

module.exports = { getRevenue };
