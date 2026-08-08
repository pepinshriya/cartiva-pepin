const axios = require('axios');
const {
  ListUsersCommand,
  AdminGetUserCommand,
  AdminEnableUserCommand,
  AdminDisableUserCommand,
} = require('@aws-sdk/client-cognito-identity-provider');
const { cognitoClient, USER_POOL_ID } = require('../config/cognito');

const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || '';

const mapUser = (user) => {
  const getAttr = (name) => {
    const attr = user.Attributes?.find((a) => a.Name === name);
    return attr?.Value || '';
  };

  return {
    customerId: getAttr('sub'),
    email: getAttr('email'),
    name: getAttr('name') || getAttr('email') || '—',
    phone: getAttr('phone_number') || '',
    status: user.Enabled ? 'ACTIVE' : 'DISABLED',
    createdAt: user.UserCreateDate?.toISOString() || new Date().toISOString(),
    totalOrders: 0,
    totalSpending: 0,
  };
};

const getCustomers = async (authHeader) => {
  const command = new ListUsersCommand({
    UserPoolId: USER_POOL_ID,
    Limit: 60,
  });

  const result = await cognitoClient.send(command);
  const users = (result.Users || []).map(mapUser);

  const enrichedUsers = await Promise.all(
    users.map(async (customer) => {
      const orders = await getCustomerOrders(customer.customerId, authHeader);
      customer.totalOrders = orders.length;
      customer.totalSpending = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
      return customer;
    })
  );

  return enrichedUsers;
};

const getCustomerById = async (customerId, authHeader) => {
  const command = new AdminGetUserCommand({
    UserPoolId: USER_POOL_ID,
    Username: customerId,
  });

  let user;
  try {
    user = await cognitoClient.send(command);
  } catch (err) {
    if (err.name === 'UserNotFoundException' || err.__type?.includes('UserNotFoundException')) {
      throw { statusCode: 404, message: 'Customer not found' };
    }
    throw err;
  }

  const customer = mapUser(user);

  const orders = await getCustomerOrders(customerId, authHeader);
  customer.totalOrders = orders.length;
  customer.totalSpending = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  return customer;
};

const getCustomerOrders = async (customerId, authHeader) => {
  try {
    const response = await axios.get(`${ORDER_SERVICE_URL}/api/orders/user/${customerId}`, {
      headers: authHeader ? { Authorization: authHeader } : {},
    });
    return response.data?.data ?? response.data ?? [];
  } catch {
    return [];
  }
};

const updateCustomerStatus = async (customerId, status, authHeader) => {
  const isEnabled = status === 'ACTIVE';

  const Command = isEnabled ? AdminEnableUserCommand : AdminDisableUserCommand;
  const command = new Command({
    UserPoolId: USER_POOL_ID,
    Username: customerId,
  });

  try {
    await cognitoClient.send(command);
  } catch (err) {
    if (err.name === 'UserNotFoundException' || err.__type?.includes('UserNotFoundException')) {
      throw { statusCode: 404, message: 'Customer not found' };
    }
    throw err;
  }

  return await getCustomerById(customerId, authHeader);
};

module.exports = {
  getCustomers,
  getCustomerById,
  getCustomerOrders,
  updateCustomerStatus,
};
