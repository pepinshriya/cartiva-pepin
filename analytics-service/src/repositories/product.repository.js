const { ScanCommand } = require("@aws-sdk/lib-dynamodb");
const { docClient } = require("../config/dynamodb");
const { PRODUCTS_TABLE } = require("../models/tables");

const scanAll = async () => {
  const command = new ScanCommand({ TableName: PRODUCTS_TABLE });
  const result = await docClient.send(command);
  return result.Items || [];
};

module.exports = { scanAll };
