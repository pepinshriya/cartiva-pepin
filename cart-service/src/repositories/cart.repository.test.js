const { mockClient } = require('aws-sdk-client-mock');
const { PutCommand, GetCommand, UpdateCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient } = require('../config/dynamodb');
const cartRepository = require('./cart.repository');

const ddbMock = mockClient(docClient);

describe('cart.repository', () => {

  beforeEach(() => {
    ddbMock.reset();
  });

  describe('create', () => {
    it('should send a PutCommand and return the cart', async () => {
      ddbMock.on(PutCommand).resolves({});
      const cart = { userId: 'user1', items: [], totalPrice: 0 };

      const result = await cartRepository.create(cart);

      expect(result).toEqual(cart);
      expect(ddbMock.commandCalls(PutCommand).length).toBe(1);
    });
  });

  describe('findByUserId', () => {
    it('should return the item when found', async () => {
      ddbMock.on(GetCommand).resolves({ Item: { userId: 'user1', items: [] } });

      const result = await cartRepository.findByUserId('user1');

      expect(result).toEqual({ userId: 'user1', items: [] });
    });

    it('should return null when no item is found', async () => {
      ddbMock.on(GetCommand).resolves({});

      const result = await cartRepository.findByUserId('user1');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should return the updated attributes', async () => {
      ddbMock.on(UpdateCommand).resolves({ Attributes: { userId: 'user1', totalPrice: 200 } });

      const result = await cartRepository.update('user1', { totalPrice: 200 });

      expect(result).toEqual({ userId: 'user1', totalPrice: 200 });
    });
  });

  describe('remove', () => {
    it('should send a DeleteCommand and return the userId', async () => {
      ddbMock.on(DeleteCommand).resolves({});

      const result = await cartRepository.remove('user1');

      expect(result).toEqual({ userId: 'user1' });
      expect(ddbMock.commandCalls(DeleteCommand).length).toBe(1);
    });
  });

});
