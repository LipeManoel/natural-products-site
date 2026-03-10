import { useEffect, useState } from "react";
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
import "@/styles/shop.css";
import { CgSearchLoading } from "react-icons/cg";

export default function Cart({ token }) {
  const [cart, setCart] = useState([]);
  const [popup, setPopup] = useState({ text: "", type: "", visible: false });

  const showPopup = (text, type = "success") => {
    setPopup({ text, type, visible: true });
    setTimeout(() => setPopup({ text: "", type, visible: false }), 3000);
  };

  const fetchCart = async () => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCart(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      showPopup("Erro ao carregar o carrinho.", "error");
    }
  };

  const removeFromCart = async (cartId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/cart/${cartId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erro ao remover");
      setCart((prev) => prev.filter((item) => item.cart_id !== cartId));
      showPopup("Item removido do carrinho!", "success");
    } catch (err) {
      showPopup("Erro ao remover item.", "error");
    }
  };

  const changeQuantity = async (cartId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity <= 0) return removeFromCart(cartId);

    try {
      // Lógica simplificada (ajuste conforme seu backend real)
      await fetch(`http://localhost:5000/api/cart/${cartId}`, {
        method: "PATCH", // se seu backend suportar PATCH, senão use DELETE + POST
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });
      await fetchCart();
      showPopup(change > 0 ? "Quantidade aumentada!" : "Quantidade diminuída!", "success");
    } catch (err) {
      showPopup("Erro ao alterar quantidade.", "error");
    }
  };

  const getTotalPrice = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

  useEffect(() => {
    fetchCart();
  }, [token]);

  return (
    <>
      {popup.visible && (
        <div
          className={`popup ${popup.type} visible`}
          role="alert"
          aria-live="assertive"
        >
          {popup.text}
        </div>
      )}

      <section className="shop" aria-labelledby="carrinho-heading">
        <div className="container">
          <h2 id="carrinho-heading" className="shop-title">Meu Carrinho</h2>
          <p className="shop-subtitle">Seus produtos selecionados</p>

          {cart.length === 0 ? (
            <div className="shop-nothing">
              <CgSearchLoading className="nothing-icon" aria-hidden="true" />
              <p>Seu carrinho está vazio.</p>
            </div>
          ) : (
            <>
              <div className="shop-grid" role="list">
                {cart.map((c) => (
                  <article key={c.cart_id} className="shop-card" role="group">
                    <img
                      src={`/images/products/${c.image}`}
                      alt={`Produto ${c.name} - ${c.description}`}
                      className="shop-image"
                    />
                    <div className="shop-content">
                      <h3 className="shop-name">{c.name}</h3>
                      <p className="shop-description">{c.description}</p>

                      <div className="shop-quantity-section">
                        <span className="shop-quantity-label">Quantidade:</span>
                        <div className="shop-quantity-controls">
                          <button
                            className="shop-quantity-btn"
                            onClick={() => changeQuantity(c.cart_id, c.quantity, -1)}
                            aria-label="Diminuir quantidade"
                          >
                            <Minus size={16} aria-hidden="true" />
                          </button>
                          <span className="shop-quantity-display" aria-live="polite">
                            {c.quantity}
                          </span>
                          <button
                            className="shop-quantity-btn"
                            onClick={() => changeQuantity(c.cart_id, c.quantity, 1)}
                            aria-label="Aumentar quantidade"
                          >
                            <Plus size={16} aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <p className="shop-price">R$ {(c.price * c.quantity).toFixed(2)}</p>

                      <div className="shop-buttons">
                        <button
                          onClick={() => removeFromCart(c.cart_id)}
                          className="shop-btn shop-btn-remove"
                          aria-label={`Remover ${c.name} do carrinho`}
                        >
                          <Trash2 size={16} aria-hidden="true" /> Remover
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="shop-total" role="region" aria-live="polite">
                <h3 className="shop-total-title">Total do Pedido</h3>
                <p className="shop-total-price">R$ {getTotalPrice()}</p>
                <button
                  className="shop-checkout-btn shop-btn"
                  aria-label={`Finalizar compra no valor de R$ ${getTotalPrice()}`}
                >
                  <ShoppingCart size={18} aria-hidden="true" /> Finalizar Compra
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
