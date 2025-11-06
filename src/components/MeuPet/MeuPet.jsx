import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Modal, Spinner, Toast, ToastContainer } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import NutripetNavbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import "./MeuPet.css";
import petDefault from "../../assets/images/cao_gato.png";

export default function MeuPet() {
  const [pets, setPets] = useState([]);
  const [foto, setFoto] = useState(null);
  const [editando, setEditando] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [petSelecionado, setPetSelecionado] = useState(null);
  const [toast, setToast] = useState({ show: false, text: "", bg: "" });
  const [novoPet, setNovoPet] = useState({
    nome: "",
    especie: "",
    raca: "",
    idade: "",
    peso: "",
    genero: "",
    imagem_url: "",
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!token) {
      setLoading(false);
      navigate("/auth");
      return;
    }

    api
      .get(`/pets?usuario_id=${user.id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setPets(res.data))
      .catch(() => setToast({ show: true, text: "Erro ao carregar pets", bg: "danger" }))
      .finally(() => setLoading(false));
  }, [navigate, token, user?.id]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = novoPet.imagem_url || null;
      if (foto) imageUrl = await handleImageUpload(foto);

      const petData = { ...novoPet, usuario_id: user.id, imagem_url: imageUrl };

      if (editando) {
        const res = await api.put(`/pets/${editando}`, petData, { headers: { Authorization: `Bearer ${token}` } });
        setPets((prev) => prev.map((p) => (p.id === editando ? res.data : p)));
        setToast({ show: true, text: "Pet atualizado com sucesso!", bg: "success" });
      } else {
        const res = await api.post("/pets", petData, { headers: { Authorization: `Bearer ${token}` } });
        setPets([...pets, res.data]);
        setToast({ show: true, text: "Pet cadastrado com sucesso!", bg: "success" });
      }

      setNovoPet({ nome: "", especie: "", raca: "", idade: "", peso: "", genero: "", imagem_url: "" });
      setFoto(null);
      setEditando(null);
    } catch {
      setToast({ show: true, text: "Erro ao salvar pet", bg: "danger" });
    }
  };

  const handleEdit = (pet) => {
    setNovoPet({
      nome: pet.nome,
      especie: pet.especie,
      raca: pet.raca,
      idade: pet.idade,
      peso: pet.peso,
      genero: pet.genero,
      imagem_url: pet.imagem_url,
    });
    setEditando(pet.id);
  };

  const confirmarExclusao = (pet) => {
    setPetSelecionado(pet);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/pets/${petSelecionado.id}`, { headers: { Authorization: `Bearer ${token}` } });
      setPets((prev) => prev.filter((p) => p.id !== petSelecionado.id));
      setToast({ show: true, text: "Pet excluído com sucesso!", bg: "success" });
    } catch {
      setToast({ show: true, text: "Erro ao excluir pet", bg: "danger" });
    } finally {
      setShowModal(false);
      setPetSelecionado(null);
    }
  };

  if (loading)
    return (
      <>
        <NutripetNavbar />
        <section className="meupet-section text-center">
          <Spinner animation="border" variant="secondary" />
        </section>
        <Footer />
      </>
    );

  return (
    <>
      <NutripetNavbar />
      <section className="meupet-section">
        <Container className="meupet-container">
          <Row className="align-items-start gy-4">
            <Col lg={5} md={12} className="meupet-form-col">
              <h2 className="titulo-principal">{editando ? "Editar Pet" : "Cadastrar Pet"}</h2>

              <Form onSubmit={handleSubmit} className="pet-form">
                <Form.Group className="mb-3">
                  <Form.Label>Nome</Form.Label>
                  <Form.Control type="text" value={novoPet.nome} onChange={(e) => setNovoPet({ ...novoPet, nome: e.target.value })} required />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Espécie</Form.Label>
                  <Form.Select value={novoPet.especie} onChange={(e) => setNovoPet({ ...novoPet, especie: e.target.value })} required>
                    <option value="">Selecione</option>
                    <option value="Canina">Canina</option>
                    <option value="Felina">Felina</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Gênero</Form.Label>
                  <div className="genero-group">
                    <Form.Check type="radio" label="Macho" name="genero" value="Macho" checked={novoPet.genero === "Macho"} onChange={(e) => setNovoPet({ ...novoPet, genero: e.target.value })} required />
                    <Form.Check type="radio" label="Fêmea" name="genero" value="Fêmea" checked={novoPet.genero === "Fêmea"} onChange={(e) => setNovoPet({ ...novoPet, genero: e.target.value })} required />
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Raça</Form.Label>
                  <Form.Control type="text" value={novoPet.raca} onChange={(e) => setNovoPet({ ...novoPet, raca: e.target.value })} placeholder="Ex: Labrador" />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Peso (kg)</Form.Label>
                  <Form.Control type="number" step="0.1" value={novoPet.peso} onChange={(e) => setNovoPet({ ...novoPet, peso: e.target.value })} placeholder="Ex: 8.5" />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Idade (anos)</Form.Label>
                  <Form.Control type="number" min="0" value={novoPet.idade} onChange={(e) => setNovoPet({ ...novoPet, idade: e.target.value })} placeholder="Ex: 3" />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Foto do Pet</Form.Label>
                  <Form.Control type="file" accept="image/*" onChange={(e) => setFoto(e.target.files[0])} />
                  {(foto || novoPet.imagem_url) && (
                    <div className="preview-container">
                      <img src={foto ? URL.createObjectURL(foto) : novoPet.imagem_url} alt="Preview" className="pet-preview" />
                    </div>
                  )}
                </Form.Group>

                <div className="botoes-form">
                  <Button className="btn-brown" type="submit">{editando ? "Salvar Alterações" : "Cadastrar Pet"}</Button>
                  {editando && (
                    <Button variant="secondary" className="btn-cancelar" onClick={() => { setEditando(null); setNovoPet({ nome: "", especie: "", raca: "", idade: "", peso: "", genero: "", imagem_url: "" }); }}>Cancelar</Button>
                  )}
                </div>
              </Form>
            </Col>

            <Col lg={7} md={12}>
              <h4 className="titulo-secundario">Meus Pets ({pets.length})</h4>
              <Row className="g-4 justify-content-center">
                {pets.map((pet) => (
                  <Col key={pet.id} xs={12} md={6}>
                    <div className="pet-card">
                      <img src={pet.imagem_url || petDefault} alt={pet.nome} className="pet-foto" />
                      <h5>{pet.nome}</h5>
                      <p>{pet.especie}</p>
                      <p>{pet.raca || "Raça não informada"} • {pet.genero || "-"}</p>
                      <p>{pet.idade} ano(s)</p>
                      <div className="pet-actions">
                        <Button size="sm" variant="outline-secondary" onClick={() => handleEdit(pet)}>Editar</Button>
                        <Button size="sm" variant="outline-danger" onClick={() => confirmarExclusao(pet)}>Excluir</Button>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </Container>
      </section>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered backdrop="static">
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="text-maroon fw-bold">Excluir Pet</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          Tem certeza que deseja excluir <strong>{petSelecionado?.nome}</strong>? <br />Esta ação não poderá ser desfeita.
        </Modal.Body>
        <Modal.Footer className="border-0 d-flex justify-content-center">
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button className="btn-brown" onClick={handleDelete}>Excluir</Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="bottom-end" className="p-3">
        <Toast show={toast.show} bg={toast.bg} onClose={() => setToast({ ...toast, show: false })} delay={3000} autohide>
          <Toast.Body className="text-white">{toast.text}</Toast.Body>
        </Toast>
      </ToastContainer>

      <Footer />
    </>
  );
}
/* import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Modal, Spinner, Toast, ToastContainer } from "react-bootstrap";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import NutripetNavbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import "./MeuPet.css";
import petDefault from "../../assets/images/cao_gato.png";

export default function MeuPet() {
  const [pets, setPets] = useState([]);
  const [foto, setFoto] = useState(null);
  const [editando, setEditando] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [petSelecionado, setPetSelecionado] = useState(null);
  const [toast, setToast] = useState({ show: false, text: "", bg: "" });
  const [novoPet, setNovoPet] = useState({
    nome: "",
    especie: "",
    raca: "",
    idade: "",
    peso: "",
    genero: "",
    imagem_url: "",
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!token) {
      setLoading(false);
      navigate("/auth");
      return;
    }
    api
      .get(`/pets?usuario_id=${user.id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setPets(res.data))
      .catch(() => setToast({ show: true, text: "Erro ao carregar pets", bg: "danger" }))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "nutripet_pets");
    const res = await fetch("https://api.cloudinary.com/v1_1/duamd54as/image/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (data.secure_url) return data.secure_url;
    throw new Error("Erro ao enviar imagem.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = novoPet.imagem_url || null;
      if (foto) imageUrl = await handleImageUpload(foto);
      const petData = { ...novoPet, usuario_id: user.id, imagem_url: imageUrl };
      if (editando) {
        const res = await api.put(`/pets/${editando}`, petData, { headers: { Authorization: `Bearer ${token}` } });
        setPets((prev) => prev.map((p) => (p.id === editando ? res.data : p)));
        setToast({ show: true, text: "Pet atualizado com sucesso!", bg: "success" });
      } else {
        const res = await api.post("/pets", petData, { headers: { Authorization: `Bearer ${token}` } });
        setPets([...pets, res.data]);
        setToast({ show: true, text: "Pet cadastrado com sucesso!", bg: "success" });
      }
      setNovoPet({ nome: "", especie: "", raca: "", idade: "", peso: "", genero: "", imagem_url: "" });
      setFoto(null);
      setEditando(null);
    } catch {
      setToast({ show: true, text: "Erro ao salvar pet", bg: "danger" });
    }
  };

  const handleEdit = (pet) => {
    setNovoPet({
      nome: pet.nome,
      especie: pet.especie,
      raca: pet.raca,
      idade: pet.idade,
      peso: pet.peso,
      genero: pet.genero,
      imagem_url: pet.imagem_url,
    });
    setEditando(pet.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const confirmarExclusao = (pet) => {
    setPetSelecionado(pet);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/pets/${petSelecionado.id}`, { headers: { Authorization: `Bearer ${token}` } });
      setPets((prev) => prev.filter((p) => p.id !== petSelecionado.id));
      setToast({ show: true, text: "Pet excluído com sucesso!", bg: "success" });
    } catch {
      setToast({ show: true, text: "Erro ao excluir pet", bg: "danger" });
    } finally {
      setShowModal(false);
      setPetSelecionado(null);
    }
  };

  if (loading)
    return (
      <>
        <NutripetNavbar />
        <section className="meupet-section text-center">
          <Spinner animation="border" variant="secondary" />
        </section>
        <Footer />
      </>
    );

  return (
    <>
      <NutripetNavbar />
      <section className="meupet-section">
        <Container className="bg-light rounded-5 p-4 shadow-lg">
          <Row className="align-items-start gy-4">
            <Col lg={5} md={12}>
              <h2 className="text-maroon fw-bold mb-4 text-center">{editando ? "Editar Pet" : "Cadastrar Pet"}</h2>
              <Form onSubmit={handleSubmit} className="pet-form bg-white p-4 rounded-4 shadow-sm">
                <Form.Group className="mb-3">
                  <Form.Label>Nome</Form.Label>
                  <Form.Control type="text" value={novoPet.nome} onChange={(e) => setNovoPet({ ...novoPet, nome: e.target.value })} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Espécie</Form.Label>
                  <Form.Select value={novoPet.especie} onChange={(e) => setNovoPet({ ...novoPet, especie: e.target.value })} required>
                    <option value="">Selecione</option>
                    <option value="Canina">Canina</option>
                    <option value="Felina">Felina</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Gênero</Form.Label>
                  <div className="d-flex gap-4 mt-2">
                    <Form.Check type="radio" label="Macho" name="genero" value="Macho" checked={novoPet.genero === "Macho"} onChange={(e) => setNovoPet({ ...novoPet, genero: e.target.value })} required />
                    <Form.Check type="radio" label="Fêmea" name="genero" value="Fêmea" checked={novoPet.genero === "Fêmea"} onChange={(e) => setNovoPet({ ...novoPet, genero: e.target.value })} required />
                  </div>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Raça</Form.Label>
                  <Form.Control type="text" value={novoPet.raca} onChange={(e) => setNovoPet({ ...novoPet, raca: e.target.value })} placeholder="Ex: Labrador" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Peso (kg)</Form.Label>
                  <Form.Control type="number" step="0.1" value={novoPet.peso} onChange={(e) => setNovoPet({ ...novoPet, peso: e.target.value })} placeholder="Ex: 8.5" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Idade (anos)</Form.Label>
                  <Form.Control type="number" min="0" value={novoPet.idade} onChange={(e) => setNovoPet({ ...novoPet, idade: e.target.value })} placeholder="Ex: 3" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Foto do Pet</Form.Label>
                  <Form.Control type="file" accept="image/*" onChange={(e) => setFoto(e.target.files[0])} />
                  {(foto || novoPet.imagem_url) && (
                    <div className="text-center mt-3">
                      <img src={foto ? URL.createObjectURL(foto) : novoPet.imagem_url} alt="Preview" className="rounded-3" style={{ width: "120px", height: "120px", objectFit: "cover" }} />
                    </div>
                  )}
                </Form.Group>
                <div className="d-flex gap-2">
                  <Button className="btn-brown w-100 mt-2" type="submit">{editando ? "Salvar Alterações" : "Cadastrar Pet"}</Button>
                  {editando && (
                    <Button variant="secondary" className="w-100 mt-2" onClick={() => { setEditando(null); setNovoPet({ nome: "", especie: "", raca: "", idade: "", peso: "", genero: "", imagem_url: "" }); }}>Cancelar</Button>
                  )}
                </div>
              </Form>
            </Col>

            <Col lg={7} md={12}>
              <h4 className="fw-bold text-maroon mb-4 text-center">Meus Pets ({pets.length})</h4>
              <Row className="g-4 justify-content-center">
                {pets.map((pet) => (
                  <Col key={pet.id} xs={12} md={6}>
                    <motion.div whileHover={{ scale: 1.03 }}>
                      <div className="pet-card rounded-4 shadow-sm p-3 text-center bg-white">
                        <img src={pet.imagem_url || petDefault} alt={pet.nome} className="img-fluid rounded-4 mb-3" style={{ height: "180px", objectFit: "cover", width: "100%" }} />
                        <h5 className="fw-bold text-maroon">{pet.nome}</h5>
                        <p className="text-muted mb-1">{pet.especie}</p>
                        <p className="text-secondary small mb-1">{pet.raca || "Raça não informada"} • {pet.genero || "-"}</p>
                        <p className="fw-semibold text-secondary">{pet.idade} ano(s)</p>
                        <div className="d-flex justify-content-center gap-2 mt-2">
                          <Button size="sm" variant="outline-secondary" onClick={() => handleEdit(pet)}>Editar</Button>
                          <Button size="sm" variant="outline-danger" onClick={() => confirmarExclusao(pet)}>Excluir</Button>
                        </div>
                      </div>
                    </motion.div>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </Container>
      </section>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered backdrop="static">
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="text-maroon fw-bold">Excluir Pet</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          Tem certeza que deseja excluir <strong>{petSelecionado?.nome}</strong>? <br />Esta ação não poderá ser desfeita.
        </Modal.Body>
        <Modal.Footer className="border-0 d-flex justify-content-center">
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button style={{ backgroundColor: "#9b4a28", border: "none" }} onClick={handleDelete}>Excluir</Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="bottom-end" className="p-3">
        <Toast show={toast.show} bg={toast.bg} onClose={() => setToast({ ...toast, show: false })} delay={3000} autohide>
          <Toast.Body className="text-white">{toast.text}</Toast.Body>
        </Toast>
      </ToastContainer>

      <Footer />
    </>
  );
}
 */