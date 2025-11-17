import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import NutripetNavbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import api from "../../services/api";
import "./RacaoDetalhes.css";
//import fallbackImg from "../../assets/images/tabelanutricional.gif";
import premiumGif from "../../assets/images/premium.gif";

export default function RacaoDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [racao, setRacao] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const scrollToPremium = () => {
    if (location.pathname === "/") {
      const el = document.getElementById("plans");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      sessionStorage.setItem("scrollTo", "plans");
      navigate("/");
    }
  };

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

  // 🔹 Detecta se é ração úmida
  const isUmida =
    racao.tipo?.toLowerCase().includes("úmida") ||
    racao.tipo?.toLowerCase().includes("umida");

  // 🔹 Busca umidade (usada apenas se for úmida)
  const umidadeItem = racao.nutrientes?.find((n) => /umidade/i.test(n.nome));
  const umidade = umidadeItem
    ? parseFloat(String(umidadeItem.valor).replace(",", "."))
    : 80; // padrão se não vier no backend

  const MS = 1 - umidade / 100;

  // 🔹 Converte automaticamente se for úmida
  const converterValor = (valorOriginal, nome) => {
    if (!isUmida) return valorOriginal; // não altera rações secas

    const v = parseFloat(String(valorOriginal).replace(",", "."));
    if (isNaN(v) || !MS) return valorOriginal;

    const isPercent =
      String(valorOriginal).includes("%") ||
      /proteína|gordura|extrato|fibra|cinzas|carbo|matéria/i.test(nome);
    const isMass = /mg\/kg|ppm/i.test(String(valorOriginal));

    if (isPercent) return `${(v / MS).toFixed(1)}% (DMB)`;
    if (isMass) return `${Math.round(v / MS).toLocaleString()} mg/kg (DMB)`;
    return `${(v / MS).toFixed(2)} (DMB)`;
  };

  return (
    <>
      <NutripetNavbar />

      <section className="racao-detalhes-section">
        <div className="racao-container">
          {/* 🔹 Cabeçalho */}
          <div className="racao-header">
            <img
              src={racao.imagem_url}
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
            <h2 className="tabela-titulo">
              Tabela Nutricional{" "}
              {isUmida ? "(Base de Matéria Seca)" : ""}
            </h2>

            <table className="tabela-nutricional">
              <thead>
                <tr>
                  <th>Componente</th>
                  <th>Quantidade</th>
                  {!isUmida && (
                    <>
                      <th>Bom</th>
                      <th>Médio</th>
                      <th>Ruim</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {racao.nutrientes?.map((n, i) => (
                  <tr key={i}>
                    <td>{n.nome}</td>
                    <td>{converterValor(n.valor, n.nome)}</td>

                    {!isUmida && (
                      <>
                        <td className="col-qualidade">
                          {n.qualidade === "bom" && <span className="emoji">👍</span>}
                        </td>
                        <td className="col-qualidade">
                          {n.qualidade === "medio" && <span className="emoji">👌</span>}
                        </td>
                        <td className="col-qualidade">
                          {n.qualidade === "ruim" && <span className="emoji">👎</span>}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>


            {/* 🔹 Aviso só para rações úmidas */}
            {isUmida && (
              <div className="dmb-info">
                <p>
                  💧 <strong>Esta é uma ração úmida:</strong> os valores exibidos foram
                  ajustados para <strong>Base de Matéria Seca (DMB)</strong>. Isso
                  remove o efeito da água, permitindo uma comparação justa com rações
                  secas. Apesar dos números parecerem baixos “como vendida”, o valor
                  nutricional real é altamente concentrado.
                </p>
              </div>
            )}
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

      {/* 🔹 Seção Premium */}
      <div className="premium-wrapper">
        <div className="premium-section">
          <img src={premiumGif} alt="Seja Premium" className="premium-gif" />
          <button className="premium-btn" onClick={scrollToPremium}>
            Clique aqui e seja Premium
          </button>

        </div>
      </div>

      <Footer />
    </>
  );
}
