import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NutripetNavbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import api from "../../services/api";
import "./MinhasConsultas.css";
import { User, FileText, Calendar, CreditCard, KeyRound, LogOut } from "lucide-react";

export default function MinhasConsultas() {
  const navigate = useNavigate();
  const location = useLocation();

  // carrega usuário salvo
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};
  const [user, setUser] = useState(storedUser);

  // premium baseando no que tem no localStorage
  const [isPremium, setIsPremium] = useState(storedUser.plano === "premium");

  // sincroniza com backend
  useEffect(() => {
    async function syncPremiumStatus() {
      if (!storedUser.id) return;

      try {
        const res = await api.get(`/assinaturas/status/${storedUser.id}`);

        if (res.data.ativo) {
          // usuário REALMENTE premium no backend
          const updatedUser = { ...storedUser, plano: "premium" };

          // atualiza tudo
          localStorage.setItem("user", JSON.stringify(updatedUser));
          setUser(updatedUser);
          setIsPremium(true);
        } else {
          setIsPremium(false);
        }
      } catch (err) {
        console.error("Erro ao verificar assinatura:", err);
      }
    }

    syncPremiumStatus();
  }, [storedUser.id]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleAssinar = () => navigate("/pagamento");

  const menuItems = [
    { label: "Minha Conta", icon: <User size={18} />, path: "/usuario/meusdados" },
    { label: "Meus Dados", icon: <FileText size={18} />, path: "/usuario/meusdados" },
    { label: "Minha Assinatura", icon: <CreditCard size={18} />, path: "/usuario/assinatura" },
    { label: "Minhas Consultas", icon: <Calendar size={18} />, path: "/usuario/consultas" },
    { label: "Alterar Senha", icon: <KeyRound size={18} />, path: "/usuario/senha" },
  ];

  return (
    <>
      <NutripetNavbar />

      <section className="perfil-section">
        <div className="perfil-container">
          {/* Menu lateral */}
          <aside className="perfil-menu">
            <ul>
              {menuItems.map((item) => (
                <li
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className={location.pathname === item.path ? "active" : ""}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </li>
              ))}

              <li className="logout-item" onClick={handleLogout}>
                <LogOut size={18} />
                <span>Sair</span>
              </li>
            </ul>
          </aside>

          {/* Conteúdo principal */}
          <div className="perfil-conteudo">
            <h2 className="titulo">Minhas Consultas</h2>

            {isPremium ? (
              <div className="consultas-premium">
                <p className="descricao">
                  Bem-vindo(a), <strong>{user.nome || "Usuário"}</strong>!
                </p>

                <p className="descricao">
                  Aqui você poderá acompanhar suas consultas nutricionais e histórico de
                  avaliações — recurso disponível apenas para assinantes Premium.
                </p>

                <div className="consultas-lista">
                  <p>(Em breve, suas consultas aparecerão aqui...)</p>
                </div>
              </div>
            ) : (
              <div className="assinatura-free text-center">
                <h3>Você ainda não é assinante Premium?</h3>
                <p>
                  Tenha acesso aos melhores profissionais de nutrição animal e descubra o plano ideal para o seu pet.
                </p>

                <button className="btn-assinar" onClick={handleAssinar}>
                  Clique aqui e seja Premium
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
