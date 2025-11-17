import { Container } from "react-bootstrap";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import "./Footer.css";

import rogerinho from "../../assets/images/mascote.png";

export default function Footer() {
  return (
    <footer className="footer">
      <Container className="footer-container">

        <p className="footer-copy">
          © {new Date().getFullYear()} <strong>Nutripet</strong> — Todos os direitos reservados.
        </p>

        <div className="footer-social-row">
          <a href="https://instagram.com/nutripetrj" target="_blank" rel="noopener noreferrer">
            <FaInstagram className="social-icon instagram" />
          </a>

          <a href="https://wa.me/553499999999" target="_blank" rel="noopener noreferrer">
            <FaWhatsapp className="social-icon whatsapp" />
          </a>
        </div>

      </Container>
      <a
        href="https://wa.me/553499999999"
        target="_blank"
        rel="noopener noreferrer"
        className="rogerinho-float"
      >
        <div className="pulse"></div>

        <div className="rogerinho-tooltip">Fale comigo!</div>

        <img src={rogerinho} alt="Fale com Rogerinho" className="rogerinho-img" />
      </a>
    </footer>
  );
}
