import React, { useState, useEffect } from 'react';
import NutripetNavbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import './EditarPerfil.css';
import api from '../../services/api';


export default function EditarPerfil() {
  const [form, setForm] = useState({ nome: '', email: '' });
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem('user')) || {};

  useEffect(() => {
    setForm({ nome: user.nome || '', email: user.email || '' });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/usuarios/${user.id}`, form);
      alert('Perfil atualizado com sucesso!');
      localStorage.setItem('user', JSON.stringify({ ...user, ...form }));
    } catch (err) {
      console.error(err);
      alert('Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NutripetNavbar />
      <section className="editar-perfil-section">
        <div className="container">
          <h2 className="titulo">Editar Perfil</h2>
          <form className="editar-perfil-form" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Nome</label>
              <input
                type="text"
                name="nome"
                value={form.nome}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </form>
        </div>
      </section>
      <Footer />
    </>
  );
}
