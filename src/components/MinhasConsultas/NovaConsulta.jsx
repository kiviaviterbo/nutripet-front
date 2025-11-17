import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NutripetNavbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import PerfilLayout from "../PerfilLayout/PerfilLayout";
import "../../assets/styles/perfil.css";
import "./NovaConsulta.css";
import api from "../../services/api";
import { FileText, KeyRound } from "lucide-react";


export default function NovaConsulta() {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [infoAdicionais, setInfoAdicionais] = useState("");
  const [limitePopup, setLimitePopup] = useState(false);
  const [limiteMsg, setLimiteMsg] = useState("");
  const navigate = useNavigate();

  const [assinatura, setAssinatura] = useState(null);
  const [loading, setLoading] = useState(true);

  const menuConsultas = [
    { label: "Nova Consulta", icon: <FileText size={18} />, path: "/usuario/consultas/nova" },
    { label: "Minhas Consultas", icon: <FileText size={18} />, path: "/usuario/consultas" },
    { label: "SAC", icon: <KeyRound size={18} />, path: "/usuario/consultas/saq" },
  ];

  const [formData, setFormData] = useState({
    nome_pet: "",
    peso: "",
    especie: "",
    raca: "",
    genero: "",

    castrado: false,
    senior: false,
    filhote: false,
    vacinado: false,
    renal: false,
    obesidade: false,
    diabete: false,
    doenca_carrapato: false,
    sedentario: false,
    convive_outros: false,
  });

  const [documento, setDocumento] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successPopup, setSuccessPopup] = useState(false);

  useEffect(() => {
    async function carregarStatus() {
      try {
        const res = await api.get(`/assinaturas/status/${user.id}`);
        setAssinatura(res.data);
      } catch (err) {
        console.error("Erro ao carregar status da assinatura:", err);
      } finally {
        setLoading(false);
      }
    }

    if (user.id) {
      carregarStatus();
    } else {
      setLoading(false);
    }
  }, [user.id]);

  const atualizarBooleano = (campo) => {
    let updated = { ...formData };

    if (campo === "senior") {
      updated.senior = !updated.senior;
      if (updated.senior) updated.filhote = false;
    } else if (campo === "filhote") {
      updated.filhote = !updated.filhote;
      if (updated.filhote) updated.senior = false;
    } else {
      updated[campo] = !updated[campo];
    }

    setFormData(updated);
  };

  const enviarConsulta = async () => {
    try {
      const form = new FormData();
      Object.entries(formData).forEach(([k, v]) => form.append(k, v));
      form.append("usuario_id", user.id);
      form.append("documento", documento);

      await api.post("/consultas", form);
      setConfirmOpen(false);
      setSuccessPopup(true);
      navigate("/usuario/consultas");

    } catch (err) {
      setConfirmOpen(false);

      if (err.response?.status === 403) {
        const msg =
          err.response.data?.msg ||
          "Limite atingido: máximo de 2 consultas por CPF cadastrado. Aguarde a renovação do contrato.";

        setLimiteMsg(msg);
        setLimitePopup(true);
        return;
      }

      setLimiteMsg("Erro ao enviar consulta. Tente novamente mais tarde.");
      setLimitePopup(true);
    }
  };
  if (loading) {
    return (
      <>
        <NutripetNavbar />
        <PerfilLayout menu={menuConsultas}>
          <h2 className="titulo">Nova Consulta</h2>
          <p>Carregando informações da sua assinatura...</p>
        </PerfilLayout>
        <Footer />
      </>
    );
  }

  const dados = assinatura?.assinatura;
  const isPremium = !!dados && assinatura?.ativo;
  if (!isPremium) {
    return (
      <>
        <NutripetNavbar />
        <PerfilLayout menu={menuConsultas}>
          <h2 className="titulo">Nova Consulta</h2>
          <div className="assinatura-free text-center">
            <h3>Recurso exclusivo para usuários Premium</h3>
            <p>
              Para enviar consultas com nutricionistas veterinários,
              você precisa ser assinante Premium.
            </p>
            <button
              className="btn-assinar"
              onClick={() => (window.location.href = "/pagamento")}
            >
              Seja Premium
            </button>
          </div>
        </PerfilLayout>
        <Footer />
      </>
    );
  }

  return (
    <>
      <NutripetNavbar />

      <PerfilLayout menu={menuConsultas}>
        <h2 className="titulo">Nova Consulta</h2>

        <form className="nc-form" onSubmit={(e) => e.preventDefault()}>
          <label className="nc-label">Nome do Pet</label>
          <input
            className="nc-input"
            type="text"
            value={formData.nome_pet}
            onChange={(e) => setFormData({ ...formData, nome_pet: e.target.value })}
          />
          <label className="nc-label">Peso (kg)</label>
          <input
            className="nc-input"
            type="number"
            value={formData.peso}
            onChange={(e) => setFormData({ ...formData, peso: e.target.value })}
          />
          <label className="nc-label">Espécie</label>
          <select
            className="nc-input"
            value={formData.especie}
            onChange={(e) => setFormData({ ...formData, especie: e.target.value })}
          >
            <option value="">Selecione</option>
            <option value="canino">Canino</option>
            <option value="felino">Felino</option>
          </select>
          <label className="nc-label">Gênero</label>
          <div className="nc-radio-group">
            <label>
              <input
                type="radio"
                name="genero"
                value="macho"
                onChange={(e) => setFormData({ ...formData, genero: e.target.value })}
              />{" "}
              Macho
            </label>
            <label>
              <input
                type="radio"
                name="genero"
                value="femea"
                onChange={(e) => setFormData({ ...formData, genero: e.target.value })}
              />{" "}
              Fêmea
            </label>
          </div>
          <label className="nc-label">Raça</label>
          <input
            className="nc-input"
            type="text"
            value={formData.raca}
            onChange={(e) => setFormData({ ...formData, raca: e.target.value })}
          />
          <h3 className="nc-subtitle">Selecione as Condições do Pet</h3>

          <div className="nc-checkbox-grid">
            {Object.keys(formData)
              .filter((k) => typeof formData[k] === "boolean")
              .map((campo) => {
                let label = campo
                  .replace(/_/g, " ")
                  .replace("doenca", "doença");

                const capitalize = (txt) =>
                  txt.charAt(0).toUpperCase() + txt.slice(1);

                if (campo === "convive_outros") {
                  label = "Convive com outros animais";
                } else if (campo === "senior") {
                  label = (
                    <>
                      <strong>Senior</strong> (+ 7 anos de idade)
                    </>
                  );
                } else if (campo === "doenca_carrapato") {
                  label = 'Histórico de "Doença do Carrapato"';
                } else if (campo === "filhote") {
                  label = (
                    <>
                      <strong>Filhote</strong> (- 1 ano de idade)
                    </>
                  );
                } else if (campo === "castrado") {
                  label = <strong>Castrado</strong>;
                } else {
                  label = capitalize(label);
                }

                return (
                  <label key={campo} className="nc-check-item">
                    <input
                      type="checkbox"
                      checked={formData[campo]}
                      onChange={() => atualizarBooleano(campo)}
                    />
                    {label}
                  </label>
                );
              })}
          </div>
          <label className="nc-label">Informações Adicionais</label>
          <textarea
            className="nc-textarea"
            placeholder="Digite aqui informações extras sobre o pet, comportamento, rotina, alimentação atual, observações importantes..."
            value={infoAdicionais}
            onChange={(e) => setInfoAdicionais(e.target.value)}
          />
          <label className="nc-label">Documento (PDF)</label>
          <p className="nc-file-hint">
            Envie um arquivo em <strong>formato PDF</strong> contendo o{" "}
            <strong>histórico de exames</strong> e
            <strong> receitas médicas</strong> realizadas nos últimos{" "}
            <strong>6 meses</strong>. Esse documento é importante para que o
            nutricionista avalie corretamente a saúde do seu pet.
          </p>
          <input
            className="nc-file"
            type="file"
            accept="application/pdf"
            onChange={(e) => setDocumento(e.target.files[0])}
          />
          <button
            type="button"
            className="nc-submit-btn"
            onClick={() => setConfirmOpen(true)}
          >
            Enviar Consulta
          </button>
        </form>
      </PerfilLayout>

      <Footer />
      {confirmOpen && (
        <div className="nc-modal-overlay">
          <div className="nc-modal">
            <h3>Confirmar envio?</h3>
            <p>Após enviar, você não poderá editar esta consulta.</p>

            <div className="nc-modal-actions">
              <button
                className="nc-modal-btn-cancel"
                onClick={() => setConfirmOpen(false)}
              >
                Voltar
              </button>
              <button
                className="nc-modal-btn-confirm"
                onClick={enviarConsulta}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
      {successPopup && (
        <div className="nc-popup">Consulta enviada com sucesso!</div>
      )}
      {limitePopup && (
        <div
          className="nc-limit-overlay"
          onClick={() => setLimitePopup(false)}
        >
          <div
            className="nc-limit-card"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>⚠️ Limite de Consultas Atingido</h3>
            <p>{limiteMsg}</p>

            <button
              className="nc-limit-btn"
              onClick={() => setLimitePopup(false)}
            >
              Entendi
            </button>
          </div>
        </div>
      )}
    </>
  );
}
