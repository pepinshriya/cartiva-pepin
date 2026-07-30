const { SNSClient } = require("@aws-sdk/client-sns");

const snsClient = new SNSClient({
  region: process.env.AWS_REGION || "ap-southeast-1",
});

module.exports = snsClient;