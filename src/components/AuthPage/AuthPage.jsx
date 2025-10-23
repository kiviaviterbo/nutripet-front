import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import './AuthPage.css';
import cadastro from '../../assets/images/cadastro.gif';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => setIsLogin(!isLogin);

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
              onClick={() => window.location.href = '/'}
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

              <Form className="text-start">
                {!isLogin && (
                  <Form.Group className="mb-3">
                    <Form.Label>Nome completo</Form.Label>
                    <Form.Control type="text" placeholder="Digite seu nome" />
                  </Form.Group>
                )}

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" placeholder="Digite seu email" />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Senha</Form.Label>
                  <Form.Control type="password" placeholder="Digite sua senha" />
                </Form.Group>

                {!isLogin && (
                  <Form.Group className="mb-3">
                    <Form.Label>Confirmar senha</Form.Label>
                    <Form.Control type="password" placeholder="Confirme sua senha" />
                  </Form.Group>
                )}

                <div className="text-center">
                  <Button type="submit" className="btn-brown w-100 mt-2">
                    {isLogin ? 'Entrar' : 'Cadastrar'}
                  </Button>
                </div>
              </Form>

              <div className="text-center mt-4">
                {isLogin ? (
                  <p>
                    Não tem uma conta?{' '}
                    <button className="link-button" onClick={toggleForm}>
                      Cadastre-se
                    </button>
                  </p>
                ) : (
                  <p>
                    Já tem uma conta?{' '}
                    <button className="link-button" onClick={toggleForm}>
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
