const { mockClient } = require('aws-sdk-client-mock');
const { PublishCommand } = require('@aws-sdk/client-sns');
const snsClient = require('../config/sns');
const { publishOrderCreated } = require('./order.publisher');

const snsMock = mockClient(snsClient);

describe('publishOrderCreated', () => {

  beforeEach(() => {
    snsMock.reset();
  });

  it('should publish an ORDER_CREATED event with the correct payload', async () => {
    snsMock.on(PublishCommand).resolves({});
    const order = {
      orderId: 'o1',
      userId: 'user1',
      totalAmount: 200,
      items: [{ productId: 'p1', quantity: 2 }],
    };

    await publishOrderCreated(order);

    expect(snsMock.commandCalls(PublishCommand).length).toBe(1);

    const publishedMessage = JSON.parse(
      snsMock.commandCalls(PublishCommand)[0].args[0].input.Message
    );

    expect(publishedMessage).toEqual({
      eventType: 'ORDER_CREATED',
      data: {
        orderId: 'o1',
        userId: 'user1',
        amount: 200,
        items: [{ productId: 'p1', quantity: 2 }],
      },
    });
  });

});
