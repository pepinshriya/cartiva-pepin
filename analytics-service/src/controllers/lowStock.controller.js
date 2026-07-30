const lowStockService = require('../services/lowStock.service');
const response = require('../utils/response');

const getLowStock = async (req, res, next) => {
  try {
    const data = await lowStockService.getLowStock();
    return response.success(res, data);
  } catch (err) {
    next(err);
  }
};

module.exports = { getLowStock };
