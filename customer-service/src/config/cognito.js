const { CognitoIdentityProviderClient } = require('@aws-sdk/client-cognito-identity-provider');

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION || 'ap-southeast-1',
});

const USER_POOL_ID = process.env.USER_POOL_ID;

module.exports = { cognitoClient, USER_POOL_ID };
