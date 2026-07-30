const dashboardService = require("../services/dashboard.service");
const response = require("../utils/response");

const getDashboard = async (req, res, next) => {
  try {
    const data = await dashboardService.getDashboard();
    return response.success(res, data);
  } catch (err) {
    next(err);
  }
};

module.exports = { getDashboard };
