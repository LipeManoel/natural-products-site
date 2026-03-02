import { useState } from "react";

import "./auth.css"

export default function Register({ setPage }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [popup, setPopup] = useState({ text: "", type: "", visible: false });

  const handleRegister = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.success) {
        showPopup("Registro realizado com sucesso! Faça login.", "success");
        setTimeout(() => setPage("login"), 1500);
      } else {
        showPopup(data.error || "Usuário já existe ou erro no registro.", "error");
      }
    } catch (err) {
      showPopup("Ocorreu um erro. Tente novamente mais tarde.", "error");
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
              <h1 className="auth-title">Registrar</h1>
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
              <button onClick={handleRegister} className="auth-button">
                Registrar
              </button>
            </div>

            <div className="auth-footer">
              <p>
                Já tem conta?{" "}
                <span className="auth-link" onClick={() => setPage("login")}>
                  Faça login
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
