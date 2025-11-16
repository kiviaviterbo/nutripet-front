import React, { useEffect, useState } from "react";
import NutripetNavbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import PerfilLayout from "../PerfilLayout/PerfilLayout";
import "../../assets/styles/perfil.css"
import api from "../../services/api";
import petDefault from "../../assets/images/cao_gato.png";
import { PawPrint, PlusCircle } from "lucide-react";
import "./MeusPets.css";

export default function MeusPets() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [editando, setEditando] = useState(null);
  const [petEdit, setPetEdit] = useState({});
  const [foto, setFoto] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [petSelecionado, setPetSelecionado] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    async function carregarPets() {
      try {
        const res = await api.get(`/pets?usuario_id=${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPets(res.data);
      } catch {
        setErro("Não foi possível carregar seus pets.");
      } finally {
        setLoading(false);
      }
    }
    carregarPets();
  }, []);

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "nutripet_pets");
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/duamd54as/image/upload",
      { method: "POST", body: formData }
    );
    const data = await res.json();
    return data.secure_url || null;
  };

  const handleEditar = (pet) => {
    setEditando(pet.id);
    setPetEdit({ ...pet });
    setFoto(null);
  };

  const handleCancelar = () => {
    setEditando(null);
    setPetEdit({});
    setFoto(null);
  };

  const confirmarExclusao = (pet) => {
    setPetSelecionado(pet);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/pets/${petSelecionado.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPets((prev) => prev.filter((p) => p.id !== petSelecionado.id));
    } catch {
      alert("Erro ao excluir pet.");
    } finally {
      setShowModal(false);
      setPetSelecionado(null);
    }
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    setSalvando(true);
    try {
      let imageUrl = petEdit.imagem_url || petEdit.imagemUrl || null;
      if (foto) imageUrl = await handleImageUpload(foto);

      const res = await api.put(
        `/pets/${editando}`,
        { ...petEdit, imagem_url: imageUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPets((prev) => prev.map((p) => (p.id === editando ? res.data : p)));
      handleCancelar();

      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2500);
    } catch {
      alert("Erro ao salvar alterações.");
    } finally {
      setSalvando(false);
    }
  };

  // === MENU PADRÃO (dinâmico) ===
  const menu = [
    { label: "Cadastrar Pet", path: "/meupet/cadastrar", icon: <PlusCircle size={18} /> },
    { label: "Meus Pets", path: "/meupet/listar", icon: <PawPrint size={18} /> },
  ];

  return (
    <>
      <NutripetNavbar />

      {/* 🔥 LAYOUT GLOBAL DE PERFIL */}
      <PerfilLayout menu={menu}>
       {/*  <h2 className="titulo">Meus Pets</h2> */}

        {/* 🔥 SEU CÓDIGO ORIGINAL INTACTO 🔥 */}
        <section className="meuspets-section">
          <div className="meuspets-container">
            <h2 className="meuspets-title">
              Meus Pets <span>({pets.length})</span>
            </h2>

            {loading ? (
              <p className="text-center">Carregando...</p>
            ) : erro ? (
              <p className="text-center erro">{erro}</p>
            ) : pets.length === 0 ? (
              <p className="meuspets-empty">
                Você ainda não cadastrou nenhum pet.
              </p>
            ) : (
              <div className="meuspets-grid">
                {pets.map((pet) => (
                  <div key={pet.id} className="pet-card">
                    {editando === pet.id ? (
                      <form onSubmit={handleSalvar}>
                        <div className="preview">
                          <img
                            src={
                              foto
                                ? URL.createObjectURL(foto)
                                : petEdit.imagem_url || petDefault
                            }
                            alt="Preview"
                          />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setFoto(e.target.files[0])}
                          />
                        </div>

                        <label>Nome</label>
                        <input
                          type="text"
                          value={petEdit.nome || ""}
                          onChange={(e) =>
                            setPetEdit({ ...petEdit, nome: e.target.value })
                          }
                        />

                        <label>Espécie</label>
                        <select
                          value={petEdit.especie || ""}
                          onChange={(e) =>
                            setPetEdit({ ...petEdit, especie: e.target.value })
                          }
                        >
                          <option value="">Selecione</option>
                          <option value="Canina">Canina</option>
                          <option value="Felina">Felina</option>
                        </select>

                        <label>Gênero</label>
                        <div className="radio-group">
                          {["Macho", "Fêmea"].map((g) => (
                            <label key={g}>
                              <input
                                type="radio"
                                name={`genero-${pet.id}`}
                                value={g}
                                checked={petEdit.genero === g}
                                onChange={(e) =>
                                  setPetEdit({ ...petEdit, genero: e.target.value })
                                }
                              />
                              {g}
                            </label>
                          ))}
                        </div>

                        <label>Raça</label>
                        <input
                          type="text"
                          value={petEdit.raca || ""}
                          onChange={(e) =>
                            setPetEdit({ ...petEdit, raca: e.target.value })
                          }
                        />

                        <div className="grid2">
                          <div>
                            <label>Idade (anos)</label>
                            <input
                              type="number"
                              value={petEdit.idade ?? ""}
                              onChange={(e) =>
                                setPetEdit({ ...petEdit, idade: e.target.value })
                              }
                            />
                          </div>
                          <div>
                            <label>Peso (kg)</label>
                            <input
                              type="number"
                              step="0.1"
                              value={petEdit.peso ?? ""}
                              onChange={(e) =>
                                setPetEdit({ ...petEdit, peso: e.target.value })
                              }
                            />
                          </div>
                        </div>

                        <div className="edit-actions">
                          <button type="submit" className="btn-save" disabled={salvando}>
                            {salvando ? "Salvando..." : "Salvar"}
                          </button>
                          <button type="button" className="btn-cancel" onClick={handleCancelar}>
                            Cancelar
                          </button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <img
                          src={pet.imagem_url || petDefault}
                          alt={pet.nome}
                          className="pet-foto"
                        />
                        <h5>{pet.nome}</h5>
                        <p>
                          {pet.especie} • {pet.raca || "SRD"}
                        </p>
                        <p className="pet-id">
                          {pet.idade} ano(s) • {pet.peso} kg
                        </p>

                        <div className="pet-actions">
                          <button className="btn-edit" onClick={() => handleEditar(pet)}>
                            Editar
                          </button>
                          <button className="btn-delete" onClick={() =>
                            confirmarExclusao(pet)
                          }>
                            Excluir
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => (window.location.href = "/meupet/cadastrar")}
              className="btn-novopet"
            >
              + Cadastrar Novo Pet
            </button>
          </div>
        </section>

        {showPopup && <div className="popup-success">Alterado com sucesso!</div>}

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-card">
              <h4>Excluir Pet</h4>
              <p>
                Tem certeza que deseja excluir <b>{petSelecionado?.nome}</b>?
                <br />
                Essa ação não poderá ser desfeita.
              </p>
              <div className="modal-actions">
                <button className="btn-cancel" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button className="btn-delete" onClick={handleDelete}>
                  Excluir
                </button>
              </div>
            </div>
          </div>
        )}

      </PerfilLayout>

      <Footer />
    </>
  );
}
