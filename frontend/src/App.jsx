import React, { useState } from "react";
import Login from "@/pages/auth/Login.jsx";
import Register from "@/pages/auth/Register";
import Dashboard from "@/pages/dashboard/Dashboard";
import { useKeyboardNavigation } from "@/hooks/useKeyboardNavigation"; // novo

export default function App() {
  const [token, setToken] = useState(null);
  const [page, setPage] = useState("login");

  useKeyboardNavigation(); // ativa atalhos em todo o app

  const logout = () => {
    setToken(null);
    setPage("login");
  };

  if (!token) {
    return page === "login" ? (
      <Login setPage={setPage} setToken={setToken} />
    ) : (
      <Register setPage={setPage} />
    );
  }

  return <Dashboard token={token} logout={logout} />;
}
