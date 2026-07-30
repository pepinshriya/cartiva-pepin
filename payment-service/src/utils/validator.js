const PaymentModel = require('../models/payment.model');

const validatePaymentId = (paymentId) => {
  if (!paymentId || typeof paymentId !== 'string') {
    throw { statusCode: 400, message: 'Valid paymentId is required' };
  }
};

const validatePaymentData = (data) => {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw { statusCode: 400, message: 'Request body must be a non-empty object' };
  }

  for (const field of PaymentModel.requiredFields) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      throw { statusCode: 400, message: `Missing required field: ${field}` };
    }
  }

  if (typeof data.amount !== 'number' || data.amount <= 0) {
    throw { statusCode: 400, message: 'Amount must be a positive number' };
  }

  const validMethods = ['CREDIT_CARD', 'DEBIT_CARD', 'PAYPAL', 'STRIPE'];
  if (!validMethods.includes(data.paymentMethod)) {
    throw { statusCode: 400, message: `Payment method must be one of: ${validMethods.join(', ')}` };
  }
};

const validatePaymentStatus = (status) => {
  if (!status || typeof status !== 'string') {
    throw { statusCode: 400, message: 'Valid payment status is required' };
  }

  const validStatuses = Object.values(PaymentModel.statuses);
  if (!validStatuses.includes(status)) {
    throw { statusCode: 400, message: `Payment status must be one of: ${validStatuses.join(', ')}` };
  }
};

module.exports = { validatePaymentId, validatePaymentData, validatePaymentStatus };
