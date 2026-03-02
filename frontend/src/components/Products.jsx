import React, { useEffect, useState } from "react";
import { Heart, ShoppingCart } from "lucide-react";

import "@/index.css"

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
    setTimeout(() => setPopup(prev => ({ ...prev, visible: false })), 3000);
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
      setFavorites(prev => [...prev, { product_id: productId }]);
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

      <div className="products-section">
        <div className="products-container">
          <h2 className="products-title">Produtos</h2>
          <p className="products-subtitle">Descubra nossos produtos naturais</p>
          <div className="products-grid">
            {products.map((p, idx) => {
              const isFavorited = favorites.some(f => f.product_id === p.id);
              return (
                <div key={p.id} className="products-card">
                  {isFavorited && <div className="favorited-indicator"><Heart size={20} /></div>}
                  <img src={`/images/products/${p.image}`} alt={p.name} className="products-image" />
                  <div className="products-content">
                    <h3 className="products-name">{p.name}</h3>
                    <p className="products-description">{p.description}</p>
                    <p className="products-price">R$ {p.price}</p>
                    <div className="products-buttons">
                      {!isFavorited && (
                        <button
                          onClick={() => addToFavorites(p.id)}
                          className="products-btn products-btn-favorite"
                        >
                          <Heart size={16} />
                          Favorito
                        </button>
                      )}
                      <button
                        onClick={() => addToCart(p.id)}
                        className="products-btn products-btn-cart"
                      >
                        <ShoppingCart size={16} />
                        Carrinho
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        

        .products-section { 
          background: linear-gradient(135deg, #f8f5e8 0%, #f0ede0 50%, #e8e3d3 100%);
          min-height: 100vh;
          padding: 3rem 2rem;
        }

        .products-container { max-width: 1280px; margin: 0 auto; }

        .products-title { 
          font-family: 'Playfair Display', serif;
          font-size: 2.5rem; font-weight: 700; color: #A0522D; text-align: center; margin-bottom: 0.5rem; letter-spacing: -0.5px; position: relative;
        }

        .products-title::after { 
          content: ''; position: absolute; bottom: -0.25rem; left: 50%; transform: translateX(-50%); width: 60px; height: 2px; background: #CD853F; border-radius: 1px;
        }

        .products-subtitle {
          font-family: 'Inter', sans-serif; font-size: 0.95rem; font-weight: 400; letter-spacing: 2px; text-transform: uppercase; color: rgba(160,82,45,0.7); text-align: center; margin-bottom: 3rem;
        }

        .products-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px,1fr)); gap: 2.5rem; }

        .products-card { 
          background: linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,248,220,0.8) 100%);
          border: 1px solid rgba(160,82,45,0.2); border-radius: 20px; overflow: hidden; position: relative; transition: all 0.4s cubic-bezier(0.23,1,0.32,1); backdrop-filter: blur(10px); box-shadow: 0 10px 30px rgba(160,82,45,0.1);
          animation: fadeInUp 0.6s ease-out; animation-fill-mode: both;
        }

        .products-card:hover { transform: translateY(-8px) scale(1.02); box-shadow: 0 20px 50px rgba(160,82,45,0.2); border-color: rgba(160,82,45,0.4); }
        .products-image { width: 100%; height: 240px; object-fit: cover; transition: all 0.4s; filter: brightness(1.05) saturate(1.1); }
        .products-card:hover .products-image { transform: scale(1.1); filter: brightness(1.1) saturate(1.2); }

        .products-content { padding: 2rem 1.5rem; }
        .products-name { font-family: 'Playfair Display', serif; font-size: 1.375rem; font-weight: 600; color: #A0522D; margin-bottom:0.75rem; text-transform: capitalize; letter-spacing:-0.3px; line-height:1.3; }
        .products-description { color: rgba(160,82,45,0.7); font-family:'Inter',sans-serif; font-size:0.95rem; margin-bottom:1.5rem; line-height:1.6; font-weight:400; }
        .products-price { color:#A0522D; font-family:'Inter',sans-serif; font-size:1.5rem; font-weight:700; margin-bottom:2rem; position:relative; }
        .products-price::before { content:''; position:absolute; bottom:-0.5rem; left:0; width:50px; height:2px; background: linear-gradient(135deg,#CD853F 0%,#D2B48C 100%); border-radius:1px; }

        .products-buttons { display:flex; gap:1rem; flex-wrap:wrap; }
        .products-btn { flex:1; min-width:120px; padding:1rem 1.5rem; border:none; border-radius:25px; font-family:'Inter',sans-serif; font-size:0.9rem; font-weight:600; text-transform:uppercase; cursor:pointer; transition: all 0.3s; position:relative; overflow:hidden; display:flex; align-items:center; justify-content:center; gap:0.5rem; letter-spacing:0.5px; }
        .products-btn-favorite { background: linear-gradient(135deg,#ECC134 0%,#D4AC0D 100%); color:#fff; border:1px solid rgba(255,255,255,0.2); }
        .products-btn-favorite:hover { background: linear-gradient(135deg,#D4AC0D 0%,#B7950B 100%); transform: translateY(-2px); }
        .products-btn-cart { background: linear-gradient(135deg,#A0522D 0%,#8B4513 100%); color:#fff; border:1px solid rgba(255,255,255,0.2); }
        .products-btn-cart:hover { background: linear-gradient(135deg,#8B4513 0%,#654321 100%); transform: translateY(-2px); }

        .favorited-indicator { position:absolute; top:1rem; right:1rem; background:linear-gradient(135deg,#ECC134 0%,#D4AC0D 100%); color:#fff; padding:0.6rem 0.7rem; border-radius:25%; box-shadow:0 4px 15px rgba(236,193,52,0.4); backdrop-filter:blur(10px); z-index:10; }

        /* Pop-up */
        .popup { position: fixed; top:20px; left:50%; transform: translateX(-50%) translateY(-20px); padding:1rem 1.5rem; border-radius:12px; font-family:'Inter',sans-serif; font-weight:500; font-size:1rem; color:#fff; opacity:0; pointer-events:none; display:flex; align-items:center; gap:0.75rem; box-shadow:0 8px 24px rgba(0,0,0,0.15); transition: all 0.4s ease; z-index:9999; }
        .popup.visible { opacity:1; pointer-events:auto; transform: translateX(-50%) translateY(0); }
        .popup.success { background: linear-gradient(135deg,#48bb78,#2f855a); }
        .popup.error { background: linear-gradient(135deg,#f56565,#c53030); }
        .popup-icon { font-size:1.25rem; display:flex; align-items:center; }
        .popup-text { flex:1; }

        /* Animação fadeInUp */
        @keyframes fadeInUp { from { opacity:0; transform: translateY(30px);} to{opacity:1; transform: translateY(0);} }
      `}</style>
    </>
  );
}
