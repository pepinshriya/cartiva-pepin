const { handler } = require('./order.subscriber');
const paymentService = require('../services/payment.service');
const paymentPublisher = require('../events/payment.publisher');

jest.mock('../services/payment.service');
jest.mock('../events/payment.publisher');

const buildSnsEvent = (messages) => ({
  Records: messages.map((msg) => ({
    Sns: { Message: JSON.stringify(msg) },
  })),
});

describe('order.subscriber handler', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a payment and publish PAYMENT_COMPLETED on ORDER_CREATED', async () => {
    const event = buildSnsEvent([
      { eventType: 'ORDER_CREATED', data: { orderId: 'o1', userId: 'user1', amount: 200 } },
    ]);
    const fakePayment = { paymentId: 'pay1', orderId: 'o1', userId: 'user1', amount: 200 };
    paymentService.createPayment.mockResolvedValue(fakePayment);
    paymentPublisher.publishPaymentCompleted.mockResolvedValue({});

    const result = await handler(event);

    expect(paymentService.createPayment).toHaveBeenCalledWith({
      orderId: 'o1',
      userId: 'user1',
      amount: 200,
      paymentMethod: 'CREDIT_CARD',
    });
    expect(paymentPublisher.publishPaymentCompleted).toHaveBeenCalledWith(fakePayment);
    expect(result).toEqual({ statusCode: 200 });
  });

  it('should do nothing for an unknown event type', async () => {
    const event = buildSnsEvent([{ eventType: 'SOMETHING_ELSE', data: { orderId: 'o1' } }]);

    const result = await handler(event);

    expect(paymentService.createPayment).not.toHaveBeenCalled();
    expect(paymentPublisher.publishPaymentCompleted).not.toHaveBeenCalled();
    expect(result).toEqual({ statusCode: 200 });
  });

  it('should process multiple ORDER_CREATED records in one event', async () => {
    const event = buildSnsEvent([
      { eventType: 'ORDER_CREATED', data: { orderId: 'o1', userId: 'user1', amount: 100 } },
      { eventType: 'ORDER_CREATED', data: { orderId: 'o2', userId: 'user2', amount: 300 } },
    ]);
    paymentService.createPayment.mockResolvedValue({ paymentId: 'pay1' });
    paymentPublisher.publishPaymentCompleted.mockResolvedValue({});

    await handler(event);

    expect(paymentService.createPayment).toHaveBeenCalledTimes(2);
    expect(paymentPublisher.publishPaymentCompleted).toHaveBeenCalledTimes(2);
  });
});
