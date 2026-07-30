const orderService = require('../services/order.service');

module.exports.handler = async (event) => {
  for (const record of event.Records) {
    const snsMessage = JSON.parse(record.Sns.Message);

    if (snsMessage.eventType === 'PAYMENT_COMPLETED') {
      const { orderId, paymentId, paymentStatus, timestamp } = snsMessage.data;

      console.log('Processing PAYMENT_COMPLETED for orderId:', orderId);

      await orderService.updateOrderPaymentStatus(orderId, {
        paymentStatus: 'PAID',
        status: 'CONFIRMED'
      });

      console.log('Order updated to CONFIRMED for orderId:', orderId);
    }

    if (snsMessage.eventType === 'PAYMENT_FAILED') {
      const { orderId, paymentId, reason } = snsMessage.data;

      console.log('Processing PAYMENT_FAILED for orderId:', orderId);

      await orderService.updateOrderPaymentStatus(orderId, {
        paymentStatus: 'FAILED',
        status: 'PAYMENT_FAILED'
      });

      console.log('Order updated to PAYMENT_FAILED for orderId:', orderId);
    }
  }

  return { statusCode: 200 };
};
