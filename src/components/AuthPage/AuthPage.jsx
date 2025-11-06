import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
import './AuthPage.css';
import cadastro from '../../assets/images/cadastro.gif';
import api from '../../services/api';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmar: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setMessage({ type: '', text: '' }); // limpa mensagens ao alternar
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // 🔒 Validação simples
    if (!isLogin && formData.senha !== formData.confirmar) {
      setMessage({ type: 'danger', text: 'As senhas não coincidem!' });
      return;
    }

    if (!formData.email || !formData.senha) {
      setMessage({ type: 'danger', text: 'Preencha todos os campos obrigatórios.' });
      return;
    }

    try {
      setLoading(true);

      if (isLogin) {
        // LOGIN
        const res = await api.post('/login', {
          email: formData.email,
          senha: formData.senha,
        });

        localStorage.setItem('user', JSON.stringify(res.data.usuario));
        localStorage.setItem('token', res.data.token);
        setMessage({ type: 'success', text: 'Login realizado com sucesso! Redirecionando...' });
      } else {
        // CADASTRO
        const res = await api.post('/usuarios', {
          nome: formData.nome,
          email: formData.email,
          senha: formData.senha,
        });

        localStorage.setItem('user', JSON.stringify(res.data.usuario));
        localStorage.setItem('token', res.data.token);
        setMessage({ type: 'success', text: 'Cadastro realizado com sucesso! Redirecionando...' });
      }

      setTimeout(() => {
        window.location.href = '/';
      }, 1500);


    } catch (err) {
      console.error(err);

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
          {/* Coluna da imagem */}
          <Col lg={6} className="text-center mb-5 mb-lg-0">
            <img
              src={cadastro}
              alt="Nutripet Login"
              className="auth-image img-fluid"
              onClick={() => (window.location.href = '/')}
              style={{ cursor: 'pointer' }}
              title="Voltar para o site"
            />
          </Col>

          {/* Coluna do formulário */}
          <Col lg={5}>
            <div className="auth-box shadow-sm p-5 rounded-4 bg-white mx-auto text-center">
              <h2 className="fw-bold text-maroon mb-3">
                {isLogin ? 'Entrar na sua conta' : 'Crie sua conta'}
              </h2>
              <p className="text-secondary mb-4">
                {isLogin
                  ? 'Bem-vindo de volta! Entre para continuar.'
                  : 'Preencha seus dados para começar.'}
              </p>

              {message.text && (
                <Alert variant={message.type} className="text-center">
                  {message.text}
                </Alert>
              )}

              <Form className="text-start" onSubmit={handleSubmit}>
                {!isLogin && (
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
                )}

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Digite seu email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Senha</Form.Label>
                  <Form.Control
                    type="password"
                    name="senha"
                    placeholder="Digite sua senha"
                    value={formData.senha}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                {!isLogin && (
                  <Form.Group className="mb-3">
                    <Form.Label>Confirmar senha</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmar"
                      placeholder="Confirme sua senha"
                      value={formData.confirmar}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                )}

                <div className="text-center">
                  <Button type="submit" className="btn-brown w-100 mt-2" disabled={loading}>
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" />{' '}
                        {isLogin ? 'Entrando...' : 'Cadastrando...'}
                      </>
                    ) : (
                      <>{isLogin ? 'Entrar' : 'Cadastrar'}</>
                    )}
                  </Button>
                </div>
              </Form>

              <div className="text-center mt-4">
                {isLogin ? (
                  <p>
                    Não tem uma conta?{' '}
                    <button className="link-button" type="button" onClick={toggleForm}>
                      Cadastre-se
                    </button>
                  </p>
                ) : (
                  <p>
                    Já tem uma conta?{' '}
                    <button className="link-button" type="button" onClick={toggleForm}>
                      Fazer login
                    </button>
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
