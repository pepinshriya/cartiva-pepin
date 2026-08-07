const inventoryService = require('./inventory.service');
const inventoryRepository = require('../repositories/inventory.repository');

jest.mock('../repositories/inventory.repository');

describe('addStock', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new stock entry when none exists', async () => {
    inventoryRepository.findByProductId.mockResolvedValue(null);
    inventoryRepository.create.mockImplementation(async (item) => item);

    const result = await inventoryService.addStock({ productId: 'p1', currentStock: 50 });

    expect(result).toMatchObject({
      productId: 'p1',
      currentStock: 50,
      updatedAt: expect.any(String),
    });
  });

  it('should throw 409 when stock already exists for the product', async () => {
    inventoryRepository.findByProductId.mockResolvedValue({ productId: 'p1', currentStock: 10 });

    await expect(
      inventoryService.addStock({ productId: 'p1', currentStock: 50 })
    ).rejects.toMatchObject({ statusCode: 409 });
  });
});

describe('getStock', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the stock when found', async () => {
    const fakeStock = { productId: 'p1', currentStock: 20 };
    inventoryRepository.findByProductId.mockResolvedValue(fakeStock);

    const result = await inventoryService.getStock('p1');

    expect(result).toEqual(fakeStock);
  });

  it('should throw 404 when not found', async () => {
    inventoryRepository.findByProductId.mockResolvedValue(null);

    await expect(inventoryService.getStock('p1')).rejects.toMatchObject({
      statusCode: 404,
    });
  });
});

describe('updateStock', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update the currentStock when stock exists', async () => {
    inventoryRepository.findByProductId.mockResolvedValue({ productId: 'p1', currentStock: 10 });
    inventoryRepository.update.mockResolvedValue({ productId: 'p1', currentStock: 99 });

    const result = await inventoryService.updateStock('p1', { currentStock: 99 });

    expect(result).toEqual({ productId: 'p1', currentStock: 99 });
    expect(inventoryRepository.update).toHaveBeenCalledWith('p1', {
      currentStock: 99,
      status: 'IN_STOCK',
      updatedAt: expect.any(String),
    });
  });

  it('should throw 404 when stock does not exist', async () => {
    inventoryRepository.findByProductId.mockResolvedValue(null);

    await expect(inventoryService.updateStock('p1', { currentStock: 99 })).rejects.toMatchObject({
      statusCode: 404,
    });
  });
});

describe('reduceStock', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should reduce currentStock when there is enough stock', async () => {
    inventoryRepository.findByProductId.mockResolvedValue({ productId: 'p1', currentStock: 50 });
    inventoryRepository.update.mockResolvedValue({ productId: 'p1', currentStock: 30 });

    const result = await inventoryService.reduceStock('p1', { currentStock: 20 });

    expect(result).toEqual({ productId: 'p1', currentStock: 30 });
    expect(inventoryRepository.update).toHaveBeenCalledWith('p1', {
      currentStock: 30,
      status: 'IN_STOCK',
      updatedAt: expect.any(String),
    });
  });

  it('should throw 400 when reducing more than available stock', async () => {
    inventoryRepository.findByProductId.mockResolvedValue({ productId: 'p1', currentStock: 5 });

    await expect(inventoryService.reduceStock('p1', { currentStock: 20 })).rejects.toMatchObject({
      statusCode: 400,
      message: 'Insufficient stock',
    });

    expect(inventoryRepository.update).not.toHaveBeenCalled();
  });

  it('should throw 404 when stock does not exist', async () => {
    inventoryRepository.findByProductId.mockResolvedValue(null);

    await expect(inventoryService.reduceStock('p1', { currentStock: 20 })).rejects.toMatchObject({
      statusCode: 404,
    });
  });
});

describe('increaseStock', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should increase currentStock when stock exists', async () => {
    inventoryRepository.findByProductId.mockResolvedValue({ productId: 'p1', currentStock: 10 });
    inventoryRepository.update.mockResolvedValue({ productId: 'p1', currentStock: 40 });

    const result = await inventoryService.increaseStock('p1', { currentStock: 30 });

    expect(result).toEqual({ productId: 'p1', currentStock: 40 });
    expect(inventoryRepository.update).toHaveBeenCalledWith('p1', {
      currentStock: 40,
      status: 'IN_STOCK',
      updatedAt: expect.any(String),
    });
  });

  it('should throw 404 when stock does not exist', async () => {
    inventoryRepository.findByProductId.mockResolvedValue(null);

    await expect(inventoryService.increaseStock('p1', { currentStock: 30 })).rejects.toMatchObject({
      statusCode: 404,
    });
  });
});

describe('getAllInventory', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return all inventory items', async () => {
    const fakeItems = [
      { productId: 'p1', currentStock: 10 },
      { productId: 'p2', currentStock: 20 },
    ];
    inventoryRepository.findAll.mockResolvedValue(fakeItems);

    const result = await inventoryService.getAllInventory();

    expect(result).toEqual(fakeItems);
  });
});
