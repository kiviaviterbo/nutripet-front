import React, { useState } from "react";
import NutripetNavbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import petDefault from "../../assets/images/cao_gato.png";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import "./CadastrarPet.css";

export default function CadastrarPet() {
  const [form, setForm] = useState({
    nome: "",
    especie: "",
    genero: "",
    raca: "",
    idade: "",
    peso: "",
    imagem_url: "",
  });

  const [foto, setFoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "nutripet_pets");

    const res = await fetch("https://api.cloudinary.com/v1_1/duamd54as/image/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data.secure_url) return data.secure_url;
    throw new Error("Erro ao enviar imagem.");
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = form.imagem_url;
      if (foto) imageUrl = await handleImageUpload(foto);

      const petData = { ...form, usuario_id: user?.id, imagem_url: imageUrl };

      await api.post("/pets", petData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        navigate("/meupet/listar");
      }, 2500);
    } catch (error) {
      console.error("Erro ao cadastrar pet:", error);
      alert("Erro ao cadastrar pet. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NutripetNavbar />

      <section className="cadastrarpet-section">
        <div className="form-wrapper">
          <div className="form-card">
            <h2>Cadastrar Pet</h2>
            <p>Preencha as informações do seu pet para continuar.</p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nome</label>
                <input
                  type="text"
                  name="nome"
                  placeholder="Digite o nome"
                  value={form.nome}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Espécie</label>
                <select
                  name="especie"
                  value={form.especie}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione</option>
                  <option value="Canina">Canina</option>
                  <option value="Felina">Felina</option>
                </select>
              </div>

              <div className="form-group">
                <label>Gênero</label>
                <div className="radio-group">
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="genero"
                      value="Macho"
                      checked={form.genero === "Macho"}
                      onChange={handleChange}
                    />
                    Macho
                  </label>
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="genero"
                      value="Fêmea"
                      checked={form.genero === "Fêmea"}
                      onChange={handleChange}
                    />
                    Fêmea
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label>Raça</label>
                <input
                  type="text"
                  name="raca"
                  placeholder="Ex: Labrador, SRD..."
                  value={form.raca}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Idade (anos)</label>
                <input
                  type="number"
                  name="idade"
                  placeholder="Ex: 2"
                  min="0"
                  value={form.idade}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Peso (kg)</label>
                <input
                  type="number"
                  name="peso"
                  placeholder="Ex: 10.5"
                  min="0"
                  step="0.1"
                  value={form.peso}
                  onChange={handleChange}
                />
              </div>

              <div className="preview-container">
                <label>Foto do Pet</label>
                <img
                  src={foto ? URL.createObjectURL(foto) : petDefault}
                  alt="Preview"
                  className="pet-preview"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFoto(e.target.files[0])}
                  className="file-input"
                />
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="cadastrarpet-btn"
                  disabled={loading}
                >
                  {loading ? "Salvando..." : "Cadastrar"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/meupet/listar")}
                  className="cancelar-btn"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

     {showPopup && <div className="popup-success">Cadastrado com sucesso!</div>}


      <Footer />
    </>
  );
}
