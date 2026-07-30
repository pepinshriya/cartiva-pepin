const cartService = require('./cart.service');
const cartRepository = require('../repositories/cart.repository');
const productClient = require('../clients/product.client');

jest.mock('../repositories/cart.repository');
jest.mock('../clients/product.client');

describe('createCart', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new cart when none exists', async () => {
    cartRepository.findByUserId.mockResolvedValue(null);
    cartRepository.create.mockResolvedValue({ userId: 'user1', items: [], totalPrice: 0 });

    const result = await cartService.createCart({ userId: 'user1' });

    expect(result).toEqual({ userId: 'user1', items: [], totalPrice: 0 });
    expect(cartRepository.create).toHaveBeenCalledWith({ userId: 'user1', items: [], totalPrice: 0 });
  });

  it('should throw 409 when a cart already exists for the user', async () => {
    cartRepository.findByUserId.mockResolvedValue({ userId: 'user1', items: [] });

    await expect(cartService.createCart({ userId: 'user1' })).rejects.toMatchObject({
      statusCode: 409,
    });
  });

});

describe('getCart', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the cart when it exists', async () => {
    const fakeCart = { userId: 'user1', items: [], totalPrice: 0 };
    cartRepository.findByUserId.mockResolvedValue(fakeCart);

    const result = await cartService.getCart('user1');

    expect(result).toEqual(fakeCart);
  });

  it('should throw 404 when the cart does not exist', async () => {
    cartRepository.findByUserId.mockResolvedValue(null);

    await expect(cartService.getCart('user1')).rejects.toMatchObject({
      statusCode: 404,
    });
  });

});

describe('addItem', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add a new item to the cart', async () => {
    const existingCart = { userId: 'user1', items: [], totalPrice: 0 };
    cartRepository.findByUserId.mockResolvedValue(existingCart);
    productClient.getProductById.mockResolvedValue({ productId: 'p1', name: 'Shirt', price: 100 });
    cartRepository.update.mockResolvedValue({
      userId: 'user1',
      items: [{ productId: 'p1', name: 'Shirt', price: 100, quantity: 2 }],
      totalPrice: 200,
    });

    const result = await cartService.addItem('user1', { productId: 'p1', quantity: 2 });

    expect(productClient.getProductById).toHaveBeenCalledWith('p1');
    expect(cartRepository.update).toHaveBeenCalledWith('user1', {
      items: [{ productId: 'p1', name: 'Shirt', price: 100, quantity: 2 }],
      totalPrice: 200,
    });
    expect(result.totalPrice).toBe(200);
  });

  it('should increase quantity when item already exists in cart', async () => {
    const existingCart = {
      userId: 'user1',
      items: [{ productId: 'p1', name: 'Shirt', price: 100, quantity: 1 }],
      totalPrice: 100,
    };
    cartRepository.findByUserId.mockResolvedValue(existingCart);
    productClient.getProductById.mockResolvedValue({ productId: 'p1', name: 'Shirt', price: 100 });
    cartRepository.update.mockResolvedValue({
      userId: 'user1',
      items: [{ productId: 'p1', name: 'Shirt', price: 100, quantity: 3 }],
      totalPrice: 300,
    });

    await cartService.addItem('user1', { productId: 'p1', quantity: 2 });

    expect(cartRepository.update).toHaveBeenCalledWith('user1', {
      items: [{ productId: 'p1', name: 'Shirt', price: 100, quantity: 3 }],
      totalPrice: 300,
    });
  });

  it('should throw 404 when cart does not exist', async () => {
    cartRepository.findByUserId.mockResolvedValue(null);

    await expect(
      cartService.addItem('user1', { productId: 'p1', quantity: 1 })
    ).rejects.toMatchObject({ statusCode: 404 });
  });

});

describe('removeItem', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should remove an existing item from the cart', async () => {
    const existingCart = {
      userId: 'user1',
      items: [{ productId: 'p1', name: 'Shirt', price: 100, quantity: 2 }],
      totalPrice: 200,
    };
    cartRepository.findByUserId.mockResolvedValue(existingCart);
    cartRepository.update.mockResolvedValue({ userId: 'user1', items: [], totalPrice: 0 });

    const result = await cartService.removeItem('user1', 'p1');

    expect(cartRepository.update).toHaveBeenCalledWith('user1', { items: [], totalPrice: 0 });
    expect(result.totalPrice).toBe(0);
  });

  it('should throw 404 when cart does not exist', async () => {
    cartRepository.findByUserId.mockResolvedValue(null);

    await expect(cartService.removeItem('user1', 'p1')).rejects.toMatchObject({
      statusCode: 404,
    });
  });

  it('should throw 404 when item is not in the cart', async () => {
    cartRepository.findByUserId.mockResolvedValue({ userId: 'user1', items: [], totalPrice: 0 });

    await expect(cartService.removeItem('user1', 'p1')).rejects.toMatchObject({
      statusCode: 404,
    });
  });

});

describe('updateItemQuantity', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update the quantity of an existing item', async () => {
    const existingCart = {
      userId: 'user1',
      items: [{ productId: 'p1', name: 'Shirt', price: 100, quantity: 1 }],
      totalPrice: 100,
    };
    cartRepository.findByUserId.mockResolvedValue(existingCart);
    cartRepository.update.mockResolvedValue({
      userId: 'user1',
      items: [{ productId: 'p1', name: 'Shirt', price: 100, quantity: 5 }],
      totalPrice: 500,
    });

    const result = await cartService.updateItemQuantity('user1', 'p1', { quantity: 5 });

    expect(cartRepository.update).toHaveBeenCalledWith('user1', {
      items: [{ productId: 'p1', name: 'Shirt', price: 100, quantity: 5 }],
      totalPrice: 500,
    });
    expect(result.totalPrice).toBe(500);
  });

  it('should throw 404 when cart does not exist', async () => {
    cartRepository.findByUserId.mockResolvedValue(null);

    await expect(
      cartService.updateItemQuantity('user1', 'p1', { quantity: 5 })
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  it('should throw 404 when item is not in the cart', async () => {
    cartRepository.findByUserId.mockResolvedValue({ userId: 'user1', items: [], totalPrice: 0 });

    await expect(
      cartService.updateItemQuantity('user1', 'p1', { quantity: 5 })
    ).rejects.toMatchObject({ statusCode: 404 });
  });

});

describe('clearCart', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should clear the cart when it exists', async () => {
    cartRepository.findByUserId.mockResolvedValue({ userId: 'user1', items: [], totalPrice: 0 });
    cartRepository.remove.mockResolvedValue({ success: true });

    const result = await cartService.clearCart('user1');

    expect(cartRepository.remove).toHaveBeenCalledWith('user1');
    expect(result).toEqual({ success: true });
  });

  it('should throw 404 when cart does not exist', async () => {
    cartRepository.findByUserId.mockResolvedValue(null);

    await expect(cartService.clearCart('user1')).rejects.toMatchObject({
      statusCode: 404,
    });
  });

});
