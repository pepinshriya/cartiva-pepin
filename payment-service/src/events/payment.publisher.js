const { PublishCommand } = require('@aws-sdk/client-sns');
const snsClient = require('../config/sns');

const publishPaymentCompleted = async (payment) => {
  const message = {
    eventType: 'PAYMENT_COMPLETED',

    data: {
      orderId: payment.orderId,
      paymentId: payment.paymentId,
      paymentStatus: 'SUCCESS',
      timestamp: new Date().toISOString(),
    },
  };

  const command = new PublishCommand({
    TopicArn: process.env.PAYMENT_TOPIC_ARN,
    Message: JSON.stringify(message),
  });

  await snsClient.send(command);

  console.log('=================================');
  console.log('PAYMENT_COMPLETED Event Published');
  console.log(JSON.stringify(message, null, 2));
  console.log('=================================');
};

const publishPaymentFailed = async (payment, reason) => {
  const message = {
    eventType: 'PAYMENT_FAILED',

    data: {
      orderId: payment.orderId,
      paymentId: payment.paymentId,
      paymentStatus: 'FAILED',
      reason: reason || 'Payment processing failed',
      timestamp: new Date().toISOString(),
    },
  };

  const command = new PublishCommand({
    TopicArn: process.env.PAYMENT_TOPIC_ARN,
    Message: JSON.stringify(message),
  });

  await snsClient.send(command);

  console.log('=================================');
  console.log('PAYMENT_FAILED Event Published');
  console.log(JSON.stringify(message, null, 2));
  console.log('=================================');
};

module.exports = {
  publishPaymentCompleted,
  publishPaymentFailed,
};
