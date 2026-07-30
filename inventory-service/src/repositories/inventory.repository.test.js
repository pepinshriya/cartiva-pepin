const { mockClient } = require('aws-sdk-client-mock');
const { PutCommand, GetCommand, UpdateCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient } = require('../config/dynamodb');
const inventoryRepository = require('./inventory.repository');

const ddbMock = mockClient(docClient);

describe('inventory.repository', () => {

  beforeEach(() => {
    ddbMock.reset();
  });

  describe('create', () => {
    it('should send a PutCommand and return the inventory item', async () => {
      ddbMock.on(PutCommand).resolves({});
      const item = { productId: 'p1', quantity: 50 };

      const result = await inventoryRepository.create(item);

      expect(result).toEqual(item);
      expect(ddbMock.commandCalls(PutCommand).length).toBe(1);
    });
  });

  describe('findByProductId', () => {
    it('should return the item when found', async () => {
      ddbMock.on(GetCommand).resolves({ Item: { productId: 'p1', quantity: 50 } });

      const result = await inventoryRepository.findByProductId('p1');

      expect(result).toEqual({ productId: 'p1', quantity: 50 });
    });

    it('should return null when not found', async () => {
      ddbMock.on(GetCommand).resolves({});

      const result = await inventoryRepository.findByProductId('p1');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should return the updated attributes', async () => {
      ddbMock.on(UpdateCommand).resolves({ Attributes: { productId: 'p1', quantity: 30 } });

      const result = await inventoryRepository.update('p1', { quantity: 30 });

      expect(result).toEqual({ productId: 'p1', quantity: 30 });
    });
  });

  describe('findAll', () => {
    it('should return all items', async () => {
      ddbMock.on(ScanCommand).resolves({ Items: [{ productId: 'p1' }, { productId: 'p2' }] });

      const result = await inventoryRepository.findAll();

      expect(result).toEqual([{ productId: 'p1' }, { productId: 'p2' }]);
    });
  });

});
