import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../assets/styles/perfil.css";

export default function PerfilLayout({ menu = [], children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <>
      <section className="perfil-section">
        <div className="perfil-container">

          {/* MENU LATERAL */}
          <aside className="perfil-menu">
            <ul>
              {menu.map((item) => (
                <li
                  key={item.path}
                  className={location.pathname === item.path ? "active" : ""}
                  onClick={() => navigate(item.path)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </li>
              ))}

              <li className="logout-item" onClick={() => setShowLogoutModal(true)}>
                <span>Sair</span>
              </li>
            </ul>
          </aside>

          {/* ÁREA PRINCIPAL */}
          <div className="perfil-conteudo">{children}</div>
        </div>
      </section>

      {/* ==== POPUP DE CONFIRMAÇÃO ==== */}
      {showLogoutModal && (
        <div className="logout-modal-overlay" onClick={() => setShowLogoutModal(false)}>
          <div
            className="logout-modal-card"
            onClick={(e) => e.stopPropagation()} // impede fechar ao clicar no card
          >
            <h3>Tem certeza que deseja sair?</h3>
            <p>Você precisará fazer login novamente para acessar sua conta.</p>

            <div className="logout-modal-actions">
              <button className="btn-cancelar" onClick={() => setShowLogoutModal(false)}>
                Cancelar
              </button>

              <button className="btn-sair" onClick={logout}>
                Sair
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
