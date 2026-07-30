const inventoryService = require('../services/inventory.service');
const response = require('../utils/response');

const addStock = async (req, res, next) => {
  try {
    const stock = await inventoryService.addStock(req.body);
    return response.created(res, stock);
  } catch (err) {
    next(err);
  }
};

const getStock = async (req, res, next) => {
  try {
    const stock = await inventoryService.getStock(req.params.productId);
    return response.success(res, stock);
  } catch (err) {
    next(err);
  }
};

const updateStock = async (req, res, next) => {
  try {
    const stock = await inventoryService.updateStock(req.params.productId, req.body);
    return response.success(res, stock);
  } catch (err) {
    next(err);
  }
};

const reduceStock = async (req, res, next) => {
  try {
    const stock = await inventoryService.reduceStock(req.params.productId, req.body);
    return response.success(res, stock);
  } catch (err) {
    next(err);
  }
};

const increaseStock = async (req, res, next) => {
  try {
    const stock = await inventoryService.increaseStock(req.params.productId, req.body);
    return response.success(res, stock);
  } catch (err) {
    next(err);
  }
};

const getAllInventory = async (req, res, next) => {
  try {
    const items = await inventoryService.getAllInventory();
    return response.success(res, items);
  } catch (err) {
    next(err);
  }
};

module.exports = { addStock, getStock, updateStock, reduceStock, increaseStock, getAllInventory };
