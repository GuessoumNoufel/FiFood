import { createContext, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const navigate = useNavigate();
  const logout = async () => {
    try {
      await api.post("/users/logout");
      toast.success("you are logged out");
    } catch (err) {
      console.log(err);
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    // console.log(location.pathname);
    if (
      location.pathname.startsWith("/profile") ||
      location.pathname.startsWith("/create-recipe") ||
      location.pathname.startsWith("/favorites")
    ) {
      navigate("/");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
