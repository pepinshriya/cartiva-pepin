const serverless = require('serverless-http');
const app = require('./app');

const paymentSubscriber = require('./events/payment.subscriber');

const apiHandler = serverless(app);

module.exports.handler = async (event, context) => {
  try {
    // Handle SNS Events
    if (event.Records && event.Records.length > 0 && event.Records[0].EventSource === 'aws:sns') {
      for (const record of event.Records) {
        const paymentEvent = JSON.parse(record.Sns.Message);

        console.log('Received Payment Event:', paymentEvent);

        if (
          paymentEvent.eventType === 'PAYMENT_COMPLETED' ||
          paymentEvent.eventType === 'PAYMENT_FAILED'
        ) {
          await paymentSubscriber.handler({
            Records: [record],
          });

          console.log(`Payment event processed: ${paymentEvent.eventType}`);
        }
      }

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'SNS events processed successfully',
        }),
      };
    }

    // Handle API Gateway Requests
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
