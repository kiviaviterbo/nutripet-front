import { useState, useEffect, useRef } from "react";
import { Navbar, Nav, NavDropdown, Container, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { UserCircle2, Menu, LogOut, Dog, Star, Info, Table } from "lucide-react";
import "./Navbar.css";

export default function NutripetNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(null);
  const timeoutRef = useRef(null);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");
  const isLogged = !!token;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (drawerOpen) document.body.classList.add("drawer-open");
    else document.body.classList.remove("drawer-open");
    return () => document.body.classList.remove("drawer-open");
  }, [drawerOpen]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const confirmLogout = () => {
    document.body.classList.remove("showing-logout-popup");
    setShowLogoutPopup(false);
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
    setDrawerOpen(false);
  };

  const handleNavigate = (path) => {
    setShowDropdown(null);
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setDrawerOpen(false);
  };

  const handleNavigateAndScrollTop = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setDrawerOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <Navbar expand="lg" className="nutripet-navbar fixed-top">
        <Container fluid="lg" className="navbar-container">
          {/* LOGO */}
          <Navbar.Brand
            onClick={() => handleNavigateAndScrollTop("/")}
            className="brand fw-bold"
          >
            <span className="text-gradient">NUTRI</span>PET
          </Navbar.Brand>

          {/* MOBILE: Ícone de usuário / menu lateral */}
          {isMobile ? (
            <div className="d-flex align-items-center gap-2">
              <Button
                variant="link"
                className="navbar-user-btn"
                onClick={() => setDrawerOpen(true)}
                aria-label="Abrir menu"
              >
                <UserCircle2 size={28} color="#7b2e1f" />
              </Button>
              {/* Ícone hambúrguer */}
              <Button
                variant="link"
                className="navbar-menu-btn"
                onClick={() => setDrawerOpen(true)}
                aria-label="Abrir menu"
              >
                <Menu size={30} color="#7b2e1f" />
              </Button>

            </div>
          ) : (
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
                  className={`navlink-modern ${isActive("/") ? "active" : ""}`}
                  aria-current={isActive("/") ? "page" : undefined}
                  onClick={() => handleNavigateAndScrollTop("/")}
                >
                  Início
                </Nav.Link>

                <Nav.Link
                  className="navlink-modern"
                  onClick={() => handleScrollToSection("about")}
                >
                  Quem somos
                </Nav.Link>

                <Nav.Link
                  className={`navlink-modern ${isActive("/nutritiontable") ? "active" : ""
                    }`}
                  aria-current={isActive("/nutritiontable") ? "page" : undefined}
                  onClick={() => handleNavigateAndScrollTop("/nutritiontable")}
                >
                  Consultar Tabelas
                </Nav.Link>
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
                        <UserCircle2 size={18} />
                        Minha Conta
                      </span>
                    }
                    id="perfil-dropdown"
                    align="end"
                    className="navlink-modern"
                    show={showDropdown === "perfil"}
                    onMouseEnter={() => setShowDropdown("perfil")}
                    onMouseLeave={() => setShowDropdown(null)}
                  >
                    <button
                      className="dropdown-item-modern"
                      onClick={() => handleNavigate("/usuario/meusdados")}
                    >
                      Meus Dados e Assinatura
                    </button>
                    <button
                      className="dropdown-item-modern"
                      onClick={() => handleNavigate("/usuario/meupet")}
                    >
                      Meus Pets
                    </button>
                    <button
                      className="dropdown-item-modern"
                      onClick={() => handleNavigate("/usuario/consultas")}
                    >
                      Minhas Consultas
                    </button>
                    <button
                      className="dropdown-item-modern"
                      onClick={() => handleNavigate("/usuario/cupons")}
                    >
                      Promoções
                    </button>
                    <div className="dropdown-divider"></div>
                    <button
                      className="dropdown-item-modern text-danger"
                      onClick={() => {
                        setShowDropdown(null);
                        document.body.classList.add("showing-logout-popup");
                        setShowLogoutPopup(true);
                      }}
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
          )}
        </Container>
      </Navbar>

      {/* POPUP DE LOGOUT */}
      {showLogoutPopup && (
        <div className="logout-overlay">
          <div className="logout-popup">
            <h3>
              Tem certeza que
              <br /> deseja sair?
            </h3>
            <p>
              Você precisará fazer login novamente
              <br /> para acessar sua conta.
            </p>
            <div className="logout-buttons">
              <button
                className="btn-cancelar"
                onClick={() => {
                  document.body.classList.remove("showing-logout-popup");
                  setShowLogoutPopup(false);
                }}
              >
                Cancelar
              </button>
              <button className="btn-sair" onClick={confirmLogout}>
                Sair
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DRAWER MOBILE */}
      {drawerOpen && isMobile && (
        <>
          <div className="drawer-overlay" onClick={() => setDrawerOpen(false)} />
          <div className="drawer" role="navigation" aria-label="Menu lateral">
            <div className="drawer-header">
              <button
                className="drawer-close-btn"
                aria-label="Fechar menu"
                onClick={() => setDrawerOpen(false)}
              >
                ×
              </button>
              {isLogged ? (
                <>
                  <UserCircle2 size={32} color="#7b2e1f" />
                  <span>Olá, {user?.nome?.split(" ")[0]}!</span>
                </>
              ) : (
                <>
                  <UserCircle2 size={32} color="#7b2e1f" />
                  <span>Olá, Bem-vindo(a)!</span>
                </>
              )}
            </div>

            <div className="drawer-content">
              {!isLogged && (
                <button
                  className="drawer-btn main"
                  onClick={() => handleNavigateAndScrollTop("/auth")}
                >
                  <UserCircle2 size={20} /> Entrar ou Cadastrar
                </button>
              )}

              <button
                className="drawer-btn"
                onClick={() => handleScrollToSection("plans")}
              >
                <Star size={20} /> Seja Premium
              </button>

              <button
                className="drawer-btn"
                onClick={() => handleScrollToSection("about")}
              >
                <Info size={20} /> Quem somos
              </button>

              <button
                className="drawer-btn"
                onClick={() =>
                  handleNavigateAndScrollTop("/nutritiontable")
                }
              >
                <Table size={20} /> Consultar Tabelas
              </button>

              {isLogged && (
                <>
                  <button
                    className="drawer-btn"
                    onClick={() => handleNavigate("/usuario/meusdados")}
                  >
                    <UserCircle2 size={20} style={{ marginRight: 8 }} />
                    Meus Dados e Assinatura
                  </button>

                  <button
                    className="drawer-btn"
                    onClick={() => handleNavigate("/usuario/meupet")}
                  >
                    <Dog size={20} style={{ marginRight: 8 }} />
                    Meus Pets
                  </button>

                  <button
                    className="drawer-btn"
                    onClick={() => handleNavigate("/usuario/consultas")}
                  >
                    <Info size={20} style={{ marginRight: 8 }} />
                    Minhas Consultas
                  </button>

                  <button
                    className="drawer-btn"
                    onClick={() => handleNavigate("/usuario/cupons")}
                  >
                    <Star size={20} style={{ marginRight: 8 }} />
                    Promoções
                  </button>

                  <button
                    className="drawer-btn danger"
                    onClick={() => {
                      setDrawerOpen(false);
                      document.body.classList.add("showing-logout-popup");
                      setShowLogoutPopup(true);
                    }}
                  >
                    <LogOut size={20} style={{ marginRight: 8 }} />
                    Sair
                  </button>
                </>
              )}

            </div>
          </div>
        </>
      )}
    </>
  );
}
