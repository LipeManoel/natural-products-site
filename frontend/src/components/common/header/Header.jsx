import { useState, useEffect } from "react";
import { LogOut, ShoppingCart, Heart } from "lucide-react";
import "./header.css";

export default function Header({ onNavigation, logout }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleNavClick = (section, event) => {
    event.preventDefault();
    setIsMobileMenuOpen(false);

    if (section === "#sair") {
      logout();
      return;
    }

    onNavigation?.(section);
  };

  return (
    <header className="header">
      <div className={`header-background ${isScrolled ? "scrolled" : ""}`}>
        <div className="container">
          <div
            className="header-brand"
            onClick={() => onNavigation?.("#produtos")}
          >
            <div className="logo-container">
              <img src="/images/logo.png" alt="Natura Pura" className="logo" />
            </div>
            <div className="brand-text">
              <h3 className={`header-title ${isScrolled ? "scrolled" : ""}`}>
                Natura Pura
              </h3>
            </div>
          </div>

          <nav className="header-nav">
            <span className="nav-container">
              <a
                href="#produtos"
                className="header-nav-item"
                onClick={(e) => handleNavClick("#produtos", e)}
              >
                Início
              </a>
            </span>

            <span className="nav-container">
              <a
                href="#salvos"
                className="header-nav-item"
                onClick={(e) => handleNavClick("#salvos", e)}
              >
                <Heart className="nav-icon" />
                Favoritos
              </a>
            </span>

            <span className="nav-container">
              <a
                href="#carrinho"
                className="header-nav-item"
                onClick={(e) => handleNavClick("#carrinho", e)}
              >
                <ShoppingCart className="nav-icon" />
                Carrinho
              </a>
            </span>

            <span className="nav-container">
              <a
                href="#sair"
                className="header-nav-item"
                onClick={(e) => handleNavClick("#sair", e)}
              >
                <LogOut className="nav-icon" />
                Sair
              </a>
            </span>
          </nav>

          <button
            type="button"
            className="mobile-menu-toggle"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        <nav className={`mobile-nav ${isMobileMenuOpen ? "open" : ""}`}>
          <a
            href="#produtos"
            className="mobile-nav-item"
            onClick={(e) => handleNavClick("#produtos", e)}
          >
            Início
          </a>

          <a
            href="#salvos"
            className="mobile-nav-item"
            onClick={(e) => handleNavClick("#salvos", e)}
          >
            <Heart className="nav-icon" />
            Favoritos
          </a>

          <a
            href="#carrinho"
            className="mobile-nav-item"
            onClick={(e) => handleNavClick("#carrinho", e)}
          >
            <ShoppingCart className="nav-icon" />
            Carrinho
          </a>

          <a
            href="#sair"
            className="mobile-nav-item"
            onClick={(e) => handleNavClick("#sair", e)}
          >
            <LogOut className="nav-icon" />
            Sair
          </a>
        </nav>
      </div>
    </header>
  );
}