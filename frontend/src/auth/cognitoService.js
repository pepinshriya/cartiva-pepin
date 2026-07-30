import './cognitoConfig';
import {
  signUp,
  signIn,
  signOut,
  getCurrentUser,
  fetchAuthSession,
  resetPassword,
  confirmResetPassword,
  confirmSignUp,
  resendSignUpCode,
} from 'aws-amplify/auth';

export const register = async (name, email, password) => {
  const result = await signUp({
    username: email,
    password,
    options: {
      userAttributes: { name, email },
    },
  });
  return result;
};

export const confirmRegistration = async (email, code) => {
  const result = await confirmSignUp({
    username: email,
    confirmationCode: code,
  });
  return result;
};

export const resendConfirmationCode = async (email) => {
  const result = await resendSignUpCode({ username: email });
  return result;
};

export const login = async (email, password) => {
  const result = await signIn({ username: email, password });
  return result;
};

export const logout = async () => {
  await signOut();
};

export const getCurrentUserSafe = async () => {
  try {
    return await getCurrentUser();
  } catch {
    return null;
  }
};

export const getSession = async () => {
  const session = await fetchAuthSession();
  return session;
};

export const getAccessToken = async () => {
  const session = await fetchAuthSession();
  return session.tokens?.accessToken?.toString() || null;
};

export const getIdToken = async () => {
  const session = await fetchAuthSession();
  return session.tokens?.idToken?.toString() || null;
};

export const forgotPassword = async (email) => {
  const result = await resetPassword({ username: email });
  return result;
};

export const confirmPassword = async (email, code, newPassword) => {
  await confirmResetPassword({
    username: email,
    confirmationCode: code,
    newPassword,
  });
};
