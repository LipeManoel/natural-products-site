import { useEffect, useState } from "react";
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
import { CgSearchLoading } from "react-icons/cg";
import { useShopActions } from "@/hooks/useShopActions";

import "@/styles/shop.css";

export default function Cart({ token }) {
  const [cart, setCart] = useState([]);
  const [popup, setPopup] = useState({ text: "", type: "", visible: false });

  const {
    fetchCart,
    removeFromCart,
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
      showPopup("Faça login para ver o carrinho", "error");
      return;
    }

    fetchCart()
      .then(setCart)
      .catch(() => showPopup("Não foi possível carregar o carrinho", "error"));
  }, [token, fetchCart]);

  const handleRemove = async (cartId) => {
    try {
      await removeFromCart(cartId);
      setCart((prev) => prev.filter((item) => item.cart_id !== cartId));
      showPopup("Item removido com sucesso!", "success");
    } catch (err) {
      showPopup(error || "Erro ao remover item", "error");
    }
  };

  const handleChangeQuantity = async (cartId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;

    if (newQuantity <= 0) {
      await handleRemove(cartId);
      return;
    }

    try {
      // Encontra o item para pegar o product_id (ou id)
      const item = cart.find((i) => i.cart_id === cartId);
      if (!item?.id) {
        showPopup("Erro interno: produto não identificado", "error");
        return;
      }

      await removeFromCart(cartId);

      await addToCart(item.id, newQuantity);

      const updatedCart = await fetchCart();
      setCart(updatedCart);

      showPopup(
        change > 0 ? "Quantidade aumentada!" : "Quantidade reduzida!",
        "success"
      );
    } catch (err) {
      console.error("Erro ao atualizar quantidade:", err);
      showPopup("Não foi possível atualizar a quantidade", "error");
      fetchCart().then(setCart);
    }
  };

  const getTotalPrice = () =>
    cart
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);

  if (loading && cart.length === 0) {
    return (
      <div className="loading-container">
        <p>Carregando seu carrinho...</p>
      </div>
    );
  }

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
          <h2 id="carrinho-heading" className="shop-title">
            Meu Carrinho
          </h2>
          <p className="shop-subtitle">Seus produtos selecionados</p>

          {error && <p className="error-global">{error}</p>}

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
                      onError={(e) => (e.target.src = "/images/placeholder.jpg")}
                    />
                    <div className="shop-content">
                      <h4 className="shop-name">{c.name}</h4>
                      <p className="shop-description">{c.description}</p>

                      <div className="shop-quantity-section">
                        <span className="shop-quantity-label">Quantidade:</span>
                        <div className="shop-quantity-controls">
                          <button
                            className="shop-quantity-btn"
                            onClick={() =>
                              handleChangeQuantity(c.cart_id, c.quantity, -1)
                            }
                            disabled={loading}
                            aria-label="Diminuir quantidade"
                          >
                            <Minus size={16} aria-hidden="true" />
                          </button>
                          <span
                            className="shop-quantity-display"
                            aria-live="polite"
                          >
                            {c.quantity}
                          </span>
                          <button
                            className="shop-quantity-btn"
                            onClick={() =>
                              handleChangeQuantity(c.cart_id, c.quantity, 1)
                            }
                            disabled={loading}
                            aria-label="Aumentar quantidade"
                          >
                            <Plus size={16} aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <p className="shop-price">
                        R$ {(c.price * c.quantity).toFixed(2)}
                      </p>

                      <div className="shop-buttons">
                        <button
                          onClick={() => handleRemove(c.cart_id)}
                          className="shop-btn shop-btn-remove"
                          disabled={loading}
                          aria-label={`Remover ${c.name} do carrinho`}
                        >
                          <Trash2 size={16} aria-hidden="true" /> Remover
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="shop-total" role="region">
                <h3 className="shop-total-title">Total do Pedido</h3>
                <h3 className="shop-total-price">R$ {getTotalPrice()}</h3>
                <button
                  className="shop-checkout-btn shop-btn"
                  disabled={loading || cart.length === 0}
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