const serverless = require('serverless-http');
const app = require('./app');
const orderSubscriber = require('./events/order.subscriber');

const apiHandler = serverless(app);

module.exports.handler = async (event, context) => {
  try {
    if (event.Records && event.Records.length > 0 && event.Records[0].EventSource === 'aws:sns') {
      return await orderSubscriber.handler(event);
    }
    return await apiHandler(event, context);
  } catch (error) {
    console.error('Lambda Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Internal Server Error',
        error: error.message,
      }),
    };
  }
};
