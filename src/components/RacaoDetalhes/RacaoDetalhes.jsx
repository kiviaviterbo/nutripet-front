import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NutripetNavbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import api from "../../services/api";
import "./RacaoDetalhes.css";
import fallbackImg from "../../assets/images/tabelanutricional.gif";
import premiumGif from "../../assets/images/premium.gif";

export default function RacaoDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [racao, setRacao] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRacao() {
      try {
        const res = await api.get(`/tabelas/${id}`);
        setRacao(res.data);
      } catch (error) {
        console.error("Erro ao carregar ração:", error);
      } finally {
        setLoading(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
    fetchRacao();
  }, [id]);

  if (loading) return <p className="loading">Carregando...</p>;
  if (!racao) return <p className="no-results">Ração não encontrada.</p>;

  return (
    <>
      <NutripetNavbar />

      <section className="racao-detalhes-section">
        <div className="racao-container">
          {/* 🔹 Cabeçalho */}
          <div className="racao-header">
            <img
              src={racao.imagem_url || fallbackImg}
              alt={racao.nome}
              className="racao-img"
            />
            <div className="racao-info">
              <h1>{racao.nome}</h1>
              <h4>
                {racao.marca} • {racao.tipo} • {racao.especie}
              </h4>
              <p className="racao-desc">
                Avaliação completa dos níveis de garantia e qualidade nutricional.
              </p>
            </div>
          </div>

          {/* 🔹 Tabela completa */}
          <div className="tabela-wrapper">
            <h2 className="tabela-titulo">Tabela Nutricional Completa</h2>
            <table className="tabela-nutricional">
              <thead>
                <tr>
                  <th>Componente</th>
                  <th>Quantidade</th>
                  <th>Bom</th>
                  <th>Médio</th>
                  <th>Ruim</th>
                </tr>
              </thead>
              <tbody>
                {racao.nutrientes?.map((n, i) => (
                  <tr key={i}>
                    <td>{n.nome}</td>
                    <td>{n.valor}</td>
                    <td className="col-qualidade">
                      {n.qualidade === "bom" && <span className="emoji">👍</span>}
                    </td>
                    <td className="col-qualidade">
                      {n.qualidade === "medio" && <span className="emoji">👌</span>}
                    </td>
                    <td className="col-qualidade">
                      {n.qualidade === "ruim" && <span className="emoji">👎</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 🔹 Tabela de avaliação */}
          <div className="tabela-wrapper">
            <h2 className="tabela-titulo">Avaliação Nutricional</h2>
            <table className="tabela-avaliacao">
              <thead>
                <tr>
                  <th>Item Avaliado</th>
                  <th>Valor</th>
                  <th>Classificação</th>
                </tr>
              </thead>
              <tbody>
                {racao.avaliacaoNutricional?.map((item, i) => (
                  <tr key={i}>
                    <td>{item.nome}</td>
                    <td>{item.valor}</td>
                    <td>
                      <span className={`avaliacao-badge ${item.qualidade}`}>
                        {item.qualidade === "bom" && "Bom 👍"}
                        {item.qualidade === "medio" && "Médio 😐"}
                        {item.qualidade === "ruim" && "Ruim 👎"}
                        {item.qualidade === "indefinido" && "N/D"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 🔹 Seção Premium fora do container */}
      <div className="premium-wrapper">
        <div className="premium-section">
          <img src={premiumGif} alt="Seja Premium" className="premium-gif" />
          <button
            className="premium-btn"
            onClick={() => navigate("/plans")}
          >
            Clique aqui e seja Premium
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
}
