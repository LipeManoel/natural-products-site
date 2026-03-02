import { useEffect, useState } from "react";
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
import "@/styles/shop.css";

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

  // ==================== REMOVER ====================
  const removeFromCart = async (cartId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/cart/${cartId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Erro ao remover item");

      setCart((prev) => prev.filter((item) => item.cart_id !== cartId));
      showPopup("Item removido do carrinho!", "success");
    } catch (err) {
      console.error(err);
      showPopup("Erro ao remover item.", "error");
    }
  };

  // ==================== AUMENTAR / DIMINUIR ====================
  const changeQuantity = async (cartId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;

    if (newQuantity <= 0) {
      await removeFromCart(cartId);
      return;
    }

    try {
      // 1. Remove o item atual
      await fetch(`http://localhost:5000/api/cart/${cartId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      // 2. Re-insere com a nova quantidade (o backend soma automaticamente se já existir)
      const productId = cart.find((item) => item.cart_id === cartId)?.id; // pega o product_id

      await fetch("http://localhost:5000/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity: newQuantity }),
      });

      // Atualiza a tela
      await fetchCart();

      showPopup(
        change > 0 ? "Quantidade aumentada!" : "Quantidade diminuída!",
        "success",
      );
    } catch (err) {
      console.error(err);
      showPopup("Erro ao alterar quantidade.", "error");
      await fetchCart(); // recarrega caso dê erro parcial
    }
  };

  const getTotalPrice = () =>
    cart
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);

  useEffect(() => {
    fetchCart();
  }, [token]);

  return (
    <>
      {popup.visible && (
        <div className={`popup ${popup.type} visible`}>{popup.text}</div>
      )}
      <section className="shop">
        <div className="container">
          <h2 className="shop-title">Meu Carrinho</h2>
          <p className="shop-subtitle">Seus produtos selecionados</p>

          {cart.length === 0 ? (
            <div className="shop-nothing">
              Seu carrinho está vazio.
            </div>
          ) : (
            <>
              <div className="shop-grid">
                {cart.map((c) => (
                  <div key={c.cart_id} className="shop-card">
                    <img
                      src={`/images/products/${c.image}`}
                      alt={c.name}
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
                            onClick={() =>
                              changeQuantity(c.cart_id, c.quantity, -1)
                            }
                          >
                            <Minus size={16} />
                          </button>
                          <span className="shop-quantity-display">
                            {c.quantity}
                          </span>
                          <button
                            className="shop-quantity-btn"
                            onClick={() =>
                              changeQuantity(c.cart_id, c.quantity, +1)
                            }
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>

                      <p className="shop-price">
                        R$ {(c.price * c.quantity).toFixed(2)}
                      </p>

                      <div className="shop-buttons">
                        <button
                          onClick={() => removeFromCart(c.cart_id)}
                          className="shop-btn shop-btn-remove"
                        >
                          <Trash2 size={16} /> Remover
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="shop-total">
                <h3 className="shop-total-title">Total do Pedido</h3>
                <p className="shop-total-price">R$ {getTotalPrice()}</p>
                <button className="shop-checkout-btn shop-btn">
                  <ShoppingCart size={18} /> Finalizar Compra
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
