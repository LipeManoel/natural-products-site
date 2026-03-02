import { useState } from "react";

import "./auth.css"

export default function Login({ setPage, setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [popup, setPopup] = useState({ text: "", type: "", visible: false });

  const handleLogin = async () => {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (data.token) {
      setToken(data.token);
      setPage("products");
    } else {
      showPopup(data.error, "error");
    }
  };
  
  const showPopup = (text, type) => {
    setPopup({ text, type, visible: true });
    setTimeout(() => setPopup(prev => ({ ...prev, visible: false })), 3000);
  };

  return (
    <>
    {/* Pop-up */}
      <div className={`popup ${popup.type} ${popup.visible ? "visible" : ""}`}>
        <span className="popup-text">{popup.text}</span>
      </div>

    <div className="auth-section">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-brand">
            <h1 className="auth-title">Login</h1>
            <p className="auth-subtitle">Natura Pura</p>
          </div>
          
          <div className="auth-form">
            <div className="input-group">
              <input
                type="text"
                placeholder="Usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="auth-input"
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
              />
            </div>
            <button onClick={handleLogin} className="auth-button">
              Entrar
            </button>
          </div>

          <div className="auth-footer">
            <p>
              Não tem conta?{" "}
              <span className="auth-link" onClick={() => setPage("register")}>
                Registre-se
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}