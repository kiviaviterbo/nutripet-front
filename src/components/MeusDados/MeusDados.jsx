import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PerfilLayout from "../PerfilLayout/PerfilLayout";
import "../../assets/styles/perfil.css"
import NutripetNavbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { User, FileText, Calendar, KeyRound, LogOut, CreditCard } from "lucide-react";
import api from "../../services/api";

export default function MeusDados() {
  const [form, setForm] = useState({ nome: "", email: "" });
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    setForm({ nome: user.nome || "", email: user.email || "" });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.put(`/usuarios/${user.id}`, form);
      localStorage.setItem("user", JSON.stringify({ ...user, ...form }));
      alert("Dados atualizados com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar dados.");
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { label: "Minha Conta", icon: <User size={18} />, path: "/usuario/meusdados" },
    { label: "Meus Dados", icon: <FileText size={18} />, path: "/usuario/meusdados" },
    { label: "Minha Assinatura", icon: <CreditCard size={18} />, path: "/usuario/assinatura" },
    { label: "Alterar Senha", icon: <KeyRound size={18} />, path: "/usuario/senha" },
  ];

  return (
    <>
      <NutripetNavbar />

      <PerfilLayout menu={menuItems}>
        <h2 className="titulo">Meus Dados</h2>

        <form onSubmit={handleSubmit} className="perfil-form">
          <label>Nome</label>
          <input
            type="text"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            required
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Salvar Alterações"}
          </button>
        </form>
      </PerfilLayout>

      <Footer />
    </>
  );
}