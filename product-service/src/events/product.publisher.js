const { PublishCommand } = require('@aws-sdk/client-sns');
const snsClient = require('../config/sns');

const publishProductCreated = async (product, initialStock) => {
  const message = {
    eventType: 'PRODUCT_CREATED',
    data: {
      productId: product.productId,
      name: product.name,
      category: product.category,
      price: product.price,
      imageUrl: product.imageUrl,
      initialStock: initialStock,
    },
  };

  const command = new PublishCommand({
    TopicArn: process.env.PRODUCT_TOPIC_ARN,
    Message: JSON.stringify(message),
  });

  await snsClient.send(command);

  console.log('=================================');
  console.log('PRODUCT_CREATED Event Published');
  console.log(JSON.stringify(message, null, 2));
  console.log('=================================');
};

module.exports = {
  publishProductCreated,
};
