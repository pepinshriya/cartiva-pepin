import { Amplify } from 'aws-amplify';

try {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: 'ap-southeast-1_Qh0jduvWQ',
        userPoolClientId: '2vu6humhe1ekq1rkqjkp90v4bj',
        region: 'ap-southeast-1',
      },
    },
  });
} catch (err) {
  console.error('Amplify configure failed:', err);
}
