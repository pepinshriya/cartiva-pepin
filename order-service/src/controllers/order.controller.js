const orderService = require('../services/order.service');
const response = require('../utils/response');

const placeOrder = async (req, res, next) => {
  try {
    const order = await orderService.placeOrder(req.body);
    return response.created(res, order);
  } catch (err) {
    next(err);
  }
};

const getOrder = async (req, res, next) => {
  try {
    const order = await orderService.getOrder(req.params.orderId);
    return response.success(res, order);
  } catch (err) {
    next(err);
  }
};

const getUserOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getUserOrders(req.params.userId);
    return response.success(res, orders);
  } catch (err) {
    next(err);
  }
};

const cancelOrder = async (req, res, next) => {
  try {
    const order = await orderService.cancelOrder(req.params.orderId);
    return response.success(res, order);
  } catch (err) {
    next(err);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getAllOrders();
    return response.success(res, orders);
  } catch (err) {
    next(err);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const order = await orderService.updateOrderStatus(req.params.orderId, status, note);
    return response.success(res, order);
  } catch (err) {
    next(err);
  }
};

const getOrderTimeline = async (req, res, next) => {
  try {
    const timeline = await orderService.getOrderTimeline(req.params.orderId);
    return response.success(res, timeline);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  placeOrder,
  getOrder,
  getUserOrders,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  getOrderTimeline,
};
