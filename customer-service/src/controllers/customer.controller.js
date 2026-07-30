const customerService = require('../services/customer.service');
const response = require('../utils/response');

const getCustomers = async (req, res, next) => {
  try {
    const customers = await customerService.getCustomers();
    return response.success(res, customers);
  } catch (err) {
    next(err);
  }
};

const getCustomerById = async (req, res, next) => {
  try {
    const customer = await customerService.getCustomerById(req.params.id, req.headers.authorization);
    return response.success(res, customer);
  } catch (err) {
    next(err);
  }
};

const getCustomerOrders = async (req, res, next) => {
  try {
    const orders = await customerService.getCustomerOrders(req.params.id, req.headers.authorization);
    return response.success(res, orders);
  } catch (err) {
    next(err);
  }
};

const updateCustomerStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const customer = await customerService.updateCustomerStatus(req.params.id, status, req.headers.authorization);
    return response.success(res, customer);
  } catch (err) {
    next(err);
  }
};

module.exports = { getCustomers, getCustomerById, getCustomerOrders, updateCustomerStatus };
