import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NutripetNavbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import PerfilLayout from "../PerfilLayout/PerfilLayout";
import "../../assets/styles/perfil.css"
import api from "../../services/api";
import "../MinhaAssinatura/MinhaAssinatura.css"
import { User, FileText, CreditCard, KeyRound } from "lucide-react";

export default function MinhaAssinatura() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const [assinatura, setAssinatura] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [showCancelSuccess, setShowCancelSuccess] = useState(false);

  useEffect(() => {
    async function carregarStatus() {
      try {
        const res = await api.get(`/assinaturas/status/${user.id}`);
        setAssinatura(res.data);
      } catch (err) {
        console.error("Erro:", err);
      } finally {
        setLoading(false);
      }
    }

    carregarStatus();
  }, [user.id]);

  const menuItems = [
   // { label: "Minha Conta", icon: <User size={18} />, path: "/usuario/meusdados" },
    { label: "Meus Dados", icon: <FileText size={18} />, path: "/usuario/meusdados" },
    { label: "Minha Assinatura", icon: <CreditCard size={18} />, path: "/usuario/assinatura" },
    { label: "Alterar Senha", icon: <KeyRound size={18} />, path: "/usuario/senha" },
  ];

  if (loading) {
    return (
      <>
        <NutripetNavbar />
        <PerfilLayout menu={menuItems}>
          <p>Carregando informações...</p>
        </PerfilLayout>
        <Footer />
      </>
    );
  }

  const dados = assinatura?.assinatura;

  if (!dados || !assinatura?.ativo) {
    return (
      <>
        <NutripetNavbar />
        <PerfilLayout menu={menuItems}>
          <h2 className="titulo">Minha Assinatura</h2>
          <div className="assinatura-free text-center">
            <h3>Você ainda não é Premium</h3>
            <p>
              Tenha acesso aos melhores nutricionistas e análises exclusivas para o seu pet.
            </p>
            <button
              className="btn-assinar"
              onClick={() => navigate("/pagamento")}
            >
              Seja Premium
            </button>
          </div>
        </PerfilLayout>
        <Footer />
      </>
    );
  }

  const assinaturaId = dados.id;
  const handleConfirmCancel = async () => {
    try {
      setCancelLoading(true);

      await api.post(`/assinaturas/cancelar/${assinaturaId}`);

      setAssinatura(null);

      const updatedUser = { ...user, plano: "free", premium_expira_em: null };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setShowCancelModal(false);
      setShowCancelSuccess(true);
      setTimeout(() => setShowCancelSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Erro ao cancelar assinatura. Tente novamente.");
    } finally {
      setCancelLoading(false);
    }
  };

  return (
    <>
      <NutripetNavbar />

      <PerfilLayout menu={menuItems}>
        <h2 className="titulo">Minha Assinatura</h2>

        <div className="timeline-container">
          <h3 className="timeline-title">Status da Assinatura</h3>

          <div className="timeline-status">
            <div className="timeline-line" />

            <div className="timeline-step">
              <div className="timeline-step-icon">📝</div>
              <p>Pedido realizado</p>
              <small>
                {new Date(dados.data_inicio).toLocaleDateString("pt-BR")}
              </small>
            </div>

            <div className="timeline-step">
              <div className="timeline-step-icon">💰</div>
              <p>Pagamento confirmado</p>
              <small>
                {new Date(dados.data_inicio).toLocaleDateString("pt-BR")}
              </small>
            </div>

            <div className="timeline-step">
              <div className="timeline-step-icon">✔️</div>
              <p>Assinatura Premium efetuada</p>
              <small>
                {new Date(dados.data_inicio).toLocaleDateString("pt-BR")}
              </small>
            </div>
          </div>

          <div className="assinatura-info-box">
            <p>
              <strong>Status atual:</strong>{" "}
              <span className="badge-ativo">Ativa</span>
            </p>
            <p>
              <strong>Assinatura válida até:</strong>{" "}
              {dados.data_fim
                ? new Date(dados.data_fim).toLocaleDateString("pt-BR")
                : "—"}
            </p>

            <button
              type="button"
              className="btn-cancelar-assinatura"
              onClick={() => setShowCancelModal(true)}
            >
              Cancelar assinatura
            </button>
          </div>
        </div>
      </PerfilLayout>

      <Footer />

      {showCancelSuccess && (
        <div className="popup-success">
          Assinatura cancelada com sucesso.
        </div>
      )}

      {showCancelModal && (
        <div
          className="logout-modal-overlay"
          onClick={() => !cancelLoading && setShowCancelModal(false)}
        >
          <div
            className="logout-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Cancelar assinatura Premium?</h3>
            <p>
              Ao cancelar, você perderá todos os benefícios Premium imediatamente.
              O valor já pago não será estornado.
            </p>

            <div className="logout-modal-actions">
              <button
                className="btn-cancelar"
                type="button"
                onClick={() => setShowCancelModal(false)}
                disabled={cancelLoading}
              >
                Manter Premium
              </button>

              <button
                className="btn-sair"
                type="button"
                onClick={handleConfirmCancel}
                disabled={cancelLoading}
              >
                {cancelLoading ? "Cancelando..." : "Cancelar mesmo assim"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}