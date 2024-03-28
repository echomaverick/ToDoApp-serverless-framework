//auth 5
import React, { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      try {
        const decodedToken = jwt_decode(accessToken);
        const { userId, username, role } = decodedToken;
        setUser({ _id: userId, username, role });
      } catch (error) {
        console.error("Error decoding token:", error);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  const login = (token) => {
    localStorage.setItem("accessToken", token);

    try {
      const decodedToken = jwt_decode(token);
      const { userId, username, roles } = decodedToken;
      setUser({ _id: userId, username, roles });
    } catch (error) {
      console.error("Error decoding token:", error);
      setUser(null);
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  const updateUser = (newUserData) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...newUserData,
    }));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
