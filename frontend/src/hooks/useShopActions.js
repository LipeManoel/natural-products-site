import { useState, useCallback } from 'react';

const API_BASE = 'http://localhost:5000/api';

export function useShopActions(token) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Função centralizada para requisições autenticadas
  const authenticatedRequest = useCallback(async (endpoint, options = {}) => {
    if (!token) throw new Error('Autenticação necessária');

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          ...options.headers,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || 'Erro na operação');
      }

      return data;
    } catch (err) {
      setError(err.message || 'Erro de conexão');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);


  // Produtos (público – sem autenticação)

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/products`);
      const data = await res.json();
      if (!res.ok) throw new Error('Erro ao carregar produtos');
      return data;
    } finally {
      setLoading(false);
    }
  }, []);


  // Favoritos

  const fetchFavorites = useCallback(async () => {
    const data = await authenticatedRequest('favorites');
    return Array.isArray(data) ? data : [];
  }, [authenticatedRequest]);

  const addToFavorites = useCallback(async (productId) => {
    return authenticatedRequest('favorites', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity: 1 }),
    });
  }, [authenticatedRequest]);

  const removeFavorite = useCallback(async (favId) => {
    await authenticatedRequest(`favorites/${favId}`, { method: 'DELETE' });
  }, [authenticatedRequest]);

  const addToCartFromFavorite = useCallback(async (productId) => {
    await authenticatedRequest('cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity: 1 }),
    });
  }, [authenticatedRequest]);

  // Carrinho
  
const fetchCart = useCallback(async () => {
  const data = await authenticatedRequest('cart');
  return Array.isArray(data) ? data : [];
}, [authenticatedRequest]);

const addToCart = useCallback(async (productId, quantity = 1) => {
  return authenticatedRequest('cart', {
    method: 'POST',
    body: JSON.stringify({ productId, quantity }),
  });
}, [authenticatedRequest]);

const removeFromCart = useCallback(async (cartId) => {
  await authenticatedRequest(`cart/${cartId}`, { method: 'DELETE' });
}, [authenticatedRequest]);

const updateQuantity = useCallback(async (cartId, productId, newQuantity) => {
  if (newQuantity <= 0) {
    await removeFromCart(cartId);
    return;
  }

  try {
    await removeFromCart(cartId);

    await addToCart(productId, newQuantity);

    return { success: true };
  } catch (err) {
    throw err;
  }
}, [removeFromCart, addToCart]);

  return {
    
    fetchProducts,
    
    fetchFavorites,
    addToFavorites,
    removeFavorite,
    addToCartFromFavorite,

    fetchCart,
    addToCart,
    removeFromCart,
    updateQuantity,

    
    loading,
    error,
  };
}