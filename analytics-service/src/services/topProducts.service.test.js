const { getTopProducts } = require('./topProducts.service');
const orderRepository = require('../repositories/order.repository');
const productRepository = require('../repositories/product.repository');

jest.mock('../repositories/order.repository');
jest.mock('../repositories/product.repository');

describe('getTopProducts', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should aggregate quantities sold and sort descending', async () => {
    orderRepository.scanAll.mockResolvedValue([
      { items: [{ productId: 'p1', quantity: 3, price: 10 }, { productId: 'p2', quantity: 1, price: 50 }] },
      { items: [{ productId: 'p1', quantity: 2, price: 10 }] },
    ]);
    productRepository.scanAll.mockResolvedValue([
      { productId: 'p1', name: 'Shirt', category: 'Clothing' },
      { productId: 'p2', name: 'Watch', category: 'Accessories' },
    ]);

    const result = await getTopProducts();

    expect(result[0]).toMatchObject({ productId: 'p1', name: 'Shirt', sold: 5, revenue: 50 });
    expect(result[1]).toMatchObject({ productId: 'p2', name: 'Watch', sold: 1, revenue: 50 });
  });

  it('should return at most 10 products', async () => {
    const items = Array.from({ length: 15 }, (_, i) => ({ productId: `p${i}`, quantity: 1, price: 10 }));
    orderRepository.scanAll.mockResolvedValue([{ items }]);
    productRepository.scanAll.mockResolvedValue([]);

    const result = await getTopProducts();

    expect(result.length).toBe(10);
  });

  it('should return an empty array when there are no orders', async () => {
    orderRepository.scanAll.mockResolvedValue([]);
    productRepository.scanAll.mockResolvedValue([]);

    const result = await getTopProducts();

    expect(result).toEqual([]);
  });
});
