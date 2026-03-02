import React, { useState, useEffect } from "react";
import { LogOut, ShoppingCart, Heart } from "lucide-react";

export default function Header({ onNavigation, logout }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavClick = (section, event) => {
    event.preventDefault();
    setIsMobileMenuOpen(false);

    if (section === '#sair') {
      logout();
      return;
    }

    if (onNavigation) {
      onNavigation(section);
    }

    // Rolagem suave com compensação do header
    const target = document.querySelector(section);
    if (target) {
      const headerOffset = 120; // altura do header fixa
      const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');

        .header {
          position: sticky;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
        }

        .header-background {
          background: linear-gradient(135deg, #ecc134b6 0%, #a0512dff 50%, #cd863fff 100%);
          color: #FFF8DC;
          box-shadow: ${isScrolled 
            ? '0 5px 30px rgba(0, 0, 0, 0.5)' 
            : '0 5px 20px rgba(0, 0, 0, 0.3)'};
          backdrop-filter: blur(10px);
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
          padding: ${isScrolled ? '16px 32px' : '24px 32px'};
        }

        .header-container {
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .header-brand {
          display: flex;
          align-items: center;
          gap: 20px;
          transition: all 0.3s ease;
        }

        .logo-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.32));
          padding: 6px;
          backdrop-filter: blur(10px);
        }

        .logo {
          max-height: 45px;
          width: auto;
          filter: drop-shadow(0 2px 10px rgba(0, 0, 0, 0.1));
        }

        .brand-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .header-title {
          font-family: 'Playfair Display', serif;
          font-size: ${isScrolled ? '28px' : '32px'};
          font-weight: 700;
          letter-spacing: -0.5px;
          background: #FFF8DC;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
          line-height: 1;
          transition: all 0.3s ease;
        }

        .header-subtitle {
          font-family: 'Inter', sans-serif;
          font-size: ${isScrolled ? '12px' : '14px'};
          font-weight: 400;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(245, 222, 179, 0.9);
          margin: 0;
          transition: all 0.3s ease;
        }

        .header-nav {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .header-nav-item {
          font-family: 'Inter', sans-serif;
          color: #F5DEB3;
          text-decoration: none;
          font-size: 15px;
          font-weight: 500;
          padding: 12px 20px;
          border-radius: 25px;
          transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(245, 222, 179, 0.2);
        }

        .header-nav-item:hover {
          color: #FFFFFF;
          transform: translateY(-1px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
          border-color: rgba(245, 222, 179, 0.4);
          background: rgba(255, 255, 255, 0.12);
        }

        .nav-icon {
          width: 18px;
          height: 18px;
        }

        .mobile-menu-toggle {
          display: none;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(245, 222, 179, 0.3);
          color: #F5DEB3;
          font-size: 20px;
          cursor: pointer;
          padding: 12px 16px;
          border-radius: 12px;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .mobile-menu-toggle:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.05);
        }

        .mobile-nav {
          display: none;
          position: absolute;
          top: 100%;
          left: 32px;
          right: 32px;
          background: #A0522D;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          padding: 24px;
          margin-top: 16px;
          opacity: 0;
          transform: translateY(-20px);
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .mobile-nav.open {
          opacity: 1;
          transform: translateY(0);
        }

        .mobile-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #F5DEB3;
          text-decoration: none;
          font-family: 'Inter', sans-serif;
          font-size: 16px;
          font-weight: 500;
          padding: 16px 24px;
          border-radius: 15px;
          margin-bottom: 8px;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(245, 222, 179, 0.1);
        }

        .mobile-nav-item:hover {
          color: #FFFFFF;
          background: rgba(255, 255, 255, 0.15);
          transform: scale(1.02);
        }

        .mobile-nav-item:last-child {
          margin-bottom: 0;
        }

        @media (max-width: 768px) {
          .header-nav {
            display: none;
          }
          .mobile-menu-toggle {
            display: block;
          }
          .mobile-nav {
            display: block;
          }
        }

        @media (max-width: 480px) {
          .mobile-nav {
            left: 16px;
            right: 16px;
            padding: 20px;
          }
        }

        /* Scroll suave com header fixo */
        section {
          scroll-margin-top: 120px; /* altura do header */
        }

      `}</style>

      <header className="header">
        <div className="header-background">
          <div className="header-container">
            <div className="header-brand" onClick={() => onNavigation && onNavigation('#produtos')}>
              <div className="logo-container">
                <img src="/images/logo.png" alt="Logo." className="logo" />
              </div>
              <div className="brand-text">
                <h1 className="header-title">Natura Pura</h1>
                <p className="header-subtitle">100% Natural</p>
              </div>
            </div>

            <nav className="header-nav">
              <a href="#produtos" className="header-nav-item" onClick={(e) => handleNavClick('#produtos', e)}>
                Início
              </a>
              <a href="#salvos" className="header-nav-item" onClick={(e) => handleNavClick('#salvos', e)}>
                <Heart className="nav-icon heart-icon" />
                Favoritos
              </a>
              <a href="#carrinho" className="header-nav-item" onClick={(e) => handleNavClick('#carrinho', e)}>
                <ShoppingCart className="nav-icon" />
                Carrinho
              </a>
              <a href="#sair" className="header-nav-item" onClick={(e) => handleNavClick('#sair', e)}>
                <LogOut className="nav-icon" />
                Sair
              </a>
            </nav>

            <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>

          <nav className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
            <a href="#produtos" className="mobile-nav-item" onClick={(e) => handleNavClick('#produtos', e)}>
              Início
            </a>
            <a href="#salvos" className="mobile-nav-item" onClick={(e) => handleNavClick('#salvos', e)}>
              <Heart className="nav-icon heart-icon" />
              Favoritos
            </a>
            <a href="#carrinho" className="mobile-nav-item" onClick={(e) => handleNavClick('#carrinho', e)}>
              <ShoppingCart className="nav-icon" />
              Carrinho
            </a>
            <a href="#sair" className="mobile-nav-item" onClick={(e) => handleNavClick('#sair', e)}>
              <LogOut className="nav-icon" />
              Sair
            </a>
          </nav>
        </div>
      </header>
    </>
  );
}
