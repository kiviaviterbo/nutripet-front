import React, { useState } from "react";
import NutripetNavbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import PerfilLayout from "../PerfilLayout/PerfilLayout";
import "../../assets/styles/perfil.css";
import "./SAQ.css";
import { FileText, KeyRound } from "lucide-react";

export default function SAQ() {
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const menuConsultas = [
    { label: "Nova Consulta", icon: <FileText size={18} />, path: "/usuario/consultas/nova" },
    { label: "Minhas Consultas", icon: <FileText size={18} />, path: "/usuario/consultas" },
    { label: "SAC", icon: <KeyRound size={18} />, path: "/usuario/consultas/saq" },
  ];

  const [nome, setNome] = useState(user.nome || "");
  const [email, setEmail] = useState(user.email || "");
  const [tipo, setTipo] = useState("");
  const [assunto, setAssunto] = useState("");
  const [mensagem, setMensagem] = useState("");

  // -----------------------------
  // POPUP ESTILIZADO COM BLUR
  // -----------------------------
  const [popup, setPopup] = useState({ show: false, message: "", type: "" });

  const showPopup = (message, type = "success") => {
    setPopup({ show: true, message, type });

    setTimeout(() => {
      setPopup({ show: false, message: "", type: "" });
    }, 2400);
  };

  const enviar = () => {
    if (!nome || !email || !tipo || !assunto || !mensagem) {
      showPopup("Preencha todos os campos!", "error");
      return;
    }

    showPopup("Mensagem enviada! Retornaremos em até 7 dias úteis.", "success");

    setTipo("");
    setAssunto("");
    setMensagem("");
  };

  return (
    <>
      <NutripetNavbar />

      <PerfilLayout menu={menuConsultas}>
        
        {/* POPUP PROFISSIONAL */}
        {popup.show && (
          <div className={`popup-overlay ${popup.type}`}>
            <div className="popup-box">
              <p>{popup.message}</p>
            </div>
          </div>
        )}

        <h2 className="titulo">SAQ - Atendimento</h2>

        <form className="saq-form" onSubmit={(e) => e.preventDefault()}>
          
          <label className="saq-label">Nome</label>
          <input
            className="saq-input"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <label className="saq-label">E-mail</label>
          <input
            className="saq-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="saq-label">Tipo de Solicitação</label>
          <select
            className="saq-input"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          >
            <option value="">Selecione</option>
            <option value="duvida">Dúvidas</option>
            <option value="reclamacao">Reclamação</option>
            <option value="ajuste">Solicitar ajuste na receita</option>
            <option value="suporte">Problema técnico</option>
          </select>

          <label className="saq-label">Assunto</label>
          <input
            className="saq-input"
            value={assunto}
            onChange={(e) => setAssunto(e.target.value)}
          />

          <label className="saq-label">Mensagem</label>
          <textarea
            className="saq-textarea"
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
          />

          <button type="button" className="saq-btn" onClick={enviar}>
            Enviar Solicitação
          </button>
        </form>

      </PerfilLayout>

      <Footer />
    </>
  );
}
