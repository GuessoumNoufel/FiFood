import { useEffect, useState } from "react";
import api from "../API/axios";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "./authContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    localStorage.removeItem("token");
    const stored = localStorage.getItem("user");
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      return null;
    }
  });

  const userId = user?._id;
  useEffect(() => {
    if (!userId) return undefined;
    let active = true;
    api
      .get("/users/me")
      .then((response) => {
        if (!active) return;
        const currentUser = response.data?.data?.user;
        if (currentUser) {
          localStorage.setItem("user", JSON.stringify(currentUser));
          setUser(currentUser);
        }
      })
      .catch((error) => {
        if (!active || error.response?.status !== 401) return;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      });
    return () => {
      active = false;
    };
  }, [userId]);

  const login = (userData) => {
    localStorage.removeItem("token");
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const navigate = useNavigate();
  const location = useLocation();
  const logout = async () => {
    try {
      await api.post("/users/logout");
      toast.success("you are logged out");
    } catch {
      // Clear the local session even if the server cannot be reached.
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
