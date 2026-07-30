const { handler } = require('./payment.subscriber');
const orderService = require('../services/order.service');

jest.mock('../services/order.service');

const buildSnsEvent = (messages) => ({
  Records: messages.map((msg) => ({
    Sns: { Message: JSON.stringify(msg) },
  })),
});

describe('payment.subscriber handler', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update order to CONFIRMED/PAID on PAYMENT_COMPLETED', async () => {
    const event = buildSnsEvent([
      { eventType: 'PAYMENT_COMPLETED', data: { orderId: 'o1', paymentId: 'pay1', paymentStatus: 'PAID', timestamp: 'now' } },
    ]);
    orderService.updateOrderPaymentStatus.mockResolvedValue({});

    const result = await handler(event);

    expect(orderService.updateOrderPaymentStatus).toHaveBeenCalledWith('o1', {
      paymentStatus: 'PAID',
      status: 'CONFIRMED',
    });
    expect(result).toEqual({ statusCode: 200 });
  });

  it('should update order to PAYMENT_FAILED/FAILED on PAYMENT_FAILED', async () => {
    const event = buildSnsEvent([
      { eventType: 'PAYMENT_FAILED', data: { orderId: 'o2', paymentId: 'pay2', reason: 'card declined' } },
    ]);
    orderService.updateOrderPaymentStatus.mockResolvedValue({});

    const result = await handler(event);

    expect(orderService.updateOrderPaymentStatus).toHaveBeenCalledWith('o2', {
      paymentStatus: 'FAILED',
      status: 'PAYMENT_FAILED',
    });
    expect(result).toEqual({ statusCode: 200 });
  });

  it('should process multiple records in one event', async () => {
    const event = buildSnsEvent([
      { eventType: 'PAYMENT_COMPLETED', data: { orderId: 'o1' } },
      { eventType: 'PAYMENT_FAILED', data: { orderId: 'o2' } },
    ]);
    orderService.updateOrderPaymentStatus.mockResolvedValue({});

    await handler(event);

    expect(orderService.updateOrderPaymentStatus).toHaveBeenCalledTimes(2);
  });

  it('should do nothing for an unknown event type', async () => {
    const event = buildSnsEvent([
      { eventType: 'SOMETHING_ELSE', data: { orderId: 'o1' } },
    ]);

    const result = await handler(event);

    expect(orderService.updateOrderPaymentStatus).not.toHaveBeenCalled();
    expect(result).toEqual({ statusCode: 200 });
  });

});
