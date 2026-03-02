import React, { useState, useEffect } from "react";
import Products from "./Products";
import Favorites from "./Favorites";
import Cart from "./Cart";
import Header from "./Header";
import Footer from "./Footer";

export default function Dashboard({ token, logout }) {
  const [page, setPage] = useState("products");
  const [targetSection, setTargetSection] = useState(null);

  const handleHeaderNavigation = (section) => {
    setTargetSection(section);
    
    // Mapeia as seções para as páginas correspondentes
    const sectionToPage = {
      '#produtos': 'products',
      '#salvos': 'favorites',
      '#carrinho': 'cart',
    };

    if (sectionToPage[section]) {
      setPage(sectionToPage[section]);
    }
  };

  useEffect(() => {
    if (targetSection) {
      if (targetSection === '#rodape') {
        const element = document.querySelector(targetSection);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
        return;
      }

      const element = document.querySelector(targetSection);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [page, targetSection]);

  return (
    
    <div className="flex flex-col min-h-screen" >
      {/* Header */}
      <section id="cabecalho" className="header">
        <Header onNavigation={handleHeaderNavigation} logout={logout} />
      </section>

      {/* Conteúdo principal */}
        {page === "products" && (
          <section id="produtos" className="products-section">
            <Products token={token} />
          </section>
        )}

        {page === "favorites" && (
          <section id="salvos" className="favorites-section">
            <Favorites token={token} />
          </section>
        )}

        {page === "cart" && (
          <section id="carrinho" className="cart-section">
            <Cart token={token} />
          </section>
        )}

        <section id="rodape" className="footer">
          <Footer token={token} />
        </section>

      {/* Login e Registro */}
      
    </div>
  );
}