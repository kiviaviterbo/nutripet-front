import React, { useEffect, useState } from "react";
import NutripetNavbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import api from "../../services/api";
import "./NutritionTable.css";
import { useNavigate } from "react-router-dom";
//import tabelanutricional from "../../assets/images/tabelanutricional.gif";

export default function NutritionTable() {
  const [feeds, setFeeds] = useState([]);
  const [filters, setFilters] = useState({
    marca: [],
    tipo: [],
    especie: [],
    variacao: [],
  });
  const [options, setOptions] = useState({
    marcas: [],
    tipos: [],
    especies: [],
    variacoes: [],
  });
  const [expanded, setExpanded] = useState({});
  const [ordem, setOrdem] = useState("a_z");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🔹 Carregar filtros
  useEffect(() => {
    async function carregarFiltros() {
      try {
        const res = await api.get("/tabelas/filtros");
        console.log("Filtros recebidos:", res.data);
        setOptions({
          marcas: res.data.marcas || [],
          tipos: res.data.tipos || [],
          especies: res.data.especies || [],
          variacoes: res.data.variacoes || [],
        });
      } catch (err) {
        console.error("Erro ao buscar filtros", err);
      }
    }
    carregarFiltros();
  }, []);

  useEffect(() => {
    carregarRacoes();
  }, [filters, search, ordem]);

  async function carregarRacoes() {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (search.trim()) params.append("nome", search.trim());
      Object.entries(filters).forEach(([key, values]) => {
        if (values.length > 0) params.append(key, values.join(","));
      });

      const res = await api.get(`/tabelas?${params.toString()}`);
      console.log("📦 Rações recebidas:", res.data);

      const data = res.data || [];
      const ordenado =
        ordem === "a_z"
          ? data.sort((a, b) => a.nome.localeCompare(b.nome))
          : data.sort((a, b) => b.nome.localeCompare(a.nome));

      setFeeds(ordenado);
    } catch (err) {
      console.error("Erro ao buscar rações", err);
    } finally {
      setLoading(false);
    }
  }

  const toggleExpand = (key) =>
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggleFilter = (categoria, valor) =>
    setFilters((prev) => {
      const arr = prev[categoria];
      return {
        ...prev,
        [categoria]: arr.includes(valor)
          ? arr.filter((v) => v !== valor)
          : [...arr, valor],
      };
    });

  const limparFiltros = () => {
    setFilters({ marca: [], tipo: [], especie: [], variacao: [] });
    setSearch("");
  };

  return (
    <>
      <NutripetNavbar />
      <section className="nutrition-section">
        <div className="nutrition-container">
          {/* ==== SIDEBAR ==== */}
          <aside className="sidebar">
            <h4 className="sidebar-title">Filtros</h4>

            {[
              { key: "marca", label: "Marca", list: options.marcas },
              { key: "tipo", label: "Tipo", list: options.tipos },
              { key: "especie", label: "Espécie", list: options.especies },
              { key: "variacao", label: "Variação", list: options.variacoes },
            ].map(({ key, label, list }) => (
              <div key={key} className="filter-box">
                <h5 onClick={() => toggleExpand(key)}>
                  {label} <span>{expanded[key] ? "−" : "+"}</span>
                </h5>
                {expanded[key] && (
                  <div className="filter-options">
                    {list.length > 0 ? (
                      list.map((opt) => (
                        <label key={opt}>
                          <input
                            type="checkbox"
                            checked={filters[key].includes(opt)}
                            onChange={() => toggleFilter(key, opt)}
                          />{" "}
                          {opt}
                        </label>
                      ))
                    ) : (
                      <p className="no-options">Nenhum item disponível</p>
                    )}
                  </div>
                )}
              </div>
            ))}

            <button onClick={limparFiltros} className="btn-clear">
              Limpar filtros
            </button>
          </aside>

          {/* ==== CONTEÚDO PRINCIPAL ==== */}
          <main className="content">
            <div className="header-content">
              <div>
                <h2>Rações</h2>
                <p>
                  Explore rações filtradas por marca, tipo,espécie ou variação — ou busque pelo nome.
                </p>
              </div>
              <div className="order-box">
                <label>Ordenar por:</label>
                <select
                  value={ordem}
                  onChange={(e) => setOrdem(e.target.value)}
                >
                  <option value="a_z">A-Z</option>
                  <option value="z_a">Z-A</option>
                </select>
              </div>
            </div>

            {/* === CAMPO DE BUSCA === */}
            <div className="search-box">
              <input
                type="text"
                placeholder="🔍 Buscar ração por nome..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {loading ? (
              <p className="loading">Carregando...</p>
            ) : (
              <div className="feed-grid">
                {feeds.length === 0 ? (
                  <p className="no-results">
                    Nenhuma ração encontrada. Tente outro nome ou filtro.
                  </p>
                ) : (
                  feeds.map((feed) => (
                    <div
                      key={feed.id}
                      className="feed-card"
                      onClick={() => navigate(`/racao/${feed.id}`)}
                    >
                      <img
                        src={feed.imagem_url}
                        alt={feed.nome}
                      />
                      <h5>{feed.nome}</h5>
                      <p>{feed.marca}</p>
                      <small>
                        {feed.tipo} • {feed.especie} • {feed.variacao}
                      </small>
                    </div>
                  ))
                )}
              </div>
            )}
          </main>
        </div>
      </section>
      <Footer />
    </>
  );
}
