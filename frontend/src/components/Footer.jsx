import React from "react";
import { Facebook, Instagram, MessageCircle } from "lucide-react";

import "@/index.css"

export default function Footer() {
  return (
    <>
      <style jsx>{`
       

        .footer {
          position: relative;
          background: linear-gradient(135deg, #ecc134b6 0%, #a0512dff 50%, #cd863fff 100%);
          border-top: 1px solid rgba(255, 255, 255, 0.2);
        }

        .footer-container {
          width: 100%;
          background: linear-gradient(135deg, #8B4513 0%, #A0522D 50%, #CD853F 100%);
          color: #FFF8DC;
        }

        .footer-content-wrapper {
          max-width: 1200px;
          margin: 0 auto;
          padding: 4rem 2rem 2.5rem;
        }

        .footer-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 3rem;
          margin-bottom: 3rem;
        }

        .footer-section h3 {
          font-family: 'Playfair Display', serif;
          font-size: 1.25rem;
          font-weight: 600;
          color: #FFF8DC;
          text-transform: none;
          letter-spacing: -0.5px;
          margin-bottom: 1.5rem;
          position: relative;
        }

        .footer-section h3::after {
          content: '';
          position: absolute;
          bottom: -0.5rem;
          left: 0;
          width: 40px;
          height: 2px;
          background: linear-gradient(90deg, rgba(255, 248, 220, 0.8) 0%, rgba(255, 248, 220, 0.3) 100%);
          border-radius: 1px;
        }

        .footer-section p {
          color: rgba(245, 222, 179, 0.9);
          font-family: 'Inter', sans-serif;
          font-size: 0.9rem;
          line-height: 1.7;
          margin-bottom: 0.75rem;
          font-weight: 400;
        }

        .footer-section a {
          color: rgba(245, 222, 179, 0.8);
          font-family: 'Inter', sans-serif;
          font-size: 0.9rem;
          line-height: 1.6;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
          display: block;
          margin-bottom: 0.75rem;
          padding: 8px 0;
          border-radius: 6px;
          position: relative;
        }

        .footer-section a:hover {
          color: #FFF8DC;
          transform: translateX(4px);
        }

        .footer-section a:hover::before {
          width: 20px;
        }

        .footer-social {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
          flex-wrap: wrap;
        }

        .footer-social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
          margin-bottom: 0;
          color: rgba(245, 222, 179, 0.9);
          text-decoration: none;
          transform: translateX(0);
        }

        .footer-bottom {
          text-align: center;
          padding: 2rem 0;
          border-top: 1px solid rgba(245, 222, 179, 0.2);
          background: rgba(0, 0, 0, 0.1);
        }

        .footer-copyright {
          color: rgba(245, 222, 179, 0.8);
          font-family: 'Inter', sans-serif;
          font-size: 0.85rem;
          letter-spacing: 0.5px;
          font-weight: 400;
          margin: 0;
        }

        .footer-brand {
          color: #FFF8DC;
          font-weight: 600;
          font-family: 'Playfair Display', serif;
          letter-spacing: -0.2px;
        }

        .footer-description {
          font-style: italic;
          color: rgba(245, 222, 179, 0.7);
          margin-top: 0.5rem;
        }

        /* Animações */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .footer-section {
          animation: fadeInUp 0.6s ease-out;
        }

        .footer-section:nth-child(2) {
          animation-delay: 0.1s;
        }

        .footer-section:nth-child(3) {
          animation-delay: 0.2s;
        }

        .footer-bottom {
          animation: fadeInUp 0.6s ease-out 0.3s both;
        }

        /* Responsividade */
        @media (max-width: 768px) {
          .footer-content-wrapper {
            padding: 3rem 1.5rem 2rem;
          }

          .footer-content {
            grid-template-columns: 1fr;
            gap: 2.5rem;
            text-align: center;
            margin-bottom: 2.5rem;
          }

          .footer-section h3::after {
            left: 50%;
            transform: translateX(-50%);
          }

          .footer-social {
            justify-content: center;
          }

          .footer-section a:hover {
            transform: translateX(0) scale(1.02);
          }

          .footer-copyright {
            font-size: 0.8rem;
          }
        }

        @media (max-width: 480px) {
          .footer-content-wrapper {
            padding: 2.5rem 1rem 1.5rem;
          }

          .footer-content {
            gap: 2rem;
            margin-bottom: 2rem;
          }

          .footer-section h3 {
            font-size: 1.1rem;
          }

          .footer-section p,
          .footer-section a {
            font-size: 0.85rem;
          }

          .footer-social-link {
            width: 40px;
            height: 40px;
          }

          .footer-bottom {
            padding: 1.5rem 0;
          }
        }
      `}</style>
      
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content-wrapper">
            <div className="footer-content">
              <div className="footer-section">
                <h3>Natura Pura</h3>
                <p>Produtos 100% naturais para uma vida mais saudável e sustentável.</p>
                <p className="footer-description">Qualidade garantida desde 2020.</p>
              </div>

              <div className="footer-section">
                <h3>Links Úteis</h3>
                <a href="#produtos">Produtos</a>
                <a href="#sobre">Sobre Nós</a>
                <a href="#contato">Contato</a>
                <a href="#politica">Política de Privacidade</a>
              </div>

              <div className="footer-section">
                <h3>Contato</h3>
                <p>contato@naturapura.com.br</p>
                <p>(49) 99999-9999</p>
                <p>Lages, Santa Catarina</p>
                
                <div className="footer-social">
                  <a href="#" title="Facebook" className="footer-social-link">
                    <Facebook size={20} />
                  </a>
                  <a href="#" title="Instagram" className="footer-social-link">
                    <Instagram size={20} />
                  </a>
                  <a href="#" title="WhatsApp" className="footer-social-link">
                    <MessageCircle size={20} />
                  </a>
                </div>
              </div>
            </div>

            <div className="footer-bottom">
              <p className="footer-copyright">
                &copy; {new Date().getFullYear()} <span className="footer-brand">Natura Pura</span>. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}