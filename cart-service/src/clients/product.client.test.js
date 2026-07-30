const axios = require('axios');
const { getProductById } = require('./product.client');

jest.mock('axios');

describe('getProductById', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return product data when the call succeeds', async () => {
    axios.get.mockResolvedValue({
      data: { data: { productId: 'p1', name: 'Shirt', price: 100 } },
    });

    const result = await getProductById('p1');

    expect(result).toEqual({ productId: 'p1', name: 'Shirt', price: 100 });
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining('/api/products/p1'),
      expect.objectContaining({ timeout: 5000 })
    );
  });

  it('should throw a 500 error when the call fails', async () => {
    axios.get.mockRejectedValue(new Error('Network Error'));

    await expect(getProductById('p1')).rejects.toMatchObject({
      statusCode: 500,
      message: 'Product service unavailable',
    });
  });
});
