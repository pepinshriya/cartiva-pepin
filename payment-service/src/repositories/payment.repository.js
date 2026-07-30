const { PutCommand, GetCommand, UpdateCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient } = require('../config/dynamodb');
const { TABLE_NAME } = require('../models/payment.model');

const create = async (payment) => {
  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: payment,
  });
  await docClient.send(command);
  return payment;
};

const findById = async (paymentId) => {
  const command = new GetCommand({
    TableName: TABLE_NAME,
    Key: { paymentId },
  });
  const result = await docClient.send(command);
  return result.Item || null;
};

const findByOrderId = async (orderId) => {
  const command = new ScanCommand({
    TableName: TABLE_NAME,
    FilterExpression: 'orderId = :orderId',
    ExpressionAttributeValues: { ':orderId': orderId },
  });
  const result = await docClient.send(command);
  return result.Items || [];
};

const update = async (paymentId, updates) => {
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
    Key: { paymentId },
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: 'ALL_NEW',
  });

  const result = await docClient.send(command);
  return result.Attributes || null;
};

module.exports = { create, findById, findByOrderId, update };
