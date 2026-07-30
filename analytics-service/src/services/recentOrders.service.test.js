const { getRecentOrders } = require('./recentOrders.service');
const orderRepository = require('../repositories/order.repository');

jest.mock('../repositories/order.repository');

describe('getRecentOrders', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the 5 most recent orders, sorted descending by date', async () => {
    orderRepository.scanAll.mockResolvedValue([
      { orderId: 'o1', createdAt: '2024-01-01T00:00:00.000Z', totalAmount: 100, items: [{}] },
      { orderId: 'o2', createdAt: '2024-01-05T00:00:00.000Z', totalAmount: 200, items: [{}, {}] },
      { orderId: 'o3', createdAt: '2024-01-03T00:00:00.000Z', totalAmount: 150, items: [] },
    ]);

    const result = await getRecentOrders();

    expect(result.map((o) => o.orderId)).toEqual(['o2', 'o3', 'o1']);
    expect(result[0]).toMatchObject({
      orderId: 'o2',
      totalAmount: 200,
      items: 2,
    });
  });

  it('should return at most 5 orders even if more exist', async () => {
    const orders = Array.from({ length: 8 }, (_, i) => ({
      orderId: `o${i}`,
      createdAt: `2024-01-0${i + 1}T00:00:00.000Z`,
      totalAmount: 10,
      items: [],
    }));
    orderRepository.scanAll.mockResolvedValue(orders);

    const result = await getRecentOrders();

    expect(result.length).toBe(5);
  });
});
