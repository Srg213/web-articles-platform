import React, { createContext, useContext, useState } from 'react';
import { loadUser, saveSession, clearSession } from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser());

  function login(token, user) {
    saveSession(token, user);
    setUser(user);
  }
  function logout() {
    clearSession();
    setUser(null);
  }
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
