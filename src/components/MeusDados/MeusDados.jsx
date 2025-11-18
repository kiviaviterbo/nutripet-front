import { useState, useEffect } from "react";
import PerfilLayout from "../PerfilLayout/PerfilLayout";
import NutripetNavbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import api from "../../services/api";
import "../../assets/styles/perfil.css";
import "./MeusDados.css"
import { User, FileText, CreditCard, KeyRound, Pencil, Check, X } from "lucide-react";

export default function MeusDados() {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [popup, setPopup] = useState({ show: false, type: "", message: "" });
  const formatarDataBR = (dataISO) => {
    if (!dataISO) return "";
    const [ano, mes, dia] = dataISO.split("-");
    return `${dia}/${mes}/${ano}`;
  };


  const showPopup = (type, message) => {
    setPopup({ show: true, type, message });

    setTimeout(() => {
      setPopup({ show: false, type: "", message: "" });
    }, 2500);
  };

  const [form, setForm] = useState({
    nome: "",
    email: "",
    cep: "",
    endereco: "",
    numero: "",
    estado: "",
    bairro: "",
    data_nascimento: "",
    profissao: "",
    renda: "",
    celular: "",
  });

  const formatarCEP = (value) =>
    value.replace(/\D/g, "").slice(0, 8).replace(/(\d{5})(\d{1,3})/, "$1-$2");

  const formatarCelular = (value) =>
    value
      .replace(/\D/g, "")
      .slice(0, 11)
      .replace(/(\d{2})(\d{1})(\d{4})(\d{1,4})/, "($1) $2$3-$4");

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/usuarios/${user.id}`);
        const u = res.data;

        setForm({
          nome: u.nome || "",
          email: u.email || "",
          cep: u.cep || "",
          endereco: u.endereco || "",
          numero: u.numero || "",
          estado: u.estado || "",
          bairro: u.bairro || "",
          data_nascimento: u.data_nascimento || "",
          profissao: u.profissao || "",
          renda: u.renda || "",
          celular: u.celular || "",
        });
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      }
    })();
  }, []);

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "cep") value = formatarCEP(value);
    if (name === "celular") value = formatarCelular(value);

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.put(`/usuarios/${user.id}`, form);

      localStorage.setItem("user", JSON.stringify({ ...user, ...form }));

      showPopup("success", "Dados atualizados com sucesso!");

      setEditMode(false);
    } catch (err) {
      console.error(err);
      showPopup("error", "Erro ao atualizar dados.");
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    //{ label: "Minha Conta", icon: <User size={18} />, path: "/usuario/meusdados" },
    { label: "Meus Dados", icon: <FileText size={18} />, path: "/usuario/meusdados" },
    { label: "Minha Assinatura", icon: <CreditCard size={18} />, path: "/usuario/assinatura" },
    { label: "Alterar Senha", icon: <KeyRound size={18} />, path: "/usuario/senha" },
  ];
  const InfoRow = ({ label, value }) => (
    <div className="info-row">
      <strong>{label}</strong>
      <span>{value || "—"}</span>
    </div>
  );

  return (
    <>
      <NutripetNavbar />

      <PerfilLayout menu={menuItems}>
        {popup.show && (
          <div className={`popup-overlay ${popup.type}`}>
            <div className="popup-box">
              <p>{popup.message}</p>
            </div>
          </div>
        )}
        <h2 className="titulo">Meus Dados</h2>
        {!editMode && (
          <div className="dados-box">
            <InfoRow label="Nome" value={form.nome} />
            <InfoRow label="Email" value={form.email} />
            <InfoRow label="Celular" value={form.celular} />
            <InfoRow label="Data de Nascimento" value={formatarDataBR(form.data_nascimento)} />
            <InfoRow label="CEP" value={form.cep} />
            <InfoRow label="Endereço" value={form.endereco} />
            <InfoRow label="Número" value={form.numero} />
            <InfoRow label="Bairro" value={form.bairro} />
            <InfoRow label="Estado" value={form.estado} />
            <InfoRow label="Profissão" value={form.profissao} />
            <InfoRow label="Renda" value={form.renda ? `R$ ${form.renda}` : ""} />

            <button className="btn-editar" onClick={() => setEditMode(true)}>
              <Pencil size={18} /> Editar meus dados
            </button>
          </div>
        )}

        {editMode && (
          <form className="perfil-form" onSubmit={handleSubmit}>
            <label>Nome</label>
            <input name="nome" type="text" value={form.nome} onChange={handleChange} required />

            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required />

            <label>Celular</label>
            <input name="celular" type="text" value={form.celular} onChange={handleChange} />

            <label>Data de Nascimento</label>
            <input name="data_nascimento" type="date" value={form.data_nascimento} onChange={handleChange} />

            <label>CEP</label>
            <input name="cep" type="text" value={form.cep} onChange={handleChange} placeholder="00000-000" />

            <label>Endereço</label>
            <input name="endereco" type="text" value={form.endereco} onChange={handleChange} />

            <label>Número</label>
            <input name="numero" type="text" value={form.numero} onChange={handleChange} />

            <label>Bairro</label>
            <input name="bairro" type="text" value={form.bairro} onChange={handleChange} />

            <label>Estado</label>
            <input
              name="estado"
              type="text"
              maxLength={2}
              value={form.estado}
              onChange={(e) => setForm({ ...form, estado: e.target.value.toUpperCase() })}
            />

            <label>Profissão</label>
            <input name="profissao" type="text" value={form.profissao} onChange={handleChange} />

            <label>Renda (R$)</label>
            <input name="renda" type="number" value={form.renda} onChange={handleChange} />

            <div className="edit-buttons">
              <button type="submit" className="btn-save" disabled={loading}>
                <Check size={18} />
                {loading ? "Salvando..." : "Salvar Alterações"}
              </button>

              <button type="button" className="btn-cancel" onClick={() => setEditMode(false)}>
                <X size={18} /> Cancelar
              </button>
            </div>
          </form>
        )}
      </PerfilLayout>

      <Footer />
    </>
  );
}
