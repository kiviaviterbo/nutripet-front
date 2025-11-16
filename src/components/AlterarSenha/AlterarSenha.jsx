import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PerfilLayout from "../PerfilLayout/PerfilLayout";
import "../../assets/styles/perfil.css"
import NutripetNavbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { User, FileText, CreditCard, KeyRound} from "lucide-react";
import api from "../../services/api";

export default function AlterarSenha() {
  const [form, setForm] = useState({
    senhaAtual: "",
    novaSenha: "",
    confirmarSenha: "",
  });

  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const menuItems = [
    { label: "Minha Conta", icon: <User size={18} />, path: "/usuario/meusdados" },
    { label: "Meus Dados", icon: <FileText size={18} />, path: "/usuario/meusdados" },
    { label: "Minha Assinatura", icon: <CreditCard size={18} />, path: "/usuario/assinatura" },
    { label: "Alterar Senha", icon: <KeyRound size={18} />, path: "/usuario/senha" },
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.novaSenha !== form.confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    setLoading(true);

    try {
      await api.put(`/usuarios/${user.id}/senha`, {
        senhaAtual: form.senhaAtual,
        novaSenha: form.novaSenha,
      });

      // 👉 Mostrar o modal bonito
      setShowSuccessModal(true);

    } catch (err) {
      console.error(err);
      alert("Erro ao alterar senha.");
    } finally {
      setLoading(false);
    }
  };

  const finalizar = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth");
  };

  return (
    <>
      <NutripetNavbar />

      <PerfilLayout menu={menuItems}>
        <h2 className="titulo">Alterar Senha</h2>

        <form onSubmit={handleSubmit} className="perfil-form">

          <label>Senha Atual</label>
          <input
            type="password"
            name="senhaAtual"
            value={form.senhaAtual}
            onChange={handleChange}
            required
          />

          <label>Nova Senha</label>
          <input
            type="password"
            name="novaSenha"
            value={form.novaSenha}
            onChange={handleChange}
            required
          />

          <label>Confirmar Nova Senha</label>
          <input
            type="password"
            name="confirmarSenha"
            value={form.confirmarSenha}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Alterar Senha"}
          </button>
        </form>
      </PerfilLayout>

      <Footer />

      {/* === POP-UP DE SUCESSO (MESMO ESTILO DO LOGOUT) === */}
      {showSuccessModal && (
        <div className="logout-modal-overlay">
          <div className="logout-modal-card">
            <h3>Senha alterada com sucesso!</h3>
            <p>Faça login novamente para continuar usando o Nutripet.</p>

            <div className="logout-modal-actions">
              <button className="btn-sair" onClick={finalizar}>
                Fazer Login
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}