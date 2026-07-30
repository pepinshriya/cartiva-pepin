const { mockClient } = require('aws-sdk-client-mock');
const {
  ListUsersCommand,
  AdminGetUserCommand,
  AdminEnableUserCommand,
  AdminDisableUserCommand,
} = require('@aws-sdk/client-cognito-identity-provider');
const axios = require('axios');
const { cognitoClient } = require('../config/cognito');
const customerService = require('./customer.service');

jest.mock('axios');
const cognitoMock = mockClient(cognitoClient);

const buildCognitoUser = ({ sub, email, name, enabled = true }) => ({
  Username: sub,
  Enabled: enabled,
  UserCreateDate: new Date('2024-01-01T00:00:00.000Z'),
  Attributes: [
    { Name: 'sub', Value: sub },
    { Name: 'email', Value: email },
    { Name: 'name', Value: name },
  ],
});

describe('getCustomers', () => {
  beforeEach(() => {
    cognitoMock.reset();
  });

  it('should return mapped customers from Cognito', async () => {
    cognitoMock.on(ListUsersCommand).resolves({
      Users: [buildCognitoUser({ sub: 'u1', email: 'a@test.com', name: 'Alice' })],
    });

    const result = await customerService.getCustomers();

    expect(result).toEqual([{
      customerId: 'u1',
      email: 'a@test.com',
      name: 'Alice',
      phone: '',
      status: 'ACTIVE',
      createdAt: '2024-01-01T00:00:00.000Z',
      totalOrders: 0,
      totalSpending: 0,
    }]);
  });
});

describe('getCustomerById', () => {
  beforeEach(() => {
    cognitoMock.reset();
    jest.clearAllMocks();
  });

  it('should return customer with order totals when found', async () => {
    cognitoMock.on(AdminGetUserCommand).resolves(
      buildCognitoUser({ sub: 'u1', email: 'a@test.com', name: 'Alice' })
    );
    axios.get.mockResolvedValue({
      data: { data: [{ totalAmount: 100 }, { totalAmount: 200 }] },
    });

    const result = await customerService.getCustomerById('u1', 'Bearer token');

    expect(result.customerId).toBe('u1');
    expect(result.totalOrders).toBe(2);
    expect(result.totalSpending).toBe(300);
  });

  it('should throw 404 when user is not found', async () => {
    cognitoMock.on(AdminGetUserCommand).rejects({ name: 'UserNotFoundException' });

    await expect(customerService.getCustomerById('u1')).rejects.toMatchObject({
      statusCode: 404,
    });
  });
});

describe('getCustomerOrders', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return orders when the call succeeds', async () => {
    axios.get.mockResolvedValue({ data: { data: [{ orderId: 'o1' }] } });

    const result = await customerService.getCustomerOrders('u1', 'Bearer token');

    expect(result).toEqual([{ orderId: 'o1' }]);
  });

  it('should return an empty array when the call fails', async () => {
    axios.get.mockRejectedValue(new Error('Network error'));

    const result = await customerService.getCustomerOrders('u1');

    expect(result).toEqual([]);
  });
});

describe('updateCustomerStatus', () => {
  beforeEach(() => {
    cognitoMock.reset();
    jest.clearAllMocks();
  });

  it('should enable the user when status is ACTIVE', async () => {
    cognitoMock.on(AdminEnableUserCommand).resolves({});
    cognitoMock.on(AdminGetUserCommand).resolves(
      buildCognitoUser({ sub: 'u1', email: 'a@test.com', name: 'Alice', enabled: true })
    );
    axios.get.mockResolvedValue({ data: { data: [] } });

    const result = await customerService.updateCustomerStatus('u1', 'ACTIVE');

    expect(result.status).toBe('ACTIVE');
    expect(cognitoMock.commandCalls(AdminEnableUserCommand).length).toBe(1);
  });

  it('should disable the user when status is not ACTIVE', async () => {
    cognitoMock.on(AdminDisableUserCommand).resolves({});
    cognitoMock.on(AdminGetUserCommand).resolves(
      buildCognitoUser({ sub: 'u1', email: 'a@test.com', name: 'Alice', enabled: false })
    );
    axios.get.mockResolvedValue({ data: { data: [] } });

    const result = await customerService.updateCustomerStatus('u1', 'DISABLED');

    expect(result.status).toBe('DISABLED');
    expect(cognitoMock.commandCalls(AdminDisableUserCommand).length).toBe(1);
  });

  it('should throw 404 when the user does not exist', async () => {
    cognitoMock.on(AdminEnableUserCommand).rejects({ name: 'UserNotFoundException' });

    await expect(customerService.updateCustomerStatus('u1', 'ACTIVE')).rejects.toMatchObject({
      statusCode: 404,
    });
  });
});
