import React, { useState, useEffect, useRef } from "react";
import { Navbar, Nav, NavDropdown, Container, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { PawPrint, UserCircle2 } from "lucide-react";
import "./Navbar.css";

export default function NutripetNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showDropdown, setShowDropdown] = useState(null);
  const timeoutRef = useRef(null);

  const handleMouseEnter = (menu) => {
    clearTimeout(timeoutRef.current);
    setShowDropdown(menu);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setShowDropdown(null), 220);
  };

  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");
  const isLogged = !!token;

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleScrollToSection = (sectionId) => {
    if (location.pathname === "/") {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      sessionStorage.setItem("scrollTo", sectionId);
      navigate("/");
    }
  };

  const handleNavigate = (path) => {
    setShowDropdown(null);
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigateAndScrollTop = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Navbar expand="lg" className="nutripet-navbar fixed-top">
      <Container fluid="lg" className="navbar-container">
        <Navbar.Brand
          onClick={() => handleNavigateAndScrollTop("/")}
          className="brand fw-bold fs-3"
        >
          <span className="text-gradient">NUTRI</span>PET
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="me-4 d-flex align-items-center gap-2">

            {isLogged && (
              <Button
                variant="outline-brown-modern"
                className="btn-premium-left"
                onClick={() => handleScrollToSection("plans")}
              >
                Seja Premium
              </Button>
            )}

            <Nav.Link
              className="navlink-modern"
              onClick={() => handleScrollToSection("about")}
            >
              Quem somos
            </Nav.Link>

            <Nav.Link
              className="navlink-modern"
              onClick={() => handleNavigateAndScrollTop("/nutritiontable")}
            >
              Consultar Tabelas
            </Nav.Link>

            {/* === MEU PET (SEM DROPDOWN) === */}
            {isLogged ? (
              <Nav.Link
                className="navlink-modern"
                onClick={() => handleNavigateAndScrollTop("/meupet/listar")}
              >
                <PawPrint size={18} className="me-1" />
                Meu Pet
              </Nav.Link>
            ) : (
              <Nav.Link
                className="navlink-modern"
                onClick={() => handleNavigateAndScrollTop("/auth")}
              >
                <PawPrint size={18} className="me-1" />
                Meu Pet
              </Nav.Link>
            )}
          </Nav>

          <div className="d-flex align-items-center gap-3">

            {!isLogged && (
              <Button
                variant="outline-brown-modern"
                onClick={() => handleScrollToSection("plans")}
              >
                Seja Premium
              </Button>
            )}

            {isLogged ? (
              <NavDropdown
                title={
                  <span className="d-flex align-items-center gap-1">
                    <UserCircle2
                      size={18}
                      className={`icon-rotate ${showDropdown === "perfil" ? "open" : ""}`}
                    />
                    Meu Perfil
                  </span>
                }
                id="perfil-dropdown"
                align="end"
                className="navlink-modern"
                show={showDropdown === "perfil"}
                onMouseEnter={() => handleMouseEnter("perfil")}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className="dropdown-item-modern"
                  onClick={() => handleNavigate("/usuario/meusdados")}
                >
                  Meus Dados
                </button>

                <div className="dropdown-divider"></div>

                <button
                  className="dropdown-item-modern text-danger"
                  onClick={handleLogout}
                >
                  Sair
                </button>
              </NavDropdown>
            ) : (
              <Button
                variant="brown-modern"
                onClick={() => handleNavigateAndScrollTop("/auth")}
              >
                Cadastre-se / Login
              </Button>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

/* import React, { useState, useEffect, useRef } from "react";
import { Navbar, Nav, NavDropdown, Container, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { PawPrint, UserCircle2 } from "lucide-react";
import "./Navbar.css";
import EditarPerfil from "../EditarPerfil/EditarPerfil"


export default function NutripetNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showDropdown, setShowDropdown] = useState(null);
  const timeoutRef = useRef(null);

  const handleMouseEnter = (menu) => {
    clearTimeout(timeoutRef.current);
    setShowDropdown(menu);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setShowDropdown(null), 220);
  };

  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");
  const isLogged = !!token;

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleScrollToSection = (sectionId) => {
    if (location.pathname === "/") {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      sessionStorage.setItem("scrollTo", sectionId);
      navigate("/");
    }
  };

  const handleNavigate = (path) => {
    setShowDropdown(null);
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigateAndScrollTop = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isPremium = user?.plano === "premium";

  return (
    <Navbar expand="lg" className="nutripet-navbar fixed-top">
      <Container fluid="lg" className="navbar-container">
        <Navbar.Brand
          onClick={() => handleNavigateAndScrollTop("/")}
          className="brand fw-bold fs-3"
        >
          <span className="text-gradient">NUTRI</span>PET
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="me-4 d-flex align-items-center gap-2">
            {isLogged && (
              <Button
                variant="outline-brown-modern"
                className="btn-premium-left"
                onClick={() => handleScrollToSection("plans")}
              >
                Seja Premium
              </Button>
            )}

            <Nav.Link
              className="navlink-modern"
              onClick={() => handleScrollToSection("about")}
            >
              Quem somos
            </Nav.Link>

            <Nav.Link
              className="navlink-modern"
              onClick={() => handleNavigateAndScrollTop("/nutritiontable")}
            >
              Consultar Tabelas
            </Nav.Link>

            {isLogged ? (
              <NavDropdown
                title={
                  <span className="d-flex align-items-center gap-1">
                    <PawPrint
                      size={18}
                      className={`icon-rotate ${showDropdown === "pet" ? "open" : ""
                        }`}
                    />
                    Meu Pet
                  </span>
                }
                id="meupet-dropdown"
                className="navlink-modern"
                show={showDropdown === "pet"}
                onMouseEnter={() => handleMouseEnter("pet")}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className="dropdown-item-modern"
                  onClick={() => handleNavigate("/meupet/cadastrar")}
                >
                  Cadastrar Pet
                </button>
                <button
                  className="dropdown-item-modern"
                  onClick={() => handleNavigate("/meupet/listar")}
                >
                  Meus Pets
                </button>
              </NavDropdown>
            ) : (
              <Nav.Link
                className="navlink-modern"
                onClick={() => handleNavigateAndScrollTop("/auth")}
              >
                <PawPrint size={18} className="me-1" />
                Meu Pet
              </Nav.Link>
            )}
          </Nav>

          <div className="d-flex align-items-center gap-3">
            {!isLogged && (
              <Button
                variant="outline-brown-modern"
                onClick={() => handleScrollToSection("plans")}
              >
                Seja Premium
              </Button>
            )}

            {isLogged ? (
              <NavDropdown
                title={
                  <span className="d-flex align-items-center gap-1">
                    <UserCircle2
                      size={18}
                      className={`icon-rotate ${showDropdown === "perfil" ? "open" : ""
                        }`}
                    />
                    Meu Perfil
                  </span>
                }
                id="perfil-dropdown"
                align="end"
                className="navlink-modern"
                show={showDropdown === "perfil"}
                onMouseEnter={() => handleMouseEnter("perfil")}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className="dropdown-item-modern"
                  onClick={() => handleNavigate("/usuario/meusdados")}
                >
                  Meus Dados
                </button>

                <div className="dropdown-divider"></div>

                <button
                  className="dropdown-item-modern text-danger"
                  onClick={handleLogout}
                >
                  Sair
                </button>
              </NavDropdown>
            ) : (
              <Button
                variant="brown-modern"
                onClick={() => handleNavigateAndScrollTop("/auth")}
              >
                Cadastre-se / Login
              </Button>
            )}

          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
 */