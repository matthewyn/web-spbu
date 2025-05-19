import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userInfo = localStorage.getItem("user");
    if (token && userInfo) {
      try {
        setIsAuthenticated(true);
        setUser(JSON.parse(userInfo)); // Ensure profileImage is included
      } catch (error) {
        console.error("Error parsing user info from local storage:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post("/api/auth/login", { email, password });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user)); // Ensure profileImage is included
      setIsAuthenticated(true);
      setUser(response.data.user); // Ensure profileImage is included here
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
  };

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get("/api/users/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const updatedUser = {
        ...response.data,
      };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser)); // Update localStorage with profileImage
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  return <AuthContext.Provider value={{ isAuthenticated, user, setUser, login, logout, fetchUserProfile }}>{children}</AuthContext.Provider>;
};

// Add Axios interceptor
axios.interceptors.response.use(
  (response) => response, // Pass through successful responses
  (error) => {
    if (error.response && error.response.status === 401 && error.response.data.message === "Token kadaluwarsa") {
      toast.error("Token kadaluwarsa"); // Show toast notification
      localStorage.removeItem("token"); // Clear expired token
      localStorage.removeItem("user"); // Clear user data
      window.location.href = "/login"; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export { AuthContext, AuthProvider };
