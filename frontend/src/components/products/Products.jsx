import { useEffect, useState, useCallback } from "react";
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
    removeFavorite,
    addToCart,
    loading,
  } = useShopActions(token);

  const showPopup = (text, type) => {
    setPopup({ text, type, visible: true });
    setTimeout(() => {
      setPopup((prev) => ({ ...prev, visible: false }));
    }, 3000);
  };

  const isProductFavorited = useCallback(
    (productId) => {
      return favorites.some(
        (f) => f.product_id === productId || f.product?.id === productId,
      );
    },
    [favorites],
  );

  // Carregar produtos
  useEffect(() => {
    fetchProducts().then(setProducts).catch(console.error);
  }, [fetchProducts]);

  // Carregar favoritos
  const loadFavorites = useCallback(async () => {
    if (!token) {
      setFavorites([]);
      return;
    }

    try {
      const data = await fetchFavorites();
      setFavorites(data || []);
    } catch (err) {
      console.error(err);
    }
  }, [token, fetchFavorites]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const handleToggleFavorite = async (productId) => {
    if (!token) {
      showPopup("Você precisa estar logado!", "error");
      return;
    }

    const isCurrentlyFavorited = isProductFavorited(productId);

    try {
      if (isCurrentlyFavorited) {
        const favToRemove = favorites.find(
          (f) => f.product_id === productId || f.product?.id === productId,
        );

        const favoriteId = favToRemove?.fav_id || favToRemove?.id;

        if (!favoriteId) {
          throw new Error("ID do favorito não encontrado para remoção.");
        }

        await removeFavorite(favoriteId);
        await loadFavorites();

        showPopup("Removido dos favoritos", "success");
      } else {
        await addToFavorites(productId);
        await loadFavorites();

        showPopup("Adicionado aos favoritos!", "success");
      }
    } catch (err) {
      console.error(err);
      showPopup("Erro ao atualizar favoritos", "error");
    }
  };

  const handleAddToCart = async (productId) => {
    if (!token) {
      showPopup("Você precisa estar logado!", "error");
      return;
    }

    try {
      await addToCart(productId);
      showPopup("Adicionado ao carrinho!", "success");
    } catch (err) {
      console.error(err);
      showPopup("Erro ao adicionar ao carrinho", "error");
    }
  };

  return (
    <>
      {popup.visible && (
        <div
          className={`popup ${popup.type} ${popup.visible ? "visible" : ""}`}
        >
          <span className="popup-text">{popup.text}</span>
        </div>
      )}

      <section className="shop">
        <div className="container">
          <div className="txt-shop-header">
            <h2 className="shop-title">Produtos</h2>
            <p className="shop-subtitle">Descubra nossos produtos naturais</p>
          </div>

          <div className="shop-grid">
            {products.map((p) => {
              const isFavorited = isProductFavorited(p.id);

              return (
                <div
                  key={p.id}
                  className="shop-card"
                  style={{ position: "relative" }}
                >
                  <button
                    onClick={() => handleToggleFavorite(p.id)}
                    className={`btn fixed btn-favorite ${isFavorited ? "active" : ""}`}
                    disabled={loading}
                  >
                    <span className="btn-icon-container">
                      <Heart fill={isFavorited ? "currentColor" : "none"} />
                    </span>
                  </button>

                  <img
                    src={`/images/products/${p.image}`}
                    alt={p.name}
                    className="product-image"
                  />

                  <div className="product-details">
                    <h4 className="product-name">{p.name}</h4>
                    <p className="product-description">{p.description}</p>

                    <div className="product-footer">
                      <span className="product-price">
                        R$ {Number(p.price).toFixed(2)}
                      </span>

                      <button
                        onClick={() => handleAddToCart(p.id)}
                        className="btn"
                      >
                        <ShoppingCart /> Carrinho
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
