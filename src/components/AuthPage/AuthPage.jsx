import { useState } from 'react';
import { Eye, EyeOff } from "lucide-react";
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
import './AuthPage.css';
import cadastro from '../../assets/images/cadastro.gif';
import api from '../../services/api';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    cpf: "",
    nome: "",
    email: "",
    senha: "",
    confirmar: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setMessage({ type: '', text: '' });
  };

  // Format CPF
  const formatarCPF = (value) => {
    value = value.replace(/\D/g, "");
    value = value.slice(0, 11);

    if (value.length <= 3) return value;
    if (value.length <= 6) return value.replace(/(\d{3})(\d{1,3})/, "$1.$2");
    if (value.length <= 9) return value.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");

    return value.replace(
      /(\d{3})(\d{3})(\d{3})(\d{1,2})/,
      "$1.$2.$3-$4"
    );
  };

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "cpf") {
      value = formatarCPF(value);
    }

    setFormData({ ...formData, [name]: value });
  };

  // Validação CPF
  const validarCPF = (cpf) => {
    cpf = cpf.replace(/\D/g, "");
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let soma = 0, resto;

    for (let i = 1; i <= 9; i++)
      soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++)
      soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;

    return resto === parseInt(cpf.substring(10, 11));
  };

  // REGRAS DE SENHA
  const rules = {
    length: formData.senha.length >= 10,
    upper: /[A-Z]/.test(formData.senha),
    lower: /[a-z]/.test(formData.senha),
    number: /[0-9]/.test(formData.senha),
  };

  const senhaValida =
    rules.length && rules.upper && rules.lower && rules.number;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!formData.email || !formData.senha) {
      setMessage({ type: 'danger', text: 'Preencha todos os campos obrigatórios.' });
      return;
    }

    if (!isLogin) {
      if (!validarCPF(formData.cpf)) {
        setMessage({ type: 'danger', text: 'CPF inválido!' });
        return;
      }

      if (!senhaValida) {
        setMessage({ type: "danger", text: "A senha não atende aos requisitos." });
        return;
      }

      if (formData.senha !== formData.confirmar) {
        setMessage({ type: 'danger', text: 'As senhas não coincidem!' });
        return;
      }
    }

    try {
      setLoading(true);

      if (isLogin) {
        const res = await api.post('/login', {
          email: formData.email,
          senha: formData.senha,
        });

        localStorage.setItem('user', JSON.stringify(res.data.usuario));
        localStorage.setItem('token', res.data.token);

        setMessage({ type: 'success', text: 'Login realizado com sucesso! Redirecionando...' });

      } else {
        const res = await api.post('/usuarios', {
          cpf: formData.cpf.replace(/\D/g, ""),
          nome: formData.nome,
          email: formData.email,
          senha: formData.senha,
        });

        localStorage.setItem('user', JSON.stringify(res.data.usuario));
        localStorage.setItem('token', res.data.token);

        setMessage({ type: 'success', text: 'Cadastro realizado com sucesso! Redirecionando...' });
      }

      setTimeout(() => (window.location.href = '/'), 1500);

    } catch (err) {
      const msg =
        err.response?.data?.msg ||
        'Erro ao autenticar. Verifique suas credenciais ou tente novamente mais tarde.';

      setMessage({ type: 'danger', text: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-section d-flex align-items-center">
      <Container>
        <Row className="justify-content-center align-items-center">

          {/* Lado esquerdo (GIF) */}
          <Col lg={6} className="text-center mb-5 mb-lg-0">
            <img
              src={cadastro}
              alt="Nutripet Login"
              className="auth-image img-fluid"
              onClick={() => (window.location.href = '/')}
              style={{ cursor: 'pointer' }}
            />
          </Col>

          {/* Lado direito (formulário) */}
          <Col lg={5}>
            <div className="auth-box shadow-sm p-5 rounded-4 bg-white mx-auto text-center">
              <h2 className="fw-bold text-maroon mb-3">
                {isLogin ? 'Entrar na sua conta' : 'Crie sua conta'}
              </h2>

              {message.text && <Alert variant={message.type}>{message.text}</Alert>}

              <Form className="text-start" onSubmit={handleSubmit}>

                {/* CAMPOS SOMENTE NO CADASTRO */}
                {!isLogin && (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Label>CPF</Form.Label>
                      <Form.Control
                        type="text"
                        name="cpf"
                        placeholder="Digite seu CPF"
                        value={formData.cpf}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Nome completo</Form.Label>
                      <Form.Control
                        type="text"
                        name="nome"
                        placeholder="Digite seu nome"
                        value={formData.nome}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </>
                )}

                {/* EMAIL */}
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Digite seu email"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Senha</Form.Label>

                  <div className="input-wrapper">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="senha"
                      value={formData.senha}
                      onChange={handleChange}
                      placeholder="Digite sua senha"
                      required
                    />

                    <span
                      className="toggle-eye"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </span>
                  </div>
                </Form.Group>

                {/* REGRAS SOMENTE NO CADASTRO */}
                {!isLogin && (
                  <div className="senha-requisitos mb-3">
                    <Requisito ok={rules.length} texto="Mínimo de 10 caracteres" />
                    <Requisito ok={rules.upper} texto="Pelo menos 1 letra maiúscula" />
                    <Requisito ok={rules.lower} texto="Pelo menos 1 letra minúscula" />
                    <Requisito ok={rules.number} texto="Pelo menos 1 número" />
                  </div>
                )}

                {/* CONFIRMAR SENHA */}
                {!isLogin && (
                  <Form.Group className="mb-3">
                    <Form.Label>Confirmar senha</Form.Label>

                    <div className="input-wrapper">
                      <Form.Control
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmar"
                        value={formData.confirmar}
                        onChange={handleChange}
                        placeholder="Confirme sua senha"
                        required
                      />

                      <span
                        className="toggle-eye"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </span>
                    </div>
                  </Form.Group>

                )}

                {/* BOTÃO */}
                <Button type="submit" className="btn-brown w-100 mt-2" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" />{" "}
                      {isLogin ? "Entrando..." : "Cadastrando..."}
                    </>
                  ) : (
                    <>{isLogin ? "Entrar" : "Cadastrar"}</>
                  )}
                </Button>
              </Form>

              <div className="text-center mt-4">
                {isLogin ? (
                  <p>
                    Não tem uma conta?{' '}
                    <button className="link-button" onClick={toggleForm}>Cadastre-se</button>
                  </p>
                ) : (
                  <p>
                    Já tem uma conta?{' '}
                    <button className="link-button" onClick={toggleForm}>Fazer login</button>
                  </p>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

function Requisito({ ok, texto }) {
  return (
    <p
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        fontSize: "0.9rem",
        color: ok ? "#2e7d32" : "#b71c1c",
        margin: 0,
        paddingLeft: "4px",
      }}
    >
      {ok ? "✓" : "✗"} {texto}
    </p>
  );
}
