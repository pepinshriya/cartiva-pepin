const { mockClient } = require('aws-sdk-client-mock');
const { ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient } = require('../config/dynamodb');
const orderRepository = require('./order.repository');

const ddbMock = mockClient(docClient);

describe('order.repository', () => {
  beforeEach(() => {
    ddbMock.reset();
  });

  it('should return all items from the orders table', async () => {
    ddbMock.on(ScanCommand).resolves({ Items: [{ orderId: 'o1' }, { orderId: 'o2' }] });

    const result = await orderRepository.scanAll();

    expect(result).toEqual([{ orderId: 'o1' }, { orderId: 'o2' }]);
  });

  it('should return an empty array when no items exist', async () => {
    ddbMock.on(ScanCommand).resolves({});

    const result = await orderRepository.scanAll();

    expect(result).toEqual([]);
  });
});
