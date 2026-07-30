const { getDashboard } = require('./dashboard.service');
const orderRepository = require('../repositories/order.repository');
const productRepository = require('../repositories/product.repository');
const inventoryRepository = require('../repositories/inventory.repository');

jest.mock('../repositories/order.repository');
jest.mock('../repositories/product.repository');
jest.mock('../repositories/inventory.repository');

describe('getDashboard', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should aggregate revenue, orders, customers, and low stock correctly', async () => {
    orderRepository.scanAll.mockResolvedValue([
      { totalAmount: 100, status: 'PENDING', userId: 'u1' },
      { totalAmount: 200, status: 'CONFIRMED', userId: 'u2' },
      { totalAmount: 50, status: 'PENDING', userId: 'u1' },
    ]);
    productRepository.scanAll.mockResolvedValue([{ productId: 'p1' }, { productId: 'p2' }]);
    inventoryRepository.scanAll.mockResolvedValue([
      { currentStock: 2, threshold: 5 },
      { currentStock: 10, threshold: 5 },
    ]);

    const result = await getDashboard();

    expect(result).toEqual({
      revenue: 350,
      orders: 3,
      pendingOrders: 2,
      products: 2,
      customers: 2,
      lowStock: 1,
    });
  });

  it('should handle empty data without crashing', async () => {
    orderRepository.scanAll.mockResolvedValue([]);
    productRepository.scanAll.mockResolvedValue([]);
    inventoryRepository.scanAll.mockResolvedValue([]);

    const result = await getDashboard();

    expect(result).toEqual({
      revenue: 0,
      orders: 0,
      pendingOrders: 0,
      products: 0,
      customers: 0,
      lowStock: 0,
    });
  });
});
