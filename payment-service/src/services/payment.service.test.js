const paymentService = require('./payment.service');
const paymentRepository = require('../repositories/payment.repository');

jest.mock('../repositories/payment.repository');
jest.mock('uuid', () => ({ v4: () => 'fixed-payment-id' }));

describe('createPayment', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a payment with valid data', async () => {
    paymentRepository.create.mockImplementation(async (payment) => payment);

    const result = await paymentService.createPayment({
      orderId: 'o1',
      userId: 'user1',
      amount: 200,
      paymentMethod: 'CREDIT_CARD',
    });

    expect(result).toMatchObject({
      paymentId: 'fixed-payment-id',
      orderId: 'o1',
      userId: 'user1',
      amount: 200,
      paymentMethod: 'CREDIT_CARD',
      status: 'PENDING',
    });
  });

  it('should throw 400 when a required field is missing', async () => {
    await expect(
      paymentService.createPayment({ orderId: 'o1', userId: 'user1', amount: 200 })
    ).rejects.toMatchObject({ statusCode: 400 });

    expect(paymentRepository.create).not.toHaveBeenCalled();
  });

  it('should throw 400 when paymentMethod is invalid', async () => {
    await expect(
      paymentService.createPayment({ orderId: 'o1', userId: 'user1', amount: 200, paymentMethod: 'CASH' })
    ).rejects.toMatchObject({ statusCode: 400 });
  });

  it('should throw 400 when amount is not positive', async () => {
    await expect(
      paymentService.createPayment({ orderId: 'o1', userId: 'user1', amount: -50, paymentMethod: 'CREDIT_CARD' })
    ).rejects.toMatchObject({ statusCode: 400 });
  });
});

describe('getPayment', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the payment when found', async () => {
    const fakePayment = { paymentId: 'pay1', orderId: 'o1' };
    paymentRepository.findById.mockResolvedValue(fakePayment);

    const result = await paymentService.getPayment('pay1');

    expect(result).toEqual(fakePayment);
  });

  it('should throw 404 when not found', async () => {
    paymentRepository.findById.mockResolvedValue(null);

    await expect(paymentService.getPayment('pay1')).rejects.toMatchObject({
      statusCode: 404,
    });
  });
});

describe('getPaymentByOrder', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the payment for a given order', async () => {
    const fakePayment = { paymentId: 'pay1', orderId: 'o1' };
    paymentRepository.findByOrderId.mockResolvedValue(fakePayment);

    const result = await paymentService.getPaymentByOrder('o1');

    expect(result).toEqual(fakePayment);
    expect(paymentRepository.findByOrderId).toHaveBeenCalledWith('o1');
  });
});

describe('updatePaymentStatus', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update status when payment exists and status is valid', async () => {
    paymentRepository.findById.mockResolvedValue({ paymentId: 'pay1', status: 'PENDING' });
    paymentRepository.update.mockResolvedValue({ paymentId: 'pay1', status: 'SUCCESS' });

    const result = await paymentService.updatePaymentStatus('pay1', 'SUCCESS');

    expect(result).toEqual({ paymentId: 'pay1', status: 'SUCCESS' });
    expect(paymentRepository.update).toHaveBeenCalledWith('pay1', { status: 'SUCCESS' });
  });

  it('should throw 400 when status is invalid', async () => {
    await expect(
      paymentService.updatePaymentStatus('pay1', 'NOT_A_REAL_STATUS')
    ).rejects.toMatchObject({ statusCode: 400 });
  });

  it('should throw 404 when payment does not exist', async () => {
    paymentRepository.findById.mockResolvedValue(null);

    await expect(paymentService.updatePaymentStatus('pay1', 'SUCCESS')).rejects.toMatchObject({
      statusCode: 404,
    });
  });
});

describe('createPaymentFromOrder', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a payment with UNKNOWN method and no validation', async () => {
    paymentRepository.create.mockImplementation(async (payment) => payment);

    const result = await paymentService.createPaymentFromOrder({
      orderId: 'o1',
      userId: 'user1',
      amount: 150,
    });

    expect(result).toMatchObject({
      paymentId: 'fixed-payment-id',
      orderId: 'o1',
      userId: 'user1',
      amount: 150,
      paymentMethod: 'UNKNOWN',
      status: 'PENDING',
    });
  });
});
