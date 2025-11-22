import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PerfilLayout from "../PerfilLayout/PerfilLayout";
import "../../assets/styles/perfil.css";
import "../AlterarSenha/AlterarSenha.css";
import NutripetNavbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import {FileText, CreditCard, KeyRound, Check, X } from "lucide-react";
import api from "../../services/api";

export default function AlterarSenha() {
  const [form, setForm] = useState({
    senhaAtual: "",
    novaSenha: "",
    confirmarSenha: "",
  });

  // ESTADOS PARA MOSTRAR/OCULTAR SENHAS
  const [showSenhaAtual, setShowSenhaAtual] = useState(false);
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);

  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const menuItems = [
    { label: "Meus Dados", icon: <FileText size={18} />, path: "/usuario/meusdados" },
    { label: "Minha Assinatura", icon: <CreditCard size={18} />, path: "/usuario/assinatura" },
    { label: "Alterar Senha", icon: <KeyRound size={18} />, path: "/usuario/senha" },
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ────────────────────────────────────────────────
  // Validações da nova senha
  // ────────────────────────────────────────────────
  const rules = {
    length: form.novaSenha.length >= 10,
    upper: /[A-Z]/.test(form.novaSenha),
    lower: /[a-z]/.test(form.novaSenha),
    number: /[0-9]/.test(form.novaSenha),
  };

  const senhaValida =
    rules.length && rules.upper && rules.lower && rules.number;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!senhaValida) {
      alert("A nova senha não atende aos requisitos.");
      return;
    }

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
        <div className="perfil-conteudo alterar-senha">
          <h2 className="titulo">Alterar Senha</h2>

          <form onSubmit={handleSubmit} className="perfil-form">

            {/* Senha Atual */}
            <label>Senha Atual</label>
            <div className="input-wrapper">
              <input
                type={showSenhaAtual ? "text" : "password"}
                name="senhaAtual"
                value={form.senhaAtual}
                onChange={handleChange}
                required
              />
              <span
                className="toggle-eye"
                onClick={() => setShowSenhaAtual(!showSenhaAtual)}
              >
                {showSenhaAtual ? "🙈" : "👁️"}
              </span>
            </div>

            {/* Nova Senha */}
            <label>Nova Senha</label>
            <div className="input-wrapper">
              <input
                type={showNovaSenha ? "text" : "password"}
                name="novaSenha"
                value={form.novaSenha}
                onChange={handleChange}
                required
              />
              <span
                className="toggle-eye"
                onClick={() => setShowNovaSenha(!showNovaSenha)}
              >
                {showNovaSenha ? "🙈" : "👁️"}
              </span>
            </div>

            {/* Requisitos */}
            <div className="senha-requisitos">
              <Requisito ok={rules.length} texto="Mínimo de 10 caracteres" />
              <Requisito ok={rules.upper} texto="Pelo menos 1 letra maiúscula" />
              <Requisito ok={rules.lower} texto="Pelo menos 1 letra minúscula" />
              <Requisito ok={rules.number} texto="Pelo menos 1 número" />
            </div>

            {/* Confirmar Nova Senha */}
            <label>Confirmar Nova Senha</label>
            <div className="input-wrapper">
              <input
                type={showConfirmarSenha ? "text" : "password"}
                name="confirmarSenha"
                value={form.confirmarSenha}
                onChange={handleChange}
                required
              />
              <span
                className="toggle-eye"
                onClick={() => setShowConfirmarSenha(!showConfirmarSenha)}
              >
                {showConfirmarSenha ? "🙈" : "👁️"}
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-alterar-senha"
            >
              {loading ? "Salvando..." : "Alterar Senha"}
            </button>

          </form>
        </div>
      </PerfilLayout>

      <Footer />

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

/* Componente interno */
function Requisito({ ok, texto }) {
  return (
    <p
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        fontSize: "0.9rem",
        color: ok ? "#2e7d32" : "#b71c1c",
        margin: 0,
        paddingLeft: "4px",
      }}
    >
      {ok ? <Check size={16} /> : <X size={16} />}
      {texto}
    </p>
  );
}
