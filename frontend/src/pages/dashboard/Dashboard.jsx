import { useState, useEffect } from "react";
import Products from "../../components/products/Products";
import Favorites from "../../components/favorites/Favorites";
import Cart from "../../components/cart/Cart";
import Header from "../../components/common/header/Header";
import Footer from "../../components/common/footer/Footer";

export default function Dashboard({ token, logout }) {
  const [page, setPage] = useState("products");
  const [targetSection, setTargetSection] = useState(null);

  const handleHeaderNavigation = (section) => {
    setTargetSection(section);
    
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
      const element = document.querySelector(targetSection);
      if (element) {
        const headerOffset = 120;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }
  }, [targetSection]);

  return (
    <div className="flex flex-col min-h-screen">
      <header id="cabecalho" className="header">
        <Header onNavigation={handleHeaderNavigation} logout={logout} />
      </header>

      <main id="conteudo-principal" tabIndex="-1">
        {page === "products" && (
          <section id="produtos" aria-labelledby="produtos-heading">
            <Products token={token} />
          </section>
        )}

        {page === "favorites" && (
          <section id="salvos" aria-labelledby="favoritos-heading">
            <Favorites token={token} />
          </section>
        )}

        {page === "cart" && (
          <section id="carrinho" aria-labelledby="carrinho-heading">
            <Cart token={token} />
          </section>
        )}
      </main>

      <footer id="rodape" className="footer">
        <Footer />
      </footer>
    </div>
  );
}