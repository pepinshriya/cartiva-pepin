const { mockClient } = require('aws-sdk-client-mock');
const { ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient } = require('../config/dynamodb');
const inventoryRepository = require('./inventory.repository');

const ddbMock = mockClient(docClient);

describe('inventory.repository', () => {
  beforeEach(() => {
    ddbMock.reset();
  });

  it('should return all items from the inventory table', async () => {
    ddbMock.on(ScanCommand).resolves({ Items: [{ productId: 'p1' }, { productId: 'p2' }] });

    const result = await inventoryRepository.scanAll();

    expect(result).toEqual([{ productId: 'p1' }, { productId: 'p2' }]);
  });

  it('should return an empty array when no items exist', async () => {
    ddbMock.on(ScanCommand).resolves({});

    const result = await inventoryRepository.scanAll();

    expect(result).toEqual([]);
  });
});
