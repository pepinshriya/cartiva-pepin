const {
  PutCommand,
  GetCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand,
} = require('@aws-sdk/lib-dynamodb');
const { docClient } = require('../config/dynamodb');
const { TABLE_NAME } = require('../models/product.model');

const create = async (product) => {
  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: product,
  });
  await docClient.send(command);
  return product;
};

const findById = async (productId) => {
  const command = new GetCommand({
    TableName: TABLE_NAME,
    Key: { productId },
  });
  const result = await docClient.send(command);
  return result.Item || null;
};

const findAll = async () => {
  const command = new ScanCommand({
    TableName: TABLE_NAME,
  });
  const result = await docClient.send(command);
  return result.Items || [];
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

const remove = async (productId) => {
  const command = new DeleteCommand({
    TableName: TABLE_NAME,
    Key: { productId },
  });
  await docClient.send(command);
  return { productId };
};

module.exports = { create, findById, findAll, update, remove };
