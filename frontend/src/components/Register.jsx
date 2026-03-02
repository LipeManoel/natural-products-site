import React, { useState } from "react";

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

      <div className="register-section">
        <div className="register-container">
          <div className="register-card">
            <div className="register-brand">
              <h1 className="register-title">Registrar</h1>
              <p className="register-subtitle">Natura Pura</p>
            </div>

            <div className="register-form">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="register-input"
                />
              </div>
              <div className="input-group">
                <input
                  type="password"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="register-input"
                />
              </div>
              <button onClick={handleRegister} className="register-button">
                Registrar
              </button>
            </div>

            <div className="register-footer">
              <p>
                Já tem conta?{" "}
                <span className="register-login-link" onClick={() => setPage("login")}>
                  Faça login
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');

        .register-section {
          min-height: 100vh;
          background: linear-gradient(135deg, #ecc134b6 0%, #a0512dff 50%, #cd863fff 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .register-section::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: radial-gradient(circle at 30% 20%, rgba(255,248,220,0.1) 0%, transparent 50%),
                      radial-gradient(circle at 70% 80%, rgba(245,222,179,0.08) 0%, transparent 50%);
          pointer-events: none;
        }

        .register-container { position: relative; z-index: 1; width: 100%; max-width: 450px; }

        .register-card {
          background: rgba(255,255,255,0.95);
          border: 1px solid rgba(245,222,179,0.3);
          border-radius: 24px;
          padding: 3.5rem 3rem;
          box-shadow: 0 20px 60px rgba(0,0,0,0.2), 0 8px 32px rgba(160,81,45,0.1);
          backdrop-filter: blur(20px);
          position: relative;
          overflow: hidden;
          animation: fadeInUp 0.8s cubic-bezier(0.23,1,0.32,1);
        }

        .register-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; height: 4px;
          background: linear-gradient(135deg, #ecc134 0%, #a0512d 50%, #cd863f 100%);
          border-radius: 24px 24px 0 0;
        }

        .register-brand { text-align: center; margin-bottom: 3rem; }
        .register-title {
          font-family: 'Playfair Display', serif;
          font-size: 2.5rem;
          font-weight: 700;
          letter-spacing: -0.5px;
          background: linear-gradient(135deg, #a0512d 0%, #cd863f 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 0.5rem 0;
          line-height: 1.1;
        }
        .register-subtitle {
          font-family: 'Inter', sans-serif;
          font-size: 0.95rem;
          font-weight: 400;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: rgba(160,81,45,0.7);
          margin: 0;
        }

        .register-form { display: flex; flex-direction: column; gap: 1.75rem; }
        .input-group { position: relative; }
        .register-input {
          width: 100%;
          padding: 1.25rem 1.5rem;
          border: 2px solid rgba(160,81,45,0.15);
          border-radius: 16px;
          font-size: 1rem;
          font-family: 'Inter', sans-serif;
          font-weight: 400;
          background: rgba(255,255,255,0.8);
          color: #a0512d;
          transition: all 0.3s cubic-bezier(0.23,1,0.32,1);
          outline: none;
          box-sizing: border-box;
        }
        .register-input:focus {
          border-color: #a0512d;
          background: rgba(255,255,255,1);
          box-shadow: 0 0 0 4px rgba(160,81,45,0.1), 0 8px 24px rgba(160,81,45,0.1);
          transform: translateY(-1px);
        }
        .register-input::placeholder { color: rgba(160,81,45,0.5); font-size:0.95rem; }

        .register-button {
          width: 100%;
          padding: 1.25rem 2rem;
          background: linear-gradient(135deg, #a0512d 0%, #cd863f 50%, #ecc134 100%);
          color: #fff;
          border: none;
          border-radius: 16px;
          font-size: 1rem;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
          text-transform: uppercase;
          letter-spacing: 1px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.23,1,0.32,1);
          margin-top: 1rem;
          position: relative;
          overflow: hidden;
        }
        .register-button:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(160,81,45,0.3), 0 8px 16px rgba(0,0,0,0.1); }
        .register-button:active { transform: translateY(0); }

        .register-footer { text-align: center; margin-top: 2.5rem; padding-top: 2rem; border-top: 1px solid rgba(160,81,45,0.15); }
        .register-footer p { color: rgba(160,81,45,0.8); font-size:0.95rem; font-family:'Inter',sans-serif; margin:0; }
        .register-login-link {
          color: #a0512d;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          position: relative;
        }
        .register-login-link::after {
          content:'';
          position:absolute;
          width:0;
          height:2px;
          bottom:-2px;
          left:50%;
          background: linear-gradient(135deg, #a0512d, #cd863f);
          transition: all 0.3s ease;
          transform: translateX(-50%);
        }
        .register-login-link:hover::after { width:100%; }
        .register-login-link:hover { color:#cd863f; }

        /* Pop-up aprimorado */
        .popup {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%) translateY(-20px);
          padding: 1rem 1.5rem;
          border-radius: 12px;
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          font-size: 1rem;
          color: #fff;
          opacity: 0;
          pointer-events: none;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
          transition: all 0.4s ease;
          z-index: 9999;
        }
        .popup.visible {
          opacity: 1;
          pointer-events: auto;
          transform: translateX(-50%) translateY(0);
        }
        .popup.success { background: linear-gradient(135deg, #48bb78, #2f855a); }
        .popup.error { background: linear-gradient(135deg, #f56565, #c53030); }
        .popup-icon { font-size: 1.25rem; display: flex; align-items: center; }
        .popup-text { flex: 1; }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
