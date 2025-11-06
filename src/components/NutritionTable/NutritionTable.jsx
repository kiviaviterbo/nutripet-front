import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
import NutripetNavbar from '../Navbar/Navbar';
import api from '../../services/api';
import './NutritionTable.css';
import tabelanutricional from '../../assets/images/tabelanutricional.gif';
import Footer from '../Footer/Footer';

function buildImageMap() {
  const map = {};
  try {
    const exts = /\.(png|jpe?g|gif|webp|avif)$/i;
    const ctx = require.context('../../assets/images', true, exts);
    ctx.keys().forEach((k) => {
      const file = k.replace(/^.\//, '');
      const name = file.split('/').pop();
      map[file] = ctx(k);
      map[name] = ctx(k);
      map[name.toLowerCase()] = ctx(k);
    });
  } catch (_) {}
  return map;
}

const IMAGE_MAP = buildImageMap();

function getImageUrl(feed) {
  const val = (feed?.imagem_url || '').trim();

  if (/^https?:\/\//i.test(val)) {
    if (/^https?:\/\/res\.cloudinary\.com/.test(val)) {
      return val.replace('/upload/', '/upload/w_600,q_auto,f_auto/');
    }
    return val;
  }

  if (val && IMAGE_MAP[val]) return IMAGE_MAP[val];
  if (val && IMAGE_MAP[val.toLowerCase()]) return IMAGE_MAP[val.toLowerCase()];

  const base = val.split('/').pop() || val;
  const variants = [
    base,
    base.toLowerCase(),
    base.replace(/\s+/g, '_'),
    base.replace(/\s+/g, '-'),
    base.toLowerCase().replace(/\s+/g, '_'),
    base.toLowerCase().replace(/\s+/g, '-'),
  ];
  const exts = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
  for (const v of variants) {
    if (IMAGE_MAP[v]) return IMAGE_MAP[v];
    for (const e of exts) {
      const file = `${v}.${e}`;
      if (IMAGE_MAP[file]) return IMAGE_MAP[file];
    }
  }

  const fallback =
    feed?.especie?.toLowerCase() === 'cão'
      ? 'racao-cachorro.jpg'
      : feed?.especie?.toLowerCase() === 'gato'
      ? 'racao-gato.jpg'
      : null;

  if (fallback && IMAGE_MAP[fallback]) return IMAGE_MAP[fallback];

  return tabelanutricional;
}

export default function NutritionTable() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSearch = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setResults([]);
    if (!query.trim()) {
      setMessage({ type: 'warning', text: 'Digite o nome de uma ração para buscar.' });
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await api.get(`/tabelas?nome=${encodeURIComponent(query)}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.data && res.data.length > 0) {
        setResults(res.data);
      } else {
        setMessage({ type: 'info', text: 'Nenhuma ração encontrada com esse nome.' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'danger', text: 'Erro ao buscar rações. Tente novamente mais tarde.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NutripetNavbar />
      <section className="nutrition-section text-center">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8} md={10}>
              <div className="nutrition-image-container">
                <img
                  src={tabelanutricional}
                  alt="Tabela Nutricional"
                  className="nutrition-image mb-4"
                />
              </div>
              <h2 className="text-maroon fw-bold mb-4">Consultar Tabela Nutricional</h2>

              {message.text && <Alert variant={message.type}>{message.text}</Alert>}

              <Form onSubmit={handleSearch} className="text-start mb-5">
                <Form.Group>
                  <Form.Label className="fw-semibold text-maroon">Nome da Ração</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ex: Golden, Premier, Pedigree..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </Form.Group>
                <Button className="btn-brown mt-3" type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />{' '}
                      Buscando...
                    </>
                  ) : (
                    'Buscar'
                  )}
                </Button>
              </Form>

              {results.length > 0 && (
                <div className="results-container">
                  <h4 className="fw-bold text-maroon mb-4">Resultados da busca</h4>
                  <Row className="g-4 justify-content-center">
                    {results.map((feed, index) => {
                      const imageSrc = getImageUrl(feed);
                      return (
                        <Col key={index} xs={12} md={6} lg={4}>
                          <div
                            className="feed-card rounded-4 shadow-sm p-3 text-center"
                            onClick={() =>
                              setResults((prev) =>
                                prev.map((item, i) =>
                                  i === index ? { ...item, expanded: !item.expanded } : item
                                )
                              )
                            }
                            style={{
                              cursor: 'pointer',
                              border: '1px solid #eee',
                              transition: '0.3s',
                            }}
                          >
                            <img
                              src={imageSrc}
                              alt={feed.nome}
                              className="img-fluid rounded-4 mb-3"
                              style={{
                                height: '180px',
                                objectFit: 'cover',
                                width: '100%',
                              }}
                            />
                            <h5 className="fw-bold text-maroon">{feed.nome}</h5>
                            {feed.marca && (
                              <p className="text-muted mb-1">{feed.marca}</p>
                            )}
                            {feed.preco && (
                              <p className="fw-semibold text-secondary">
                                R$ {Number(feed.preco).toFixed(2)}
                              </p>
                            )}

                            {feed.expanded && (
                              <div className="nutrition-table mt-3 text-start">
                                <table className="table table-striped small mb-0">
                                  <tbody>
                                    <tr>
                                      <td><strong>Espécie:</strong></td>
                                      <td>{feed.especie}</td>
                                    </tr>
                                    <tr><td>Proteína Bruta</td><td>{feed.proteina_bruta}</td></tr>
                                    <tr><td>Extrato Etéreo</td><td>{feed.extrato_etereo}</td></tr>
                                    <tr><td>Matéria Fibrosa</td><td>{feed.materia_fibrosa}</td></tr>
                                    <tr><td>Matéria Mineral</td><td>{feed.materia_mineral}</td></tr>
                                    <tr><td>Cálcio</td><td>{feed.calcio}</td></tr>
                                    <tr><td>Fósforo</td><td>{feed.fosforo}</td></tr>
                                    <tr><td>Sódio</td><td>{feed.sodio}</td></tr>
                                    <tr><td>Potássio</td><td>{feed.potassio}</td></tr>
                                    <tr><td>Taurina</td><td>{feed.taurina}</td></tr>
                                    <tr><td>L-Carnitina</td><td>{feed.l_carnitina}</td></tr>
                                    <tr><td>DL-Metionina</td><td>{feed.dl_metionina}</td></tr>
                                    <tr><td>Magnésio</td><td>{feed.magnesio}</td></tr>
                                    <tr><td>Ômega 6</td><td>{feed.omega_6}</td></tr>
                                    <tr><td>Ômega 3</td><td>{feed.omega_3}</td></tr>
                                    <tr><td>Mananoligossacarídeo</td><td>{feed.mananoligossacarideo}</td></tr>
                                    <tr><td>Umidade</td><td>{feed.umidade}</td></tr>
                                    <tr><td>pH Urinário</td><td>{feed.ph_urinario}</td></tr>
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        </Col>
                      );
                    })}
                  </Row>
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </section>
      <Footer />
    </>
  );
}
