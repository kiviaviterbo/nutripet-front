import React, { useEffect, useState } from "react";
import NutripetNavbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import PerfilLayout from "../PerfilLayout/PerfilLayout";
import api from "../../services/api";
import "./Cupons.css";
import { Tag, Gift } from "lucide-react";

export default function Cupons() {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [assinatura, setAssinatura] = useState(null);
  const [loading, setLoading] = useState(true);
  const [popupCopiado, setPopupCopiado] = useState(false);

  const menuPromos = [
    { label: "Cupons", icon: <Tag size={18} />, path: "/usuario/cupons" },
    { label: "Sorteios", icon: <Gift size={18} />, path: "/usuario/sorteios" },
  ];

  useEffect(() => {
    async function carregar() {
      try {
        const res = await api.get(`/assinaturas/status/${user.id}`);
        setAssinatura(res.data);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, []);

  if (loading) return;

  const isPremium = assinatura?.ativo;

  if (!isPremium) {
    return (
      <>
        <NutripetNavbar />
        <PerfilLayout menu={menuPromos}>
          <h2 className="titulo">Cupons</h2>
          <div className="assinatura-free text-center">
            <h3>Recurso exclusivo para assinantes Premium</h3>
            <button className="btn-assinar" onClick={() => (window.location.href = "/pagamento")}>
              Seja Premium
            </button>
          </div>
        </PerfilLayout>
        <Footer />
      </>
    );
  }

  const cupons = [
    {
      porcentagem: "10%",
      titulo: "10% OFF na Cobasi",
      cashback: "+ até 4,5% de cashback",
      descricao: "Válido na compra de ração seca para cães e gatos sem valor mínino",
      codigo: "NUTRIPET10",
    },
    {
      porcentagem: "25%",
      titulo: "25% OFF na Cobasi",
      cashback: "+ até 3,5% de cashback",
      descricao: "Oferta especial para compras de rações secas ou úmidas acima de R$250,00",
      codigo: "NUTRI25",
    },
    {
      porcentagem: "10%",
      titulo: "10% OFF na Petz",
      descricao: "Válido em toda a linha Premier, exceto rações medicamentosas",
      codigo: "NUTRIPREMIER10",
    },
  ];

  const copiar = (codigo) => {
    navigator.clipboard.writeText(codigo);
    setPopupCopiado(true);
    setTimeout(() => setPopupCopiado(false), 2200);
  };

  return (
    <>
      <NutripetNavbar />

      <PerfilLayout menu={menuPromos}>
        <h2 className="titulo">Cupons de Desconto</h2>

        <div className="promo-content">
          {cupons.map((c, i) => (
            <div className="promo-card" key={i}>
              <div className="promo-left">
                <div className="promo-percent">
                  {c.porcentagem}
                  <span>OFF</span>
                </div>
                {c.cashback && <p className="promo-cashback">{c.cashback}</p>}
              </div>

              <div className="promo-middle">
                <h3>{c.titulo}</h3>
                <p>{c.descricao}</p>
              </div>

              <button className="promo-code-btn" onClick={() => copiar(c.codigo)}>
                <span className="codigo">{c.codigo}</span>
                <small>Clique e Copie</small>
              </button>

            </div>
          ))}
        </div>
      </PerfilLayout>

      <Footer />

      {popupCopiado && <div className="np-popup">Código copiado!</div>}
    </>
  );
}
