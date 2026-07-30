const productService = require('./product.service');
const productRepository = require('../repositories/product.repository');

jest.mock('../repositories/product.repository');
jest.mock('uuid', () => ({ v4: () => 'fixed-product-id' }));

describe('createProduct', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a product with valid data', async () => {
    productRepository.create.mockImplementation(async (product) => product);

    const result = await productService.createProduct({
      name: 'Shirt',
      description: 'Cotton shirt',
      category: 'Clothing',
      price: 100,
    });

    expect(result).toMatchObject({
      productId: 'fixed-product-id',
      name: 'Shirt',
      description: 'Cotton shirt',
      category: 'Clothing',
      price: 100,
      imageUrl: '',
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });
});

describe('getProduct', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the product when found', async () => {
    const fakeProduct = { productId: 'p1', name: 'Shirt' };
    productRepository.findById.mockResolvedValue(fakeProduct);

    const result = await productService.getProduct('p1');

    expect(result).toEqual(fakeProduct);
  });

  it('should throw 404 when not found', async () => {
    productRepository.findById.mockResolvedValue(null);

    await expect(productService.getProduct('p1')).rejects.toMatchObject({
      statusCode: 404,
    });
  });
});

describe('getAllProducts', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return all products', async () => {
    const fakeProducts = [{ productId: 'p1' }, { productId: 'p2' }];
    productRepository.findAll.mockResolvedValue(fakeProducts);

    const result = await productService.getAllProducts();

    expect(result).toEqual(fakeProducts);
  });
});

describe('updateProduct', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update the product when it exists', async () => {
    productRepository.findById.mockResolvedValue({ productId: 'p1', name: 'Old Name' });
    productRepository.update.mockResolvedValue({ productId: 'p1', name: 'New Name' });

    const result = await productService.updateProduct('p1', { name: 'New Name' });

    expect(result).toEqual({ productId: 'p1', name: 'New Name' });
    expect(productRepository.update).toHaveBeenCalledWith('p1', {
      name: 'New Name',
      updatedAt: expect.any(String),
    });
  });

  it('should throw 404 when product does not exist', async () => {
    productRepository.findById.mockResolvedValue(null);

    await expect(productService.updateProduct('p1', { name: 'New Name' })).rejects.toMatchObject({
      statusCode: 404,
    });
  });
});

describe('deleteProduct', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delete the product when it exists', async () => {
    productRepository.findById.mockResolvedValue({ productId: 'p1' });
    productRepository.remove.mockResolvedValue({ success: true });

    const result = await productService.deleteProduct('p1');

    expect(result).toEqual({ success: true });
    expect(productRepository.remove).toHaveBeenCalledWith('p1');
  });

  it('should throw 404 when product does not exist', async () => {
    productRepository.findById.mockResolvedValue(null);

    await expect(productService.deleteProduct('p1')).rejects.toMatchObject({
      statusCode: 404,
    });
  });
});
