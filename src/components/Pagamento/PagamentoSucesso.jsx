import { useParams, useNavigate } from "react-router-dom";
import NutripetNavbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import "./PagamentoSucesso.css";

export default function PagamentoSucesso() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <>
      <NutripetNavbar />
      <section className="pagamento-sucesso-section">
        <div className="pagamento-sucesso-card">
          <h2>Solicitação realizada com sucesso! 🎉</h2>
          <p className="psucesso-msg">
            Sua assinatura foi registrada e está aguardando confirmação.
          </p>
          <p className="psucesso-protocolo">
            <strong>Número do protocolo:</strong> {id}
          </p>
          <p className="psucesso-info">
            Acompanhe as próximas etapas diretamente na sua página de assinatura.
          </p>
          <button
            className="btn-premium-info"
            onClick={() => navigate("/usuario/assinatura")}
          >
            Ir para "Minha Assinatura"
          </button>
        </div>
      </section>
      <Footer />
    </>
  );
}
