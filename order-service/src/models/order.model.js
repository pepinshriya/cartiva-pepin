const TABLE_NAME = process.env.TABLE_NAME || 'order-pepin';

const OrderModel = {
  TABLE_NAME,
  requiredFields: ['userId', 'items', 'totalAmount'],
  fieldTypes: {
    orderId: 'string',
    userId: 'string',
    items: 'array',
    totalAmount: 'number',
    status: 'string',
    paymentStatus: 'string',
    statusHistory: 'array',
    createdAt: 'string',
  },
  statuses: {
    PENDING: 'PENDING',
    CONFIRMED: 'CONFIRMED',
    SHIPPED: 'SHIPPED',
    DELIVERED: 'DELIVERED',
    CANCELLED: 'CANCELLED',
    PAYMENT_FAILED: 'PAYMENT_FAILED',
  },
  paymentStatuses: {
    PENDING: 'PENDING',
    PAID: 'PAID',
    FAILED: 'FAILED',
    REFUNDED: 'REFUNDED',
  },
};

module.exports = OrderModel;
