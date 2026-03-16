import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

import "./auth.css";

export default function Register({ setPage }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [popup, setPopup] = useState({ text: "", type: "", visible: false });

  const { register, loading, error } = useAuth();

  const showPopup = (text, type) => {
    setPopup({ text, type, visible: true });
    setTimeout(() => setPopup((prev) => ({ ...prev, visible: false })), 3000);
  };

  const handleRegister = async () => {
    if (!username.trim()) {
      showPopup("O usuário não pode estar vazio", "error");
      return;
    }

    if (password.length < 6) {
      showPopup("A senha deve ter pelo menos 6 caracteres", "error");
      return;
    }

    try {
      await register(username, password);
      showPopup("Registro realizado com sucesso! Faça login.", "success");
      setTimeout(() => setPage("login"), 1800);
    } catch (err) {
      showPopup(error || "Usuário já existe ou erro no servidor", "error");
    }
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
                  disabled={loading}
                />
              </div>

              <div className="input-group">
                <input
                  type="password"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="auth-input"
                  disabled={loading}
                />
              </div>

              <button
                onClick={handleRegister}
                className="auth-button"
                disabled={loading}
              >
                {loading ? "Registrando..." : "Registrar"}
              </button>

              {/* Mostra erro do hook, se houver */}
              {error && <p className="error-message">{error}</p>}
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