const orderService = require('./order.service');
const orderRepository = require('../repositories/order.repository');
const cartClient = require('../clients/cart.client');
const inventoryClient = require('../clients/inventory.client');
const orderPublisher = require('../events/order.publisher');

jest.mock('../repositories/order.repository');
jest.mock('../clients/cart.client');
jest.mock('../clients/inventory.client');
jest.mock('../events/order.publisher');
jest.mock('uuid', () => ({ v4: () => 'fixed-order-id' }));

describe('placeOrder', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create an order from a non-empty cart and publish an event', async () => {
    cartClient.getCartByUserId.mockResolvedValue({
      items: [{ productId: 'p1', quantity: 2, price: 100 }],
      totalPrice: 200,
    });
    inventoryClient.getStock.mockResolvedValue({ currentStock: 10 });
    inventoryClient.reduceStock.mockResolvedValue({});
    orderRepository.create.mockImplementation(async (order) => order);
    orderPublisher.publishOrderCreated.mockResolvedValue({});

    const result = await orderService.placeOrder({ userId: 'user1' });

    expect(result).toMatchObject({
      orderId: 'fixed-order-id',
      userId: 'user1',
      totalAmount: 200,
      status: 'PENDING',
    });
    expect(orderRepository.create).toHaveBeenCalled();
    expect(orderPublisher.publishOrderCreated).toHaveBeenCalledWith(result);
  });

  it('should throw 400 when the cart is empty', async () => {
    cartClient.getCartByUserId.mockResolvedValue({ items: [] });

    await expect(orderService.placeOrder({ userId: 'user1' })).rejects.toMatchObject({
      statusCode: 400,
      message: 'Cart is empty',
    });

    expect(orderRepository.create).not.toHaveBeenCalled();
    expect(orderPublisher.publishOrderCreated).not.toHaveBeenCalled();
  });
});

describe('getOrder', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the order when it exists', async () => {
    const fakeOrder = { orderId: 'o1', userId: 'user1', status: 'PENDING' };
    orderRepository.findById.mockResolvedValue(fakeOrder);

    const result = await orderService.getOrder('o1');

    expect(result).toEqual(fakeOrder);
  });

  it('should throw 404 when the order does not exist', async () => {
    orderRepository.findById.mockResolvedValue(null);

    await expect(orderService.getOrder('o1')).rejects.toMatchObject({
      statusCode: 404,
    });
  });
});

describe('getUserOrders', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return orders for the given user', async () => {
    const fakeOrders = [{ orderId: 'o1', userId: 'user1' }];
    orderRepository.findByUserId.mockResolvedValue(fakeOrders);

    const result = await orderService.getUserOrders('user1');

    expect(result).toEqual(fakeOrders);
    expect(orderRepository.findByUserId).toHaveBeenCalledWith('user1');
  });
});

describe('getAllOrders', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return all orders', async () => {
    const fakeOrders = [{ orderId: 'o1' }, { orderId: 'o2' }];
    orderRepository.findAll.mockResolvedValue(fakeOrders);

    const result = await orderService.getAllOrders();

    expect(result).toEqual(fakeOrders);
  });
});

describe('cancelOrder', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should cancel a non-cancelled order', async () => {
    orderRepository.findById.mockResolvedValue({ orderId: 'o1', status: 'PENDING' });
    orderRepository.update.mockResolvedValue({ orderId: 'o1', status: 'CANCELLED' });
    orderRepository.appendTimeline.mockResolvedValue({});

    const result = await orderService.cancelOrder('o1');

    expect(result).toEqual({ orderId: 'o1', status: 'CANCELLED' });
    expect(orderRepository.update).toHaveBeenCalledWith('o1', { status: 'CANCELLED' });
    expect(orderRepository.appendTimeline).toHaveBeenCalled();
  });

  it('should throw 404 when the order does not exist', async () => {
    orderRepository.findById.mockResolvedValue(null);

    await expect(orderService.cancelOrder('o1')).rejects.toMatchObject({
      statusCode: 404,
    });
  });

  it('should throw 400 when the order is already cancelled', async () => {
    orderRepository.findById.mockResolvedValue({ orderId: 'o1', status: 'CANCELLED' });

    await expect(orderService.cancelOrder('o1')).rejects.toMatchObject({
      statusCode: 400,
    });
  });
});

describe('updateOrderPaymentStatus', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update payment status when order exists', async () => {
    orderRepository.findById.mockResolvedValue({ orderId: 'o1' });
    orderRepository.update.mockResolvedValue({ orderId: 'o1', paymentStatus: 'PAID' });

    const result = await orderService.updateOrderPaymentStatus('o1', { paymentStatus: 'PAID' });

    expect(result).toEqual({ orderId: 'o1', paymentStatus: 'PAID' });
  });

  it('should throw 404 when the order does not exist', async () => {
    orderRepository.findById.mockResolvedValue(null);

    await expect(
      orderService.updateOrderPaymentStatus('o1', { paymentStatus: 'PAID' })
    ).rejects.toMatchObject({ statusCode: 404 });
  });
});

describe('updateOrderStatus', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update status when valid and order exists', async () => {
    orderRepository.findById.mockResolvedValue({ orderId: 'o1', status: 'PENDING' });
    orderRepository.update.mockResolvedValue({ orderId: 'o1', status: 'SHIPPED' });
    orderRepository.appendTimeline.mockResolvedValue({});

    const result = await orderService.updateOrderStatus('o1', 'SHIPPED', 'On the way');

    expect(result).toEqual({ orderId: 'o1', status: 'SHIPPED' });
    expect(orderRepository.appendTimeline).toHaveBeenCalled();
  });

  it('should throw 400 when status is missing', async () => {
    await expect(orderService.updateOrderStatus('o1', undefined, 'note')).rejects.toMatchObject({
      statusCode: 400,
    });
  });

  it('should throw 400 when status is invalid', async () => {
    await expect(
      orderService.updateOrderStatus('o1', 'NOT_A_REAL_STATUS', 'note')
    ).rejects.toMatchObject({
      statusCode: 400,
    });
  });

  it('should throw 404 when the order does not exist', async () => {
    orderRepository.findById.mockResolvedValue(null);

    await expect(orderService.updateOrderStatus('o1', 'SHIPPED', 'note')).rejects.toMatchObject({
      statusCode: 404,
    });
  });
});

describe('getOrderTimeline', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the status history when order exists', async () => {
    const history = [{ status: 'PENDING', note: 'Order placed' }];
    orderRepository.findById.mockResolvedValue({ orderId: 'o1', statusHistory: history });

    const result = await orderService.getOrderTimeline('o1');

    expect(result).toEqual(history);
  });

  it('should throw 404 when the order does not exist', async () => {
    orderRepository.findById.mockResolvedValue(null);

    await expect(orderService.getOrderTimeline('o1')).rejects.toMatchObject({
      statusCode: 404,
    });
  });
});
