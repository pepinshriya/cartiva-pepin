const { mockClient } = require('aws-sdk-client-mock');
const {
  PutCommand,
  GetCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand,
} = require('@aws-sdk/lib-dynamodb');
const { docClient } = require('../config/dynamodb');
const productRepository = require('./product.repository');

const ddbMock = mockClient(docClient);

describe('product.repository', () => {
  beforeEach(() => {
    ddbMock.reset();
  });

  describe('create', () => {
    it('should send a PutCommand and return the product', async () => {
      ddbMock.on(PutCommand).resolves({});
      const product = { productId: 'p1', name: 'Shirt' };

      const result = await productRepository.create(product);

      expect(result).toEqual(product);
      expect(ddbMock.commandCalls(PutCommand).length).toBe(1);
    });
  });

  describe('findById', () => {
    it('should return the item when found', async () => {
      ddbMock.on(GetCommand).resolves({ Item: { productId: 'p1', name: 'Shirt' } });

      const result = await productRepository.findById('p1');

      expect(result).toEqual({ productId: 'p1', name: 'Shirt' });
    });

    it('should return null when not found', async () => {
      ddbMock.on(GetCommand).resolves({});

      const result = await productRepository.findById('p1');

      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all items', async () => {
      ddbMock.on(ScanCommand).resolves({ Items: [{ productId: 'p1' }, { productId: 'p2' }] });

      const result = await productRepository.findAll();

      expect(result).toEqual([{ productId: 'p1' }, { productId: 'p2' }]);
    });
  });

  describe('update', () => {
    it('should return the updated attributes', async () => {
      ddbMock.on(UpdateCommand).resolves({ Attributes: { productId: 'p1', name: 'New Name' } });

      const result = await productRepository.update('p1', { name: 'New Name' });

      expect(result).toEqual({ productId: 'p1', name: 'New Name' });
    });
  });

  describe('remove', () => {
    it('should send a DeleteCommand and return the productId', async () => {
      ddbMock.on(DeleteCommand).resolves({});

      const result = await productRepository.remove('p1');

      expect(result).toEqual({ productId: 'p1' });
      expect(ddbMock.commandCalls(DeleteCommand).length).toBe(1);
    });
  });
});
