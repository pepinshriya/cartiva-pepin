const { getLowStock } = require('./lowStock.service');
const inventoryRepository = require('../repositories/inventory.repository');
const productRepository = require('../repositories/product.repository');

jest.mock('../repositories/inventory.repository');
jest.mock('../repositories/product.repository');

describe('getLowStock', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return only items at or below threshold, enriched and sorted ascending', async () => {
    inventoryRepository.scanAll.mockResolvedValue([
      { productId: 'p1', currentStock: 3, threshold: 5 },
      { productId: 'p2', currentStock: 20, threshold: 5 },
      { productId: 'p3', currentStock: 1, threshold: 5 },
    ]);
    productRepository.scanAll.mockResolvedValue([
      { productId: 'p1', name: 'Shirt', category: 'Clothing' },
      { productId: 'p3', name: 'Hat', category: 'Accessories' },
    ]);

    const result = await getLowStock();

    expect(result).toEqual([
      {
        productId: 'p3',
        name: 'Hat',
        category: 'Accessories',
        currentStock: 1,
        threshold: 5,
        lastUpdated: null,
      },
      {
        productId: 'p1',
        name: 'Shirt',
        category: 'Clothing',
        currentStock: 3,
        threshold: 5,
        lastUpdated: null,
      },
    ]);
  });

  it('should default to "Unknown Product" when no matching product exists', async () => {
    inventoryRepository.scanAll.mockResolvedValue([
      { productId: 'p1', currentStock: 0, threshold: 5 },
    ]);
    productRepository.scanAll.mockResolvedValue([]);

    const result = await getLowStock();

    expect(result[0].name).toBe('Unknown Product');
  });
});
