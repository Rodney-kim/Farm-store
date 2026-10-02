import { createContext, useContext, useState } from "react";
import { loginUser, registerUser } from "../services/api.js";

const AuthContext = createContext(null);
const STORAGE_KEY = "farmstore_user";

function loadUser() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser);

  function save(userData) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    setUser(userData);
  }

  async function login(email, password) {
    save(await loginUser({ email, password }));
  }

  async function signup(name, email, password) {
    save(await registerUser({ name, email, password }));
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }

  const value = { user, isAdmin: user?.role === "admin", login, signup, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside an <AuthProvider>");
  }
  return context;
}
