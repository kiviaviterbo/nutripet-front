import React, { useState } from 'react';
import { Navbar, Nav, NavDropdown, Container, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function NutripetNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);

  const token = localStorage.getItem('token');
  const isLogged = !!token;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollToSection = (sectionId) => {
    if (location.pathname === '/') {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      sessionStorage.setItem('scrollTo', sectionId);
      navigate('/');
    }
  };

  const handleNavigate = (path) => {
    setShowDropdown(false);
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateAndScrollTop = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Navbar expand="lg" className="bg-light py-3 shadow-sm fixed-top">
      <Container>
        <Navbar.Brand
          onClick={() => handleNavigateAndScrollTop('/')}
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
              onClick={() => handleNavigateAndScrollTop('/nutritiontable')}
            >
              Consultar Tabelas
            </Nav.Link>

            {isLogged ? (
              <NavDropdown
                title="Meu Pet"
                id="meupet-dropdown"
                className="mx-2 fw-semibold"
                show={showDropdown}
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={() => setShowDropdown(false)}
              >
                <div className="px-3 py-1">
                  <button
                    className="dropdown-item w-100 text-start"
                    onClick={() => handleNavigate('/meupet/cadastrar')}
                  >
                    Cadastrar Pet
                  </button>
                </div>
                <div className="px-3 py-1">
                  <button
                    className="dropdown-item w-100 text-start"
                    onClick={() => handleNavigate('/meupet/listar')}
                  >
                    Meus Pets
                  </button>
                </div>
              </NavDropdown>
            ) : (
              <Nav.Link
                className="mx-2 fw-semibold"
                onClick={() => handleNavigateAndScrollTop('/auth')}
              >
                Meu Pet
              </Nav.Link>
            )}
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
              <Button variant="brown" onClick={() => handleNavigateAndScrollTop('/auth')}>
                Cadastre-se / Login
              </Button>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
