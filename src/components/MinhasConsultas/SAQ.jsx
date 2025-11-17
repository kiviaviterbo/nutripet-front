import { useState } from "react";
import NutripetNavbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import PerfilLayout from "../PerfilLayout/PerfilLayout";
import "../../assets/styles/perfil.css";
import "./SAQ.css";
import mascote from "../../assets/images/mascote_nutripet.png"
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

  const [popup, setPopup] = useState({ show: false, message: "", type: "" });

  const showPopup = (message, type = "success") => {
    setPopup({ show: true, message, type });
    setTimeout(() => setPopup({ show: false, message: "", type: "" }), 2400);
  };

  const enviar = () => {
    if (!nome || !email || !tipo || !assunto || !mensagem) {
      showPopup("Preencha todos os campos!", "error");
      return;
    }

    showPopup("Mensagem enviada com sucesso!", "success");

    setTipo("");
    setAssunto("");
    setMensagem("");
  };

  return (
    <>
      <NutripetNavbar />

      <PerfilLayout menu={menuConsultas}>

        {popup.show && (
          <div className={`popup-overlay ${popup.type}`}>
            <div className="popup-box">
              <p>{popup.message}</p>
            </div>
          </div>
        )}

        <div className="saq-header">
          <h2>Atendimento ao Cliente</h2>
          <p>Estamos aqui para te ajudar no que precisar</p>
        </div>

        <div className="saq-card">

          <form className="saq-form" onSubmit={(e) => e.preventDefault()}>

            <div className="saq-group">
              <label>Nome</label>
              <input value={nome} onChange={(e) => setNome(e.target.value)} />
            </div>

            <div className="saq-group">
              <label>E-mail</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="saq-group">
              <label>Tipo de Solicitação</label>
              <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                <option value="">Selecione</option>
                <option value="duvida">Dúvidas</option>
                <option value="reclamacao">Reclamação</option>
                <option value="ajuste">Solicitar ajuste na receita</option>
                <option value="suporte">Problema técnico</option>
              </select>
            </div>

            <div className="saq-group">
              <label>Assunto</label>
              <input value={assunto} onChange={(e) => setAssunto(e.target.value)} />
            </div>

            <div className="saq-group">
              <label>Mensagem</label>
              <textarea value={mensagem} onChange={(e) => setMensagem(e.target.value)} />
            </div>

            <button type="button" className="saq-btn" onClick={enviar}>
              Enviar Solicitação
            </button>
          </form>

        </div>

        <div className="rogerinho-help">
          <a
            href="https://wa.me/5534999999999"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={mascote} alt="Fale com Rogerinho" />
          </a>
        </div>


      </PerfilLayout>

      <Footer />
    </>
  );
}
