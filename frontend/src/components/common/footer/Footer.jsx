import { Facebook, Instagram, MessageCircle } from "lucide-react";

import './footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content-wrapper">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Natura Pura</h3>
              <p>Produtos 100% naturais para uma vida mais saudável e sustentável.</p>
              <p>Qualidade garantida desde 2020.</p>
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
              <a href="#">contato@naturapura.com.br</a>
              <a href="#">(49) 99999-9999</a>
              <a href="#">Lages, Santa Catarina</a>
              
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
              © {new Date().getFullYear()} <span className="footer-brand">Natura Pura</span>. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}