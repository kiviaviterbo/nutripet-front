import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../assets/styles/perfil.css";

export default function PerfilLayout({ children, menu = [] }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <section className="perfil-section">
      <div className="perfil-container perfil-container-full">

        {/* MENU HORIZONTAL CENTRALIZADO */}
        {menu.length > 0 && (
          <div className="menu-consultas-list">
            {menu.map((item) => (
              <button
                key={item.path}
                className={`menu-consultas-list-btn${
                  location.pathname === item.path ? " active" : ""
                }`}
                onClick={() => navigate(item.path)}
                type="button"
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        )}

        <div className="perfil-conteudo">
          {children}
        </div>
      </div>
    </section>
  );
}
