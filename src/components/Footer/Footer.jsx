import { useState } from "react";
import { Container } from "react-bootstrap";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import "./Footer.css";

import rogerinho from "../../assets/images/mascote.png";

export default function Footer() {
  const [showConfirm, setShowConfirm] = useState(false);

  const whatsappUrl = "https://wa.me/553499999999";

  const abrirWhatsapp = () => {
    window.open(whatsappUrl, "_blank");
    setShowConfirm(false);
  };

  return (
    <>
      {/* === POPUP DE CONFIRMAÇÃO === */}
      {showConfirm && (
        <div className="nutri-modal-overlay">
          <div className="nutri-modal-card">

            <h3 className="nutri-modal-title">Abrir WhatsApp?</h3>

            <p className="nutri-modal-text">
              Você será redirecionado para uma conversa no WhatsApp auxiliada pelo nosso mascote virtual Rogerinho.
              Deseja continuar?
            </p>

            <div className="nutri-modal-actions">
              <button className="nutri-btn-cancel" onClick={() => setShowConfirm(false)}>
                Cancelar
              </button>

              <button className="nutri-btn-confirm" onClick={abrirWhatsapp}>
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* === FOOTER === */}
      <footer className="footer">
        <Container className="footer-container">

          <p className="footer-copy">
            © {new Date().getFullYear()} <strong>Nutripet</strong> — Todos os direitos reservados.
          </p>

          <div className="footer-social-row">
            <a href="https://instagram.com/nutripetrj" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="social-icon instagram" />
            </a>

            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <FaWhatsapp className="social-icon whatsapp" />
            </a>
          </div>

        </Container>

        <button
          className="rogerinho-float"
          onClick={() => setShowConfirm(true)}
        >
          <div className="pulse"></div>
          <div className="rogerinho-tooltip">Fale comigo no WhatsApp!</div>
          <img src={rogerinho} alt="Fale com Rogerinho" className="rogerinho-img" />
        </button>
      </footer>
    </>
  );
}
