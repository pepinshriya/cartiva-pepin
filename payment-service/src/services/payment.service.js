const { v4: uuidv4 } = require('uuid');
const paymentRepository = require('../repositories/payment.repository');
const PaymentModel = require('../models/payment.model');
const { validatePaymentId, validatePaymentData, validatePaymentStatus } = require('../utils/validator');

const createPayment = async (data) => {
  validatePaymentData(data);

  const payment = {
    paymentId: uuidv4(),
    orderId: data.orderId,
    userId: data.userId,
    amount: data.amount,
    paymentMethod: data.paymentMethod,
    status: PaymentModel.statuses.PENDING,
    transactionId: data.transactionId || null,
    createdAt: new Date().toISOString(),
  };

  return await paymentRepository.create(payment);
};

const getPayment = async (paymentId) => {
  validatePaymentId(paymentId);

  const payment = await paymentRepository.findById(paymentId);
  if (!payment) {
    throw { statusCode: 404, message: 'Payment not found' };
  }

  return payment;
};

const getPaymentByOrder = async (orderId) => {
  return await paymentRepository.findByOrderId(orderId);
};

const updatePaymentStatus = async (paymentId, status) => {
  validatePaymentId(paymentId);
  validatePaymentStatus(status);

  const existing = await paymentRepository.findById(paymentId);
  if (!existing) {
    throw { statusCode: 404, message: 'Payment not found' };
  }

  const updates = { status };

  return await paymentRepository.update(paymentId, updates);
};
const createPaymentFromOrder = async ({ orderId, userId, amount }) => {
  const payment = {
    paymentId: uuidv4(),
    orderId,
    userId,
    amount,
    paymentMethod: 'UNKNOWN',
    status: PaymentModel.statuses.PENDING,
    transactionId: null,
    createdAt: new Date().toISOString(),
  };

  return await paymentRepository.create(payment);
};
module.exports = { createPayment, getPayment, getPaymentByOrder, updatePaymentStatus, createPaymentFromOrder };