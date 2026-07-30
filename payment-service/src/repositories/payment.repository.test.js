const { mockClient } = require('aws-sdk-client-mock');
const { PutCommand, GetCommand, UpdateCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient } = require('../config/dynamodb');
const paymentRepository = require('./payment.repository');

const ddbMock = mockClient(docClient);

describe('payment.repository', () => {
  beforeEach(() => {
    ddbMock.reset();
  });

  describe('create', () => {
    it('should send a PutCommand and return the payment', async () => {
      ddbMock.on(PutCommand).resolves({});
      const payment = { paymentId: 'pay1', orderId: 'o1' };

      const result = await paymentRepository.create(payment);

      expect(result).toEqual(payment);
      expect(ddbMock.commandCalls(PutCommand).length).toBe(1);
    });
  });

  describe('findById', () => {
    it('should return the item when found', async () => {
      ddbMock.on(GetCommand).resolves({ Item: { paymentId: 'pay1' } });

      const result = await paymentRepository.findById('pay1');

      expect(result).toEqual({ paymentId: 'pay1' });
    });

    it('should return null when not found', async () => {
      ddbMock.on(GetCommand).resolves({});

      const result = await paymentRepository.findById('pay1');

      expect(result).toBeNull();
    });
  });

  describe('findByOrderId', () => {
    it('should return matching items', async () => {
      ddbMock.on(ScanCommand).resolves({ Items: [{ paymentId: 'pay1', orderId: 'o1' }] });

      const result = await paymentRepository.findByOrderId('o1');

      expect(result).toEqual([{ paymentId: 'pay1', orderId: 'o1' }]);
    });

    it('should return an empty array when nothing found', async () => {
      ddbMock.on(ScanCommand).resolves({});

      const result = await paymentRepository.findByOrderId('o1');

      expect(result).toEqual([]);
    });
  });

  describe('update', () => {
    it('should return the updated attributes', async () => {
      ddbMock.on(UpdateCommand).resolves({ Attributes: { paymentId: 'pay1', status: 'SUCCESS' } });

      const result = await paymentRepository.update('pay1', { status: 'SUCCESS' });

      expect(result).toEqual({ paymentId: 'pay1', status: 'SUCCESS' });
    });
  });
});
