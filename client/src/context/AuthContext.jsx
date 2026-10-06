import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check logged-in user when app starts
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    const getCurrentUser = async () => {
      try {
        const response = await api.get("/auth/me");
        setUser(response.data.user);
      } catch (error) {
        console.error("Authentication failed");

        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getCurrentUser();
  }, []);

  // Login
  const login = async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password
    });

    const { token, user } = response.data;

    localStorage.setItem("token", token);
    setUser(user);

    return response.data;
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};