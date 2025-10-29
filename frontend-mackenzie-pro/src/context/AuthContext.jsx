import React, { createContext, useContext, useState } from "react";
import { getToken, clearToken } from "../api/client";
import { login as apiLogin } from "../api/auth";

const AuthCtx = createContext(null);

export function AuthProvider({ children }){
  const [token, setTokenState] = useState(getToken());
  async function login({ username, password }){
    const data = await apiLogin({ username, password });
    setTokenState(getToken());
    return data;
  }
  function logout(){ clearToken(); setTokenState(null); }

  return (
    <AuthCtx.Provider value={{ token, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}
export function useAuth(){ return useContext(AuthCtx); }
