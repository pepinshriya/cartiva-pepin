const { mockClient } = require('aws-sdk-client-mock');
const { PutCommand, GetCommand, UpdateCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient } = require('../config/dynamodb');
const orderRepository = require('./order.repository');

const ddbMock = mockClient(docClient);

describe('order.repository', () => {

  beforeEach(() => {
    ddbMock.reset();
  });

  describe('create', () => {
    it('should send a PutCommand and return the order', async () => {
      ddbMock.on(PutCommand).resolves({});
      const order = { orderId: 'o1', userId: 'user1' };

      const result = await orderRepository.create(order);

      expect(result).toEqual(order);
      expect(ddbMock.commandCalls(PutCommand).length).toBe(1);
    });
  });

  describe('findById', () => {
    it('should return the item when found', async () => {
      ddbMock.on(GetCommand).resolves({ Item: { orderId: 'o1' } });

      const result = await orderRepository.findById('o1');

      expect(result).toEqual({ orderId: 'o1' });
    });

    it('should return null when not found', async () => {
      ddbMock.on(GetCommand).resolves({});

      const result = await orderRepository.findById('o1');

      expect(result).toBeNull();
    });
  });

  describe('findByUserId', () => {
    it('should return matching items', async () => {
      ddbMock.on(ScanCommand).resolves({ Items: [{ orderId: 'o1', userId: 'user1' }] });

      const result = await orderRepository.findByUserId('user1');

      expect(result).toEqual([{ orderId: 'o1', userId: 'user1' }]);
    });

    it('should return an empty array when nothing found', async () => {
      ddbMock.on(ScanCommand).resolves({});

      const result = await orderRepository.findByUserId('user1');

      expect(result).toEqual([]);
    });
  });

  describe('update', () => {
    it('should return the updated attributes', async () => {
      ddbMock.on(UpdateCommand).resolves({ Attributes: { orderId: 'o1', status: 'SHIPPED' } });

      const result = await orderRepository.update('o1', { status: 'SHIPPED' });

      expect(result).toEqual({ orderId: 'o1', status: 'SHIPPED' });
    });
  });

  describe('findAll', () => {
    it('should return all items', async () => {
      ddbMock.on(ScanCommand).resolves({ Items: [{ orderId: 'o1' }, { orderId: 'o2' }] });

      const result = await orderRepository.findAll();

      expect(result).toEqual([{ orderId: 'o1' }, { orderId: 'o2' }]);
    });
  });

  describe('appendTimeline', () => {
    it('should send an UpdateCommand and return updated attributes', async () => {
      const entry = { status: 'SHIPPED', note: 'On the way' };
      ddbMock.on(UpdateCommand).resolves({
        Attributes: { orderId: 'o1', statusHistory: [entry] },
      });

      const result = await orderRepository.appendTimeline('o1', entry);

      expect(result).toEqual({ orderId: 'o1', statusHistory: [entry] });
      expect(ddbMock.commandCalls(UpdateCommand).length).toBe(1);
    });
  });

});
