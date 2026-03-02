import { useEffect, useState } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import "@/styles/shop.css";

export default function Products({ token }) {
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [popup, setPopup] = useState({ text: "", type: "", visible: false });

  // Carregar produtos
  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then(setProducts);
  }, []);

  // Carregar favoritos do usuário
  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:5000/api/favorites", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setFavorites);
  }, [token]);

  // Pop-up
  const showPopup = (text, type) => {
    setPopup({ text, type, visible: true });
    setTimeout(() => setPopup((prev) => ({ ...prev, visible: false })), 3000);
  };

  // Adicionar produto aos favoritos
  const addToFavorites = async (productId) => {
    if (!token) return showPopup("Você precisa estar logado!", "error");

    const res = await fetch("http://localhost:5000/api/favorites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId, quantity: 1 }),
    });
    const data = await res.json();

    if (data.success) {
      setFavorites((prev) => [...prev, { product_id: productId }]);
      showPopup("Produto adicionado aos favoritos!", "success");
    } else {
      showPopup(data.message || "Erro ao adicionar favorito", "error");
    }
  };

  // Adicionar produto ao carrinho
  const addToCart = async (productId) => {
    if (!token) return showPopup("Você precisa estar logado!", "error");

    const res = await fetch("http://localhost:5000/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId, quantity: 1 }),
    });
    const data = await res.json();

    if (data.success) {
      showPopup("Produto adicionado ao carrinho!", "success");
    } else {
      showPopup(data.message || "Erro ao adicionar ao carrinho", "error");
    }
  };

  return (
    <>
      {/* Pop-up */}
      <div className={`popup ${popup.type} ${popup.visible ? "visible" : ""}`}>
        <span className="popup-text">{popup.text}</span>
      </div>

      <div className="shop-section">
        <div className="shop-container">
          <h2 className="shop-title">Produtos</h2>
          <p className="shop-subtitle">Descubra nossos produtos naturais</p>

          <div className="shop-grid">
            {products.map((p) => {
              const isFavorited = favorites.some((f) => f.product_id === p.id);
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
                  />
                  <div className="shop-content">
                    <h3 className="shop-name">{p.name}</h3>
                    <p className="shop-description">{p.description}</p>
                    <p className="shop-price">R$ {p.price}</p>

                    <div className="shop-buttons">
                      {!isFavorited && (
                        <button
                          onClick={() => addToFavorites(p.id)}
                          className="shop-btn shop-btn-favorite"
                        >
                          <Heart size={16} /> Favorito
                        </button>
                      )}
                      <button
                        onClick={() => addToCart(p.id)}
                        className="shop-btn shop-btn-cart"
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
      </div>
    </>
  );
}
