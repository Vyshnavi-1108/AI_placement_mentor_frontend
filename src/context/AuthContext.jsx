import { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (currentToken) => {
    if (!currentToken) {
      setUser(null);
      setOnboardingCompleted(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      // 1. Fetch Profile
      const profileRes = await api.get("/api/users/profile");
      setUser(profileRes.data);

      // 2. Fetch Onboarding Info
      try {
        const onboardingRes = await api.get("/api/onboarding");
        if (onboardingRes.data) {
          setOnboardingCompleted(true);
        }
      } catch (error) {
        if (error.response?.status === 404) {
          setOnboardingCompleted(false);
        }
      }
    } catch (error) {
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
      setOnboardingCompleted(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData(token);
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setOnboardingCompleted(false);
  };

  const refreshOnboardingStatus = async () => {
    try {
      const res = await api.get("/api/onboarding");
      if (res.data) {
        setOnboardingCompleted(true);
      }
    } catch {
      setOnboardingCompleted(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        onboardingCompleted,
        loading,
        login,
        logout,
        refreshOnboardingStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
