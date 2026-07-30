const { ScanCommand } = require("@aws-sdk/lib-dynamodb");
const { docClient } = require("../config/dynamodb");
const { ORDERS_TABLE } = require("../models/tables");

const scanAll = async () => {
  const command = new ScanCommand({ TableName: ORDERS_TABLE });
  const result = await docClient.send(command);
  return result.Items || [];
};

module.exports = { scanAll };
