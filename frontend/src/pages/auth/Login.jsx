import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

import './auth.css';

export default function Login({ setPage, setToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [popup, setPopup] = useState({ text: '', type: '', visible: false });

  const { login, loading, error } = useAuth();

  const showPopup = (text, type) => {
    setPopup({ text, type, visible: true });
    setTimeout(() => setPopup((prev) => ({ ...prev, visible: false })), 3000);
  };

  const handleLogin = async () => {
    if (!username.trim() || !password) {
      showPopup('Preencha usuário e senha', 'error');
      return;
    }

    try {
      const token = await login(username, password);
      setToken(token);
      setPage('products');
      showPopup('Login realizado com sucesso!', 'success');
    } catch (err) {
      showPopup(error || 'Usuário ou senha inválidos', 'error');
    }
  };

  return (
    <>
      {/* Pop-up */}
      <div className={`popup ${popup.type} ${popup.visible ? 'visible' : ''}`}>
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
                onClick={handleLogin}
                className="auth-button"
                disabled={loading}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>

              {error && <p className="error-message">{error}</p>}
            </div>

            <div className="auth-footer">
              <p>
                Não tem conta?{' '}
                <span className="auth-link" onClick={() => setPage('register')}>
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