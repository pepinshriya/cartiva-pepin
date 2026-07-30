const paymentService = require('../services/payment.service');
const paymentPublisher = require('../events/payment.publisher');

module.exports.handler = async (event) => {
  for (const record of event.Records) {
    const snsMessage = JSON.parse(record.Sns.Message);
    if (snsMessage.eventType === 'ORDER_CREATED') {
      const { orderId, userId, amount } = snsMessage.data;
      console.log('Processing ORDER_CREATED for orderId:', orderId);
      const payment = await paymentService.createPayment({
        orderId,
        userId,
        amount,
        paymentMethod: 'CREDIT_CARD',
      });
      console.log('Payment created successfully for Order:', orderId);
      await paymentPublisher.publishPaymentCompleted(payment);
      console.log('PAYMENT_COMPLETED published for Order:', orderId);
    }
  }
  return { statusCode: 200 };
};
