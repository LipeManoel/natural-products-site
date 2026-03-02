import React, { useState } from "react";

export default function Login({ setPage, setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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
      alert(data.error);
    }
  };

  return (
    <>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');

        .login-section {
          min-height: 100vh;
          background: linear-gradient(135deg, #ecc134b6 0%, #a0512dff 50%, #cd863fff 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .login-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 30% 20%, rgba(255, 248, 220, 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 70% 80%, rgba(245, 222, 179, 0.08) 0%, transparent 50%);
          pointer-events: none;
        }

        .login-container {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 450px;
        }

        .login-card {
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(245, 222, 179, 0.3);
          border-radius: 24px;
          padding: 3.5rem 3rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2), 
                      0 8px 32px rgba(160, 81, 45, 0.1);
          backdrop-filter: blur(20px);
          position: relative;
          overflow: hidden;
        }

        .login-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(135deg, #ecc134 0%, #a0512d 50%, #cd863f 100%);
          border-radius: 24px 24px 0 0;
        }

        .login-brand {
          text-align: center;
          margin-bottom: 3rem;
        }

        .login-title {
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

        .login-subtitle {
          font-family: 'Inter', sans-serif;
          font-size: 0.95rem;
          font-weight: 400;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: rgba(160, 81, 45, 0.7);
          margin: 0;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        .input-group {
          position: relative;
        }

        .login-input {
          width: 100%;
          padding: 1.25rem 1.5rem;
          border: 2px solid rgba(160, 81, 45, 0.15);
          border-radius: 16px;
          font-size: 1rem;
          font-family: 'Inter', sans-serif;
          font-weight: 400;
          background: rgba(255, 255, 255, 0.8);
          color: #a0512d;
          transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
          outline: none;
          box-sizing: border-box;
        }

        .login-input:focus {
          border-color: #a0512d;
          background: rgba(255, 255, 255, 1);
          box-shadow: 0 0 0 4px rgba(160, 81, 45, 0.1),
                      0 8px 24px rgba(160, 81, 45, 0.1);
          transform: translateY(-1px);
        }

        .login-input::placeholder {
          color: rgba(160, 81, 45, 0.5);
          font-size: 0.95rem;
          font-weight: 400;
          letter-spacing: 0.5px;
        }

        .login-button {
          width: 100%;
          padding: 1.25rem 2rem;
          background: linear-gradient(135deg, #a0512d 0%, #cd863f 50%, #ecc134 100%);
          color: #ffffff;
          border: none;
          border-radius: 16px;
          font-size: 1rem;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
          text-transform: uppercase;
          letter-spacing: 1px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
          margin-top: 1rem;
          position: relative;
          overflow: hidden;
        }

        .login-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(160, 81, 45, 0.3),
                      0 8px 16px rgba(0, 0, 0, 0.1);
        }

        .login-button:hover::before {
          left: 100%;
        }

        .login-button:active {
          transform: translateY(0);
        }

        .login-footer {
          text-align: center;
          margin-top: 2.5rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(160, 81, 45, 0.15);
        }

        .login-footer p {
          color: rgba(160, 81, 45, 0.8);
          font-size: 0.95rem;
          font-family: 'Inter', sans-serif;
          font-weight: 400;
          margin: 0;
        }

        .login-register-link {
          color: #a0512d;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.3s ease;
          position: relative;
        }

        .login-register-link::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: -2px;
          left: 50%;
          background: linear-gradient(135deg, #a0512d, #cd863f);
          transition: all 0.3s ease;
          transform: translateX(-50%);
        }

        .login-register-link:hover {
          color: #cd863f;
        }

        .login-register-link:hover::after {
          width: 100%;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .login-section {
            padding: 1.5rem;
            min-height: 100vh;
          }

          .login-card {
            padding: 2.5rem 2rem;
          }

          .login-title {
            font-size: 2rem;
            margin-bottom: 1rem;
          }

          .login-subtitle {
            font-size: 0.85rem;
          }

          .login-form {
            gap: 1.5rem;
          }

          .login-input {
            padding: 1.125rem 1.25rem;
            font-size: 0.95rem;
          }

          .login-button {
            padding: 1.125rem 1.75rem;
            font-size: 0.95rem;
          }
        }

        @media (max-width: 480px) {
          .login-section {
            padding: 1rem;
          }

          .login-card {
            padding: 2rem 1.5rem;
          }

          .login-title {
            font-size: 1.75rem;
          }

          .login-brand {
            margin-bottom: 2rem;
          }

          .login-input {
            padding: 1rem 1.125rem;
          }

          .login-button {
            padding: 1rem 1.5rem;
          }
        }

        /* Animação de entrada */
        .login-card {
          animation: fadeInUp 0.8s cubic-bezier(0.23, 1, 0.32, 1);
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      
      <div className="login-section">
        <div className="login-container">
          <div className="login-card">
            <div className="login-brand">
              <h1 className="login-title">Login</h1>
              <p className="login-subtitle">Natura Pura</p>
            </div>
            
            <div className="login-form">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="login-input"
                />
              </div>
              <div className="input-group">
                <input
                  type="password"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="login-input"
                />
              </div>
              <button onClick={handleLogin} className="login-button">
                Entrar
              </button>
            </div>

            <div className="login-footer">
              <p>
                Não tem conta?{" "}
                <span className="login-register-link" onClick={() => setPage("register")}>
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