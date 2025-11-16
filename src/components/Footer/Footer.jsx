import React from 'react';
import { Container } from 'react-bootstrap';
import './Footer.css';
import dogFooter from '../../assets/images/footer_image.jpg'; 

export default function Footer() {
  return (
    <footer className="footer py-4">
      <Container className="footer-container">
        <div className="footer-content">
          <img src={dogFooter} alt="Dog Nutripet" className="footer-dog" />
          <div className="footer-text">
            <p className="m-0 text-secondary">
              © {new Date().getFullYear()} <strong>Nutripet</strong> — Todos os direitos reservados.
            </p>
            <p className="small mt-1">
              Desenvolvido por <span className="text-brown">Nutripet Team</span>
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}