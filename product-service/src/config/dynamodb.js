const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

console.log('AWS_EXECUTION_ENV:', process.env.AWS_EXECUTION_ENV);
console.log('AWS_REGION:', process.env.AWS_REGION);
console.log('AWS_ACCESS_KEY_ID exists:', !!process.env.AWS_ACCESS_KEY_ID);
console.log('AWS_SECRET_ACCESS_KEY exists:', !!process.env.AWS_SECRET_ACCESS_KEY);

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'ap-southeast-1',
});

const docClient = DynamoDBDocumentClient.from(client);

module.exports = { client, docClient };
