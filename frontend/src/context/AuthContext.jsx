import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  login as cognitoLogin,
  register as cognitoRegister,
  logout as cognitoLogout,
  getCurrentUserSafe,
  getSession,
  confirmRegistration as cognitoConfirmRegistration,
  resendConfirmationCode as cognitoResendConfirmationCode,
} from "../auth/cognitoService";

const AuthContext = createContext(null);

const decodeJwtPayload = (token) => {
  try {
    const base64 = token.split(".")[1];
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return {};
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    try {
      const currentUser = await getCurrentUserSafe();
      if (!currentUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      const session = await getSession();
      const accessToken = session.tokens?.accessToken?.toString();
      const idToken = session.tokens?.idToken?.toString();

      if (!accessToken || !idToken) {
        setUser(null);
        setLoading(false);
        return;
      }

      const payload = decodeJwtPayload(idToken);

      const groups = payload["cognito:groups"] || [];

      setUser({
        email: payload.email || "",
        name: payload.name || "",
        sub: payload.sub || "",
        groups,
        accessToken,
        idToken,
      });
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email, password) => {
    if (user) {
      return { isSignedIn: true };
    }

    const result = await cognitoLogin(email, password);

    if (!result.isSignedIn) {
      const step = result.nextStep?.signInStep || "UNKNOWN";
      throw new Error(`Additional step required: ${step}`);
    }

    const session = await getSession();
    const accessToken = session.tokens?.accessToken?.toString();
    const idToken = session.tokens?.idToken?.toString();

    if (!accessToken || !idToken) {
      throw new Error("Failed to retrieve tokens after login");
    }

    const payload = decodeJwtPayload(idToken);
    const groups = payload["cognito:groups"] || [];

    setUser({
      email: payload.email || "",
      name: payload.name || "",
      sub: payload.sub || "",
      groups,
      accessToken,
      idToken,
    });

    return result;
  };

  const register = async (name, email, password) => {
    const result = await cognitoRegister(name, email, password);
    return result;
  };

  const confirmRegistration = async (email, code) => {
    const result = await cognitoConfirmRegistration(email, code);
    return result;
  };

  const resendConfirmationCode = async (email) => {
    const result = await cognitoResendConfirmationCode(email);
    return result;
  };

  const logout = async () => {
    await cognitoLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, confirmRegistration, resendConfirmationCode }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
