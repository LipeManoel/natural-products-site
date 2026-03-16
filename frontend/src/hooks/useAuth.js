import { useState, useCallback } from 'react';

const API_BASE = 'http://localhost:5000/api/auth';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (endpoint, body) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro na requisição');
      }

      return data;
    } catch (err) {
      setError(err.message || 'Erro de conexão');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (username, password) => {
    const data = await request('login', { username, password });
    return data.token;
  }, [request]);

  const register = useCallback(async (username, password) => {
    const data = await request('register', { username, password });
    return data;
  }, [request]);

  return {
    login,
    register,
    loading,
    error,
  };
}