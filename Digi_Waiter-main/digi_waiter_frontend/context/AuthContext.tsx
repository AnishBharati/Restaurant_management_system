// src/context/AuthContext.tsx
"use client";

import { createContext, useContext, useState } from "react";
import { api, setAccessToken } from "@/lib/axios";
type AuthContextType = {
  accessToken: string | null;
  login: (tokens: { accessToken: string }) => void;
  // logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setToken] = useState<string | null>(null);

  const login = ({ accessToken }: { accessToken: string }) => {
    // store in memory
    setToken(accessToken);
    setAccessToken(accessToken);
  };

  // const logout = async () => {
  //   try {
  //     await api.post("/logout", {
  //       refreshToken: localStorage.getItem("refreshToken"),
  //     });
  //   } catch (err) {
  //     console.error("Logout failed", err);
  //   }
  //   setToken(null);
  //   setAccessToken("");
  //   localStorage.removeItem("refreshToken");
  //   window.location.href = "/login";
  // };

  return (
    <AuthContext.Provider value={{ accessToken, login }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext)!;
