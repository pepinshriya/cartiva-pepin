const { PutCommand, GetCommand, UpdateCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient } = require('../config/dynamodb');
const { TABLE_NAME } = require('../models/inventory.model');

const create = async (inventory) => {
  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: inventory,
  });
  await docClient.send(command);
  return inventory;
};

const findByProductId = async (productId) => {
  const command = new GetCommand({
    TableName: TABLE_NAME,
    Key: { productId },
  });
  const result = await docClient.send(command);
  return result.Item || null;
};

const update = async (productId, updates) => {
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
    Key: { productId },
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

module.exports = { create, findByProductId, update, findAll };
