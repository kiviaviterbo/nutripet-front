import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import './Navbar.css';

export default function NutripetNavbar() {
  // Função de rolagem suave para qualquer seção
  const smoothScroll = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Navbar expand="lg" className="bg-light py-3 shadow-sm fixed-top">
      <Container>
        <Navbar.Brand href="#" className="fw-bold fs-3 text-brown">
          <span className="text-beige">NUTRI</span>PET
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="me-3">
            {/* Quem somos */}
            <Nav.Link
              href="#about"
              className="mx-2 fw-semibold"
              onClick={(e) => {
                e.preventDefault();
                smoothScroll('about');
              }}
            >
              Quem somos
            </Nav.Link>

            {/* Consultar Tabelas */}
            <Nav.Link
              href="#tabelas"
              className="mx-2 fw-semibold"
              onClick={(e) => {
                e.preventDefault();
                smoothScroll('tabelas');
              }}
            >
              Consultar Tabelas
            </Nav.Link>
          </Nav>

          {/* Seja Premium */}
          <Button
            variant="outline-brown"
            className="me-3"
            onClick={() => smoothScroll('plans')}
          >
            Seja Premium
          </Button>

          {/* Cadastre-se / Login */}
          <Button
            variant="brown"
            onClick={() => window.location.href = '/auth'}
          >
            Cadastre-se / Login
          </Button>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
