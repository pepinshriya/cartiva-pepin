const { getDailyRevenue } = require('./revenue.service');
const orderRepository = require('../repositories/order.repository');

jest.mock('../repositories/order.repository');

const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

describe('getDailyRevenue', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should group revenue by day for orders within the last 30 days', async () => {
    orderRepository.scanAll.mockResolvedValue([
      { createdAt: daysAgo(1), totalAmount: 100 },
      { createdAt: daysAgo(1), totalAmount: 50 },
      { createdAt: daysAgo(5), totalAmount: 200 },
    ]);

    const result = await getDailyRevenue();

    expect(result.length).toBe(2);
    const dayOneEntry = result.find((r) => r.date === daysAgo(1).slice(0, 10));
    expect(dayOneEntry).toMatchObject({ revenue: 150, orders: 2 });
  });

  it('should exclude orders older than 30 days', async () => {
    orderRepository.scanAll.mockResolvedValue([
      { createdAt: daysAgo(45), totalAmount: 500 },
    ]);

    const result = await getDailyRevenue();

    expect(result).toEqual([]);
  });

  it('should skip orders with no createdAt', async () => {
    orderRepository.scanAll.mockResolvedValue([
      { totalAmount: 100 },
    ]);

    const result = await getDailyRevenue();

    expect(result).toEqual([]);
  });
});
