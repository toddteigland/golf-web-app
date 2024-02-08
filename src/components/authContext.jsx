import React, { createContext, useContext, useState, useEffect } from "react";
const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(JSON.parse(localStorage.getItem('isLoggedIn')) || false );
  const [user, setUser] = useState( JSON.parse(localStorage.getItem('user')) || null );

  useEffect(() => {
    localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
    localStorage.setItem('user', JSON.stringify(user));
  }, [isLoggedIn, user]);

  const login = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, updateUser, user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
