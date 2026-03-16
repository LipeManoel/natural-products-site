import { useEffect, useState } from "react";
import { Heart, ShoppingCart, Trash2, Loader2 } from "lucide-react";
import { CgSearchLoading } from "react-icons/cg";
import { useShopActions } from "@/hooks/useShopActions"; // ← agora usamos o hook unificado

import "@/styles/shop.css";

export default function Favorites({ token }) {
  const [favorites, setFavorites] = useState([]);
  const [popup, setPopup] = useState({ text: "", type: "", visible: false });

  const {
    fetchFavorites,
    removeFavorite,
    addToCart,
    loading,
    error,
  } = useShopActions(token);

   const showPopup = (text, type) => {
    setPopup({ text, type, visible: true });
    setTimeout(() => setPopup((prev) => ({ ...prev, visible: false })), 3000);
  };

  useEffect(() => {
    if (!token) {
      showPopup("Faça login para ver seus favoritos", "error");
      return;
    }

    fetchFavorites()
      .then(setFavorites)
      .catch(() => {
        showPopup("Não foi possível carregar os favoritos", "error");
      });
  }, [token, fetchFavorites]);

  const handleRemove = async (favId) => {
    try {
      await removeFavorite(favId);
      setFavorites((prev) => prev.filter((f) => f.fav_id !== favId));
      showPopup("Produto removido dos favoritos!", "success");
    } catch (err) {
      showPopup(error || "Erro ao remover favorito", "error");
    }
  };

  const handleAddToCart = async (productId) => {
    if (!productId) {
      showPopup("Produto não identificado", "error");
      return;
    }

    try {
      await addToCart(productId);
      showPopup("Adicionado ao carrinho com sucesso!", "success");
    } catch (err) {
      showPopup(error || "Erro ao adicionar ao carrinho", "error");
    }
  };

  if (loading && favorites.length === 0) {
    return (
      <div className="shop-container" style={{ textAlign: "center", padding: "4rem 2rem" }}>
        <Loader2
          size={48}
          style={{ animation: "spin 2s linear infinite", marginBottom: "1rem" }}
        />
        <p>Carregando seus favoritos...</p>
      </div>
    );
  }

  return (
    <>
      {/* Pop-up */}
      {popup.visible && (
        <div className={`popup ${popup.type} visible`} role="alert">
          {popup.text}
        </div>
      )}

      {error && <p className="error-global">{error}</p>}

      <section className="shop">
        <div className="container">
          <h2 className="shop-title">Meus Favoritos</h2>
          <p className="shop-subtitle">Produtos que você adorou</p>

          {favorites.length === 0 ? (
            <div className="shop-nothing">
              <CgSearchLoading className="nothing-icon" aria-hidden="true" />
              <p>Nenhum favorito ainda.</p>
            </div>
          ) : (
            <div className="shop-grid">
              {favorites.map((f) => (
                <div key={f.fav_id} className="shop-card">
                  <div className="favorite-indicator">
                    <Heart size={14} fill="currentColor" />
                  </div>

                  <img
                    src={`/images/products/${f.image}`}
                    alt={f.name}
                    className="shop-image"
                    onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                  />

                  <div className="shop-content">
                    <h4 className="shop-name">{f.name}</h4>
                    <p className="shop-description">{f.description}</p>

                    <div className="shop-buttons">
                      <button
                        onClick={() => handleAddToCart(f.product_id || f.id)}
                        className="shop-btn shop-btn-cart"
                        disabled={loading}
                      >
                        <ShoppingCart size={16} /> Carrinho
                      </button>

                      <button
                        onClick={() => handleRemove(f.fav_id)}
                        className="shop-btn shop-btn-remove"
                        disabled={loading}
                      >
                        <Trash2 size={16} /> Remover
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}