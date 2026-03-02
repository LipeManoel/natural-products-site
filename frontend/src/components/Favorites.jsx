import React, { useEffect, useState } from "react";
import { Heart, ShoppingCart, Trash2, Loader2 } from "lucide-react";

import "@/index.css"

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
      if (!res.ok) return showPopup(json.message || "Erro ao remover favorito", "error");

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
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
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
      <>
        <style jsx>{`
          

          .favorites-loading {
            max-width: 1280px;
            margin: 0 auto;
            padding: 4rem 2rem;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            color: #A0522D;
            font-family: 'Inter', sans-serif;
          }

          .loading-spinner {
            margin-bottom: 1.5rem;
            animation: spin 2s linear infinite;
          }

          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
        <div className="favorites-loading">
          <Loader2 className="loading-spinner" size={48} />
          Carregando favoritos...
        </div>
      </>
    );
  }

  return (
    <>
      {/* Pop-up */}
      {popup.visible && (
        <div className={`popup ${popup.type} visible`}>
          {popup.text}
        </div>
      )}

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');

        .favorites-container { max-width: 1280px; margin: 0 auto; padding: 3rem 2rem; }
        .favorites-title { font-family: 'Playfair Display', serif; font-size: 2.5rem; font-weight: 700; color: #A0522D; text-align: center; margin-bottom: 0.5rem; position: relative; letter-spacing: -0.5px; }
        .favorites-subtitle { font-family: 'Inter', sans-serif; font-size: 0.95rem; font-weight: 400; letter-spacing: 2px; text-transform: uppercase; color: rgba(160, 82, 45, 0.7); text-align: center; margin-bottom: 3rem; }
        .favorites-title::after { content: ''; position: absolute; bottom: -0.25rem; left: 50%; transform: translateX(-50%); width: 60px; height: 2px; background: #CD853F; border-radius: 1px; }

        .favorites-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2.5rem; margin-bottom: 2rem; }
        .favorites-card { background: linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,248,220,0.8) 100%); border:1px solid rgba(160,82,45,0.2); border-radius:20px; overflow:hidden; position:relative; transition: all 0.4s; backdrop-filter: blur(10px); box-shadow:0 10px 30px rgba(160,82,45,0.1); animation: fadeInUp 0.6s ease-out; animation-fill-mode: both; }
        .favorites-card:nth-child(1){animation-delay:0.1s;} .favorites-card:nth-child(2){animation-delay:0.2s;} .favorites-card:nth-child(3){animation-delay:0.3s;}
        .favorites-card:hover { transform: translateY(-8px) scale(1.02); box-shadow: 0 20px 50px rgba(160,82,45,0.2); border-color: rgba(160,82,45,0.4); }
        .favorites-image { width:100%; height:240px; object-fit:cover; transition: all 0.4s; filter: brightness(1.05) saturate(1.1); }
        .favorites-card:hover .favorites-image { transform: scale(1.1); filter: brightness(1.1) saturate(1.2); }
        .favorites-content { padding: 2rem 1.5rem; }
        .favorites-name { font-family:'Playfair Display', serif; font-size:1.375rem; font-weight:600; color:#A0522D; margin-bottom:0.75rem; text-transform:capitalize; letter-spacing:-0.3px; line-height:1.3; }
        .favorites-description { color: rgba(160,82,45,0.7); font-family:'Inter',sans-serif; font-size:0.95rem; margin-bottom:1.5rem; line-height:1.6; font-weight:400; }
        .favorites-buttons { display:flex; gap:1rem; flex-wrap:wrap; }
        .favorites-btn { flex:1; min-width:120px; padding:1rem 1.5rem; border:none; border-radius:25px; font-family:'Inter',sans-serif; font-size:0.9rem; font-weight:600; text-transform:uppercase; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:0.5rem; transition: all 0.3s; }
        .favorites-btn-cart { background: linear-gradient(135deg, #A0522D 0%, #8B4513 100%); color:#fff; border:1px solid rgba(255,255,255,0.2); }
        .favorites-btn-cart:hover { background: linear-gradient(135deg,#8B4513 0%,#654321 100%); transform: translateY(-2px); }
        .favorites-btn-remove { background: linear-gradient(135deg,#dc2626 0%,#b91c1c 100%); color:#fff; border:1px solid rgba(255,255,255,0.2); }
        .favorites-btn-remove:hover { background: linear-gradient(135deg,#b91c1c 0%,#991b1b 100%); transform: translateY(-2px); }
        .favorite-indicator { position:absolute; top:1rem; right:1rem; background: linear-gradient(135deg,#ECC134 0%,#D4AC0D 100%); color:#fff; font-family:'Inter',sans-serif; font-weight:600; padding:0.5rem 1rem; border-radius:20px; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.5px; box-shadow:0 4px 15px rgba(236,193,52,0.4); backdrop-filter: blur(10px); display:flex; align-items:center; gap:0.5rem; }

        /* Pop-up */
        .popup { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); padding:1rem 1.5rem; border-radius:12px; font-family:'Inter',sans-serif; font-weight:500; font-size:1rem; color:#fff; opacity:0; pointer-events:none; transition: all 0.4s ease; z-index:9999; }
        .popup.visible { opacity:1; pointer-events:auto; }
        .popup.success { background: linear-gradient(135deg,#48bb78,#2f855a); }
        .popup.error { background: linear-gradient(135deg,#f56565,#c53030); }

        @keyframes fadeInUp { from { opacity:0; transform: translateY(30px);} to { opacity:1; transform: translateY(0); } }
      `}</style>

      <div className="favorites-container">
        <h2 className="favorites-title">Meus Favoritos</h2>
        <p className="favorites-subtitle">Produtos que você adorou</p>

        {favorites.length === 0 ? (
          <div style={{textAlign:"center", color:"rgba(160,82,45,0.7)"}}>Nenhum favorito ainda.</div>
        ) : (
          <div className="favorites-grid">
            {favorites.map((f) => (
              <div key={f.fav_id} className="favorites-card">
                <div className="favorite-indicator">
                  <Heart size={14} fill="currentColor" />
                  Favorito
                </div>
                <img src={f.image ? `/images/products/${f.image}` : f.image} alt={f.name} className="favorites-image" />
                <div className="favorites-content">
                  <h3 className="favorites-name">{f.name}</h3>
                  <p className="favorites-description">{f.description}</p>

                  <div className="favorites-buttons">
                    <button onClick={() => addToCart(f.product_id || f.id)} className="favorites-btn favorites-btn-cart">
                      <ShoppingCart size={16} /> Carrinho
                    </button>
                    <button onClick={() => removeFavorite(f.fav_id)} className="favorites-btn favorites-btn-remove">
                      <Trash2 size={16} /> Remover
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
