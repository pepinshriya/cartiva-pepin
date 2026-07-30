const { mockClient } = require('aws-sdk-client-mock');
const { ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient } = require('../config/dynamodb');
const productRepository = require('./product.repository');

const ddbMock = mockClient(docClient);

describe('product.repository', () => {
  beforeEach(() => {
    ddbMock.reset();
  });

  it('should return all items from the products table', async () => {
    ddbMock.on(ScanCommand).resolves({ Items: [{ productId: 'p1' }, { productId: 'p2' }] });

    const result = await productRepository.scanAll();

    expect(result).toEqual([{ productId: 'p1' }, { productId: 'p2' }]);
  });

  it('should return an empty array when no items exist', async () => {
    ddbMock.on(ScanCommand).resolves({});

    const result = await productRepository.scanAll();

    expect(result).toEqual([]);
  });
});
