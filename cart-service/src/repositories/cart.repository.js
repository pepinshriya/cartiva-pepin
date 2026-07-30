const { PutCommand, GetCommand, UpdateCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient } = require('../config/dynamodb');
const { TABLE_NAME } = require('../models/cart.model');

const create = async (cart) => {
  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: cart,
  });
  await docClient.send(command);
  return cart;
};

const findByUserId = async (userId) => {
  const command = new GetCommand({
    TableName: TABLE_NAME,
    Key: { userId },
  });
  const result = await docClient.send(command);
  return result.Item || null;
};

const update = async (userId, updates) => {
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
    Key: { userId },
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: 'ALL_NEW',
  });

  const result = await docClient.send(command);
  return result.Attributes || null;
};

const remove = async (userId) => {
  const command = new DeleteCommand({
    TableName: TABLE_NAME,
    Key: { userId },
  });
  await docClient.send(command);
  return { userId };
};

module.exports = { create, findByUserId, update, remove };
