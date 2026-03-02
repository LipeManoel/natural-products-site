import { useEffect, useState } from "react";
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react";

export default function Cart({ token }) {
  const [cart, setCart] = useState([]);
  const [popup, setPopup] = useState({ text: "", type: "", visible: false }); // pop-up

  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:5000/api/cart", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setCart)
      .catch((err) => {
        console.error(err);
        showPopup("Erro ao carregar o carrinho.", "error");
      });
  }, [token]);

  const showPopup = (text, type = "success") => {
    setPopup({ text, type, visible: true });
    setTimeout(() => setPopup({ text: "", type, visible: false }), 3000);
  };

  const removeFromCart = async (cartId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/cart/${cartId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok) return showPopup(json.message || "Erro ao remover item", "error");

      setCart(cart.filter((item) => item.cart_id !== cartId));
      showPopup("Item removido do carrinho!", "success");
    } catch (err) {
      console.error(err);
      showPopup("Erro de rede ao remover item.", "error");
    }
  };

  const updateQuantity = async (cartId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartId);
      return;
    }
    try {
      await fetch(`http://localhost:5000/api/cart/${cartId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });
      setCart(
        cart.map((item) =>
          item.cart_id === cartId ? { ...item, quantity: newQuantity } : item
        )
      );
      showPopup("Quantidade atualizada!", "success");
    } catch (err) {
      console.error(err);
      showPopup("Erro ao atualizar quantidade!", "error");
    }
  };

  const getTotalPrice = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

  return (
    <>
      {/* Pop-up */}
      {popup.visible && (
        <div className={`popup ${popup.type} visible`}>
          {popup.text}
        </div>
      )}

      <style jsx>{`
        /* ===== Seu CSS do carrinho já existente ===== */
        .cart-container { max-width:1280px; margin:0 auto; padding:3rem 2rem; }
        .cart-title { font-family:'Playfair Display', serif; font-size:2.5rem; font-weight:700; color:#A0522D; text-align:center; margin-bottom:0.5rem; position:relative; letter-spacing:-0.5px; }
        .cart-subtitle { font-family:'Inter',sans-serif; font-size:0.95rem; font-weight:400; letter-spacing:2px; text-transform:uppercase; color:rgba(160,82,45,0.7); text-align:center; margin-bottom:3rem; }
        .cart-title::after { content:''; position:absolute; bottom:-0.25rem; left:50%; transform:translateX(-50%); width:60px; height:2px; background:#CD853F; border-radius:1px; }
        .cart-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:2.5rem; margin-bottom:2rem; }
        .cart-card { background:linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,248,220,0.8) 100%); border:1px solid rgba(160,82,45,0.2); border-radius:20px; overflow:hidden; position:relative; transition: all 0.4s; backdrop-filter:blur(10px); box-shadow:0 10px 30px rgba(160,82,45,0.1); }
        .cart-card:hover { transform:translateY(-8px) scale(1.02); box-shadow:0 20px 50px rgba(160,82,45,0.2); border-color: rgba(160,82,45,0.4); }
        .cart-image { width:100%; height:240px; object-fit:cover; transition: all 0.4s; filter:brightness(1.05) saturate(1.1); }
        .cart-card:hover .cart-image { transform:scale(1.1); filter:brightness(1.1) saturate(1.2); }
        .cart-content { padding:2rem 1.5rem; }
        .cart-name { font-family:'Playfair Display', serif; font-size:1.375rem; font-weight:600; color:#A0522D; margin-bottom:0.75rem; text-transform:capitalize; letter-spacing:-0.3px; line-height:1.3; }
        .cart-description { color: rgba(160,82,45,0.7); font-family:'Inter',sans-serif; font-size:0.95rem; margin-bottom:1.5rem; line-height:1.6; font-weight:400; }
        .cart-quantity-section { display:flex; align-items:center; justify-content:space-between; margin-bottom:1.5rem; padding:1rem; background: rgba(255,255,255,0.6); border:1px solid rgba(160,82,45,0.15); border-radius:15px; backdrop-filter:blur(10px); }
        .cart-quantity-label { font-family:'Inter',sans-serif; font-weight:500; color:#A0522D; font-size:0.95rem; }
        .cart-quantity-controls { display:flex; align-items:center; gap:0.75rem; }
        .cart-quantity-btn { width:36px; height:36px; border:1px solid rgba(160,82,45,0.3); background:linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,248,220,0.8)); color:#A0522D; border-radius:50%; font-size:1.1rem; font-weight:600; cursor:pointer; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(10px); transition: all 0.3s; }
        .cart-quantity-btn:hover { background:linear-gradient(135deg, #A0522D 0%, #8B4513 100%); color:#fff; transform:scale(1.1); border-color: rgba(160,82,45,0.5); }
        .cart-quantity-display { font-family:'Inter',sans-serif; font-weight:700; color:#A0522D; font-size:1.1rem; min-width:28px; text-align:center; padding:0.5rem; background: rgba(255,255,255,0.8); border-radius:10px; border:1px solid rgba(160,82,45,0.2); }
        .cart-price { color:#A0522D; font-family:'Inter',sans-serif; font-size:1.5rem; font-weight:700; margin-bottom:2rem; }
        .cart-buttons { display:flex; gap:1rem; flex-wrap:wrap; }
        .cart-btn { flex:1; min-width:120px; padding:1rem 1.5rem; border:none; border-radius:25px; font-family:'Inter',sans-serif; font-size:0.9rem; font-weight:600; text-transform:uppercase; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:0.5rem; transition: all 0.3s; }
        .cart-btn-remove { background:linear-gradient(135deg,#dc2626 0%,#b91c1c 100%); color:#fff; border:1px solid rgba(255,255,255,0.2); }
        .cart-btn-remove:hover { background:linear-gradient(135deg,#b91c1c 0%,#991b1b 100%); transform:translateY(-2px); }
        .cart-total { background:linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,248,220,0.9) 100%); border:1px solid rgba(160,82,45,0.2); border-radius:25px; padding:3rem 2rem; box-shadow:0 15px 40px rgba(160,82,45,0.15); text-align:center; margin-top:3rem; backdrop-filter:blur(15px); }
        .cart-total-title { font-family:'Playfair Display', serif; font-size:1.75rem; font-weight:600; color:#A0522D; margin-bottom:1.5rem; letter-spacing:-0.3px; }
        .cart-total-price { font-family:'Inter',sans-serif; font-size:2.5rem; font-weight:700; color:#A0522D; margin-bottom:2rem; }
        .cart-checkout-btn { background:linear-gradient(135deg,#A0522D 0%,#8B4513 100%); color:#fff; padding:1.25rem 2.5rem; border:none; border-radius:25px; font-family:'Inter',sans-serif; font-size:1.1rem; font-weight:600; text-transform:uppercase; letter-spacing:1px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:0.75rem; margin:0 auto; transition: all 0.3s; }
        .cart-checkout-btn:hover { background:linear-gradient(135deg,#8B4513 0%,#654321 100%); transform:translateY(-3px); }

        /* ===== Pop-up do carrinho igual aos favoritos ===== */
        .popup { position: fixed; top:20px; left:50%; transform:translateX(-50%); padding:1rem 1.5rem; border-radius:12px; font-family:'Inter',sans-serif; font-weight:500; font-size:1rem; color:#fff; opacity:0; pointer-events:none; transition: all 0.4s ease; z-index:9999; }
        .popup.visible { opacity:1; pointer-events:auto; }
        .popup.success { background: linear-gradient(135deg,#48bb78,#2f855a); }
        .popup.error { background: linear-gradient(135deg,#f56565,#c53030); }
      `}</style>

      <div className="cart-container">
        <h2 className="cart-title">Meu Carrinho</h2>
        <p className="cart-subtitle">Seus produtos selecionados</p>

        {cart.length === 0 ? (
          <div style={{textAlign:"center", color:"rgba(160,82,45,0.7)"}}>Seu carrinho está vazio.</div>
        ) : (
          <>
            <div className="cart-grid">
              {cart.map((c) => (
                <div key={c.cart_id} className="cart-card">
                  <img
                    src={`/images/products/${c.image}`}
                    alt={c.name}
                    className="cart-image"
                  />
                  <div className="cart-content">
                    <h3 className="cart-name">{c.name}</h3>
                    <p className="cart-description">{c.description}</p>

                    <div className="cart-quantity-section">
                      <span className="cart-quantity-label">Quantidade:</span>
                      <div className="cart-quantity-controls">
                        <button className="cart-quantity-btn" onClick={() => updateQuantity(c.cart_id, c.quantity - 1)}>
                          <Minus size={16} />
                        </button>
                        <span className="cart-quantity-display">{c.quantity}</span>
                        <button className="cart-quantity-btn" onClick={() => updateQuantity(c.cart_id, c.quantity + 1)}>
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>

                    <p className="cart-price">R$ {(c.price * c.quantity).toFixed(2)}</p>

                    <div className="cart-buttons">
                      <button onClick={() => removeFromCart(c.cart_id)} className="cart-btn cart-btn-remove">
                        <Trash2 size={16} /> Remover
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-total">
              <h3 className="cart-total-title">Total do Pedido</h3>
              <p className="cart-total-price">R$ {getTotalPrice()}</p>
              <button className="cart-checkout-btn">
                <ShoppingCart size={18} /> Finalizar Compra
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
