import { useEffect, useState } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { useShopActions } from "@/hooks/useShopActions";

import "@/styles/shop.css";

export default function Products({ token }) {
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [popup, setPopup] = useState({ text: "", type: "", visible: false });

  const {
    fetchProducts,
    fetchFavorites,
    addToFavorites,
    addToCart,
    loading,
    error,
  } = useShopActions(token);

   const showPopup = (text, type) => {
    setPopup({ text, type, visible: true });
    setTimeout(() => setPopup((prev) => ({ ...prev, visible: false })), 3000);
  };

  // Carregar produtos (público)
  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(() => showPopup("Não foi possível carregar os produtos", "error"));
  }, [fetchProducts]);

  // Carregar favoritos (só se logado)
  useEffect(() => {
    if (!token) return;
    fetchFavorites()
      .then(setFavorites)
      .catch(() => showPopup("Erro ao carregar favoritos", "error"));
  }, [token, fetchFavorites]);

  const handleAddToFavorites = async (productId) => {
    if (!token) {
      showPopup("Você precisa estar logado!", "error");
      return;
    }

    try {
      await addToFavorites(productId);
      setFavorites((prev) => [...prev, { product_id: productId }]);
      showPopup("Produto adicionado aos favoritos!", "success");
    } catch (err) {
      showPopup(error || "Erro ao adicionar aos favoritos", "error");
    }
  };

  const handleAddToCart = async (productId) => {
    if (!token) {
      showPopup("Você precisa estar logado!", "error");
      return;
    }

    try {
      await addToCart(productId);
      showPopup("Produto adicionado ao carrinho!", "success");
    } catch (err) {
      showPopup(error || "Erro ao adicionar ao carrinho", "error");
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className="loading-container">
        <p>Carregando produtos...</p>
      </div>
    );
  }

  return (
    <>
      {/* Pop-up */}
      {popup.visible && (
        <div className={`popup ${popup.type} ${popup.visible ? "visible" : ""}`}>
          <span className="popup-text">{popup.text}</span>
        </div>
      )}

      {error && <div className="global-error">Erro: {error}</div>}

      <section className="shop">
        <div className="container">
          <h2 className="shop-title">Produtos</h2>
          <p className="shop-subtitle">Descubra nossos produtos naturais</p>

          <div className="shop-grid">
            {products.map((p) => {
              const isFavorited = favorites.some(
                (f) => f.product_id === p.id || f.id === p.id
              );

              return (
                <div key={p.id} className="shop-card">
                  {isFavorited && (
                    <div className="favorited-indicator">
                      <Heart size={20} fill="currentColor" />
                    </div>
                  )}

                  <img
                    src={`/images/products/${p.image}`}
                    alt={p.name}
                    className="shop-image"
                    onError={(e) => (e.target.src = "/images/placeholder.jpg")}
                  />

                  <div className="shop-content">
                    <h4 className="shop-name">{p.name}</h4>
                    <p className="shop-description">{p.description}</p>
                    <p className="shop-price">
                      R$ {Number(p.price).toFixed(2)}
                    </p>

                    <div className="shop-buttons">
                      {!isFavorited && (
                        <button
                          onClick={() => handleAddToFavorites(p.id)}
                          className="shop-btn"
                          disabled={loading}
                        >
                          <Heart size={16} /> Favorito
                        </button>
                      )}

                      <button
                        onClick={() => handleAddToCart(p.id)}
                        className="shop-btn"
                        disabled={loading}
                      >
                        <ShoppingCart size={16} /> Carrinho
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}