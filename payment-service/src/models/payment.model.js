const TABLE_NAME = process.env.TABLE_NAME || 'payment-pepin';

const PaymentModel = {
  TABLE_NAME,
  requiredFields: ['orderId', 'userId', 'amount', 'paymentMethod'],
  fieldTypes: {
    paymentId: 'string',
    orderId: 'string',
    userId: 'string',
    amount: 'number',
    status: 'string',
    paymentMethod: 'string',
    transactionId: 'string',
    createdAt: 'string',
  },
  statuses: {
    PENDING: 'PENDING',
    SUCCESS: 'SUCCESS',
    FAILED: 'FAILED',
    REFUNDED: 'REFUNDED',
  },
};

module.exports = PaymentModel;
