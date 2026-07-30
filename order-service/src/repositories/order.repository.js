const { PutCommand, GetCommand, UpdateCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient } = require('../config/dynamodb');
const { TABLE_NAME } = require('../models/order.model');

const create = async (order) => {
  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: order,
  });
  await docClient.send(command);
  return order;
};

const findById = async (orderId) => {
  const command = new GetCommand({
    TableName: TABLE_NAME,
    Key: { orderId },
  });
  const result = await docClient.send(command);
  return result.Item || null;
};

const findByUserId = async (userId) => {
  const command = new ScanCommand({
    TableName: TABLE_NAME,
    FilterExpression: 'userId = :userId',
    ExpressionAttributeValues: { ':userId': userId },
  });
  const result = await docClient.send(command);
  return result.Items || [];
};

const update = async (orderId, updates) => {
  const updateExpression =
    'SET ' +
    Object.keys(updates)
      .map((key) => `#${key} = :${key}`)
      .join(', ');

  const expressionAttributeNames = {};
  const expressionAttributeValues = {};

  for (const key of Object.keys(updates)) {
    expressionAttributeNames[`#${key}`] = key;
    expressionAttributeValues[`:${key}`] = updates[key];
  }

  const command = new UpdateCommand({
    TableName: TABLE_NAME,
    Key: { orderId },
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: 'ALL_NEW',
  });

  const result = await docClient.send(command);
  return result.Attributes || null;
};

const findAll = async () => {
  const command = new ScanCommand({
    TableName: TABLE_NAME,
  });
  const result = await docClient.send(command);
  return result.Items || [];
};

const appendTimeline = async (orderId, entry) => {
  const command = new UpdateCommand({
    TableName: TABLE_NAME,
    Key: { orderId },
    UpdateExpression:
      'SET statusHistory = list_append(if_not_exists(statusHistory, :empty), :entry)',
    ExpressionAttributeValues: {
      ':entry': [entry],
      ':empty': [],
    },
    ReturnValues: 'ALL_NEW',
  });

  const result = await docClient.send(command);
  return result.Attributes || null;
};

module.exports = { create, findById, findByUserId, update, findAll, appendTimeline };
