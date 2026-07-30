const { PublishCommand } = require('@aws-sdk/client-sns');
const snsClient = require('../config/sns');

const publishOrderCreated = async (order) => {
  const message = {
    eventType: 'ORDER_CREATED',

    data: {
      orderId: order.orderId,
      userId: order.userId,
      amount: order.totalAmount,

      // Added for Inventory Service
      items: order.items,
    },
  };

  const command = new PublishCommand({
    TopicArn: process.env.ORDER_TOPIC_ARN,
    Message: JSON.stringify(message),
  });

  await snsClient.send(command);

  console.log('=================================');
  console.log('ORDER_CREATED Event Published');
  console.log(JSON.stringify(message, null, 2));
  console.log('=================================');
};

module.exports = {
  publishOrderCreated,
};
