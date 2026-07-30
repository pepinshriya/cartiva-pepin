const { mockClient } = require('aws-sdk-client-mock');
const { PublishCommand } = require('@aws-sdk/client-sns');
const snsClient = require('../config/sns');
const { publishPaymentCompleted, publishPaymentFailed } = require('./payment.publisher');

const snsMock = mockClient(snsClient);

describe('payment.publisher', () => {

  beforeEach(() => {
    snsMock.reset();
  });

  describe('publishPaymentCompleted', () => {
    it('should publish a PAYMENT_COMPLETED event with the correct payload', async () => {
      snsMock.on(PublishCommand).resolves({});
      const payment = { orderId: 'o1', paymentId: 'pay1' };

      await publishPaymentCompleted(payment);

      expect(snsMock.commandCalls(PublishCommand).length).toBe(1);

      const publishedMessage = JSON.parse(
        snsMock.commandCalls(PublishCommand)[0].args[0].input.Message
      );

      expect(publishedMessage).toMatchObject({
        eventType: 'PAYMENT_COMPLETED',
        data: {
          orderId: 'o1',
          paymentId: 'pay1',
          paymentStatus: 'SUCCESS',
          timestamp: expect.any(String),
        },
      });
    });
  });

  describe('publishPaymentFailed', () => {
    it('should publish a PAYMENT_FAILED event with the given reason', async () => {
      snsMock.on(PublishCommand).resolves({});
      const payment = { orderId: 'o1', paymentId: 'pay1' };

      await publishPaymentFailed(payment, 'Card declined');

      const publishedMessage = JSON.parse(
        snsMock.commandCalls(PublishCommand)[0].args[0].input.Message
      );

      expect(publishedMessage).toMatchObject({
        eventType: 'PAYMENT_FAILED',
        data: {
          orderId: 'o1',
          paymentId: 'pay1',
          paymentStatus: 'FAILED',
          reason: 'Card declined',
          timestamp: expect.any(String),
        },
      });
    });

    it('should use a default reason when none is provided', async () => {
      snsMock.on(PublishCommand).resolves({});
      const payment = { orderId: 'o1', paymentId: 'pay1' };

      await publishPaymentFailed(payment);

      const publishedMessage = JSON.parse(
        snsMock.commandCalls(PublishCommand)[0].args[0].input.Message
      );

      expect(publishedMessage.data.reason).toBe('Payment processing failed');
    });
  });

});
