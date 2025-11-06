import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function NutripetNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem('token');
  const isLogged = !!token;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/'); // volta pra home
  };

  const handleMeuPetClick = (e) => {
    e.preventDefault();
    if (isLogged) navigate('/meupet');
    else navigate('/auth');
  };

  const handleScrollToSection = (sectionId) => {
    // se já está na home, apenas faz o scroll
    if (location.pathname === '/') {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      // se estiver em outra página, salva a intenção e vai pra home
      sessionStorage.setItem('scrollTo', sectionId);
      navigate('/');
    }
  };

  return (
    <Navbar expand="lg" className="bg-light py-3 shadow-sm fixed-top">
      <Container>
        <Navbar.Brand
          onClick={() => navigate('/')}
          className="fw-bold fs-3 text-brown"
          style={{ cursor: 'pointer' }}
        >
          <span className="text-beige">NUTRI</span>PET
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="me-4 d-flex align-items-center">
            <Nav.Link
              className="mx-2 fw-semibold"
              onClick={() => handleScrollToSection('about')}
            >
              Quem somos
            </Nav.Link>

            <Nav.Link
              className="mx-2 fw-semibold"
              onClick={() => navigate('/nutritiontable')}
            >
              Consultar Tabelas
            </Nav.Link>

            <Nav.Link className="mx-2 fw-semibold" onClick={handleMeuPetClick}>
              Meu Pet
            </Nav.Link>
          </Nav>

          <div className="d-flex align-items-center gap-3">
            <Button
              variant="outline-brown"
              onClick={() => handleScrollToSection('plans')}
            >
              Seja Premium
            </Button>

            {isLogged ? (
              <Button variant="brown" onClick={handleLogout}>
                Sair
              </Button>
            ) : (
              <Button variant="brown" onClick={() => navigate('/auth')}>
                Cadastre-se / Login
              </Button>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
