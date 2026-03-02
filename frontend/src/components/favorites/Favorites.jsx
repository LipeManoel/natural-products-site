import { useEffect, useState } from "react";
import { Heart, ShoppingCart, Trash2, Loader2 } from "lucide-react";
import "@/styles/shop.css";
import { CgSearchLoading } from "react-icons/cg";

export default function Favorites({ token }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({ text: "", type: "", visible: false }); // pop-up state

  // Carregar favoritos
  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetch("http://localhost:5000/api/favorites", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setFavorites(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Erro ao buscar favoritos:", err);
        setFavorites([]);
        showPopup("Erro ao carregar favoritos.", "error");
      })
      .finally(() => setLoading(false));
  }, [token]);

  // Mostrar pop-up
  const showPopup = (text, type) => {
    setPopup({ text, type, visible: true });
    setTimeout(() => setPopup({ text: "", type, visible: false }), 3000);
  };

  // Remover favorito
  const removeFavorite = async (favId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/favorites/${favId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok)
        return showPopup(json.message || "Erro ao remover favorito", "error");

      setFavorites((prev) => prev.filter((f) => f.fav_id !== favId));
      showPopup("Produto removido dos favoritos!", "success");
    } catch (err) {
      console.error("Erro ao remover favorito:", err);
      showPopup("Erro de rede ao remover favorito.", "error");
    }
  };

  // Adicionar ao carrinho
  const addToCart = async (productId) => {
    try {
      const res = await fetch("http://localhost:5000/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      const data = await res.json();
      showPopup(data.message || "Adicionado ao carrinho!", "success");
    } catch (err) {
      console.error("Erro ao adicionar ao carrinho:", err);
      showPopup("Erro ao adicionar ao carrinho.", "error");
    }
  };

  if (loading) {
    return (
      <div
        className="shop-container"
        style={{ textAlign: "center", padding: "4rem 2rem" }}
      >
        <Loader2
          size={48}
          style={{ animation: "spin 2s linear infinite", marginBottom: "1rem" }}
        />
        Carregando favoritos...
      </div>
    );
  }

  return (
    <>
      {/* Pop-up */}
      {popup.visible && (
        <div className={`popup ${popup.type} visible`}>{popup.text}</div>
      )}
      <section className="shop">
        <div className="container">
          <h2 className="shop-title">Meus Favoritos</h2>
          <p className="shop-subtitle">Produtos que você adorou</p>

          {favorites.length === 0 ? (
            <div className="shop-nothing">
              <CgSearchLoading classname ="nothing-icon"/>
              Nenhum favorito ainda.
            </div>
          ) : (
            <div className="shop-grid">
              {favorites.map((f) => (
                <div key={f.fav_id} className="shop-card">
                  <div className="favorite-indicator">
                    <Heart size={14} fill="currentColor" />
                  </div>
                  <img
                    src={f.image ? `/images/products/${f.image}` : f.image}
                    alt={f.name}
                    className="shop-image"
                  />
                  <div className="shop-content">
                    <h3 className="shop-name">{f.name}</h3>
                    <p className="shop-description">{f.description}</p>

                    <div className="shop-buttons">
                      <button
                        onClick={() => addToCart(f.product_id || f.id)}
                        className="shop-btn shop-btn-cart"
                      >
                        <ShoppingCart size={16} /> Carrinho
                      </button>
                      <button
                        onClick={() => removeFavorite(f.fav_id)}
                        className="shop-btn shop-btn-remove"
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
