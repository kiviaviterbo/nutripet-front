import React, { useEffect, useState } from "react";
import NutripetNavbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import PerfilLayout from "../PerfilLayout/PerfilLayout";
import "../../assets/styles/perfil.css";
import "./MinhasConsultas.css";
import api from "../../services/api";
import { FileText, KeyRound } from "lucide-react";
import receitaPDF from "../../assets/pdf/receita_veterinaria.pdf";

export default function MinhasConsultas() {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [consultas, setConsultas] = useState([]);

  const menuConsultas = [
    { label: "Nova Consulta", icon: <FileText size={18} />, path: "/usuario/consultas/nova" },
    { label: "Minhas Consultas", icon: <FileText size={18} />, path: "/usuario/consultas" },
    { label: "SAC", icon: <KeyRound size={18} />, path: "/usuario/consultas/saq" },
  ];

  useEffect(() => {
    api.get(`/consultas/usuario/${user.id}`)
      .then((res) => setConsultas(res.data))
      .catch((err) => console.log(err));
  }, [user.id]);

  return (
    <>
      <NutripetNavbar />

      <PerfilLayout menu={menuConsultas}>
        <h2 className="titulo">Minhas Consultas</h2>

        {consultas.length === 0 ? (
          <div className="assinatura-free">
            <h3>Nenhuma consulta encontrada</h3>
            <p>Você ainda não enviou nenhuma consulta.</p>
          </div>
        ) : (
          consultas.map((c) => (
            <div key={c.id} className="timeline-container">
              <h3 className="timeline-title">Consulta #{c.id}</h3>

              <div className="timeline-status">
                <div className="timeline-line" />

                <div className="timeline-step">
                  <div className="timeline-step-icon">📄</div>
                  <p>Solicitada</p>
                  <small>{new Date(c.data_solicitacao).toLocaleDateString("pt-BR")}</small>
                </div>

                <div className="timeline-step active-step">
                  <div className="timeline-step-icon">⏳</div>
                  <p>Em Análise</p>
                  <small>Até 15 dias úteis</small>
                </div>

                <div className="timeline-step active-step">
                  <div className="timeline-step-icon">✔️</div>
                  <p>Finalizada</p>
                  <small>{new Date(c.updatedAt).toLocaleDateString("pt-BR")}</small>
                </div>
              </div>

              <div className="assinatura-info-box">
                <p>
                  <strong>Status atual:</strong>{" "}
                  <span className="badge-ativo">Finalizada</span>
                </p>

                <div className="consulta-finalizada-box">
                  <p className="nc-file-hint">
                      A receita abaixo foi elaborada com base nas
                      <strong> informações preenchidas no formulário </strong>
                      e avaliação de um
                      <strong> nutricionista veterinário especializado.</strong>
                      Caso tenha dúvidas ou deseje solicitar ajustes,
                      entre em contato através do nosso{" "}
                      <a href="/usuario/consultas/saq" className="nc-link-saQ">
                        Serviço de Atendimento (SAQ)
                      </a>.
                    </p>

                  {/* 🔥 DOWNLOAD REAL FORÇADO */}
                  <button
                    className="btn-assinar"
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = receitaPDF;
                      link.download = `consulta-${c.id}.pdf`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                  >
                    📥 Baixar PDF Finalizado da Consulta #{c.id}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </PerfilLayout>

      <Footer />
    </>
  );
}

