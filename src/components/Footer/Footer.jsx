import React from 'react';
import { Container } from 'react-bootstrap';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer py-4 text-center">
      <Container>
        <p className="m-0 text-secondary">
          © {new Date().getFullYear()} <strong>Nutripet</strong> — Todos os direitos reservados.
        </p>
        <p className="small mt-1">
          Desenvolvido por <span className="text-brown">Nutripet Team</span>
        </p>
      </Container>
    </footer>
  );
}
