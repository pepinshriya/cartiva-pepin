const paymentService = require('../services/payment.service');
const response = require('../utils/response');

const createPayment = async (req, res, next) => {
  try {
    const payment = await paymentService.createPayment(req.body);
    return response.created(res, payment);
  } catch (err) {
    next(err);
  }
};

const getPayment = async (req, res, next) => {
  try {
    const payment = await paymentService.getPayment(req.params.paymentId);
    return response.success(res, payment);
  } catch (err) {
    next(err);
  }
};

const getPaymentByOrder = async (req, res, next) => {
  try {
    const payments = await paymentService.getPaymentByOrder(req.params.orderId);
    return response.success(res, payments);
  } catch (err) {
    next(err);
  }
};

const updatePaymentStatus = async (req, res, next) => {
  try {
    const payment = await paymentService.updatePaymentStatus(req.params.paymentId, req.body.status);
    return response.success(res, payment);
  } catch (err) {
    next(err);
  }
};

module.exports = { createPayment, getPayment, getPaymentByOrder, updatePaymentStatus };
