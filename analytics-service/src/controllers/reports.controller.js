const reportsService = require('../services/reports.service');
const response = require('../utils/response');

const getSalesReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const data = await reportsService.getSalesReport(startDate, endDate);
    return response.success(res, data);
  } catch (err) {
    next(err);
  }
};

const getInventoryReport = async (req, res, next) => {
  try {
    const data = await reportsService.getInventoryReport();
    return response.success(res, data);
  } catch (err) {
    next(err);
  }
};

const getCustomerReport = async (req, res, next) => {
  try {
    const data = await reportsService.getCustomerReport(req.headers.authorization);
    return response.success(res, data);
  } catch (err) {
    next(err);
  }
};

module.exports = { getSalesReport, getInventoryReport, getCustomerReport };
