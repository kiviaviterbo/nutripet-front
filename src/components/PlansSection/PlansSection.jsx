import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import './PlansSection.css';

export default function PlansSection() {
  return (
    <section id="plans" className="plans-section py-5 text-center">
      <Container>
        <h2 className="fw-bold text-maroon mb-4">Plano Nutricional Trimestral</h2>
        <p className="text-secondary mb-5">
          Cuide da alimentação do seu pet com praticidade e acompanhamento profissional.
        </p>

        <div className="d-flex justify-content-center">
          <Card className="plan-card border-0 shadow-sm rounded-4 text-center p-4">
            <Card.Body>
              <h4 className="fw-bold text-brown mb-3">Plano Trimestral</h4>
              <p>
                Alimentação personalizada e saudável para o seu pet durante <strong>3 meses</strong>.<br />
                Inclui acompanhamento nutricional e acesso às nossas tabelas exclusivas.
              </p>
              <h3 className="fw-bold text-maroon mt-3 mb-4">R$ 49,99</h3>
              <Button className="btn-brown">Assinar agora</Button>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </section>
  );
}
/* import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import './PlansSection.css';

export default function PlansSection() {
  return (
    <section id="plans" className="plans-section py-5 text-center">
      <Container>
        <h2 className="fw-bold text-maroon mb-5">Planos nutricionais personalizados</h2>
        <Row>
          <Col md={4} className="mb-4">
            <Card className="border-0 shadow-sm rounded-4">
              <Card.Body>
                <h4 className="fw-bold text-brown">Básico</h4>
                <p>Plano ideal para pets saudáveis que precisam de uma dieta equilibrada.</p>
                <h5 className="fw-bold text-maroon">R$ 39/mês</h5>
                <Button className="btn-brown mt-2">Assinar</Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} className="mb-4">
            <Card className="border-0 shadow-sm rounded-4 premium-card">
              <Card.Body>
                <h4 className="fw-bold text-brown">Premium</h4>
                <p>Inclui acompanhamento nutricional mensal e relatórios personalizados.</p>
                <h5 className="fw-bold text-maroon">R$ 69/mês</h5>
                <Button className="btn-brown mt-2">Assinar</Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} className="mb-4">
            <Card className="border-0 shadow-sm rounded-4">
              <Card.Body>
                <h4 className="fw-bold text-brown">VIP</h4>
                <p>Plano completo com visitas veterinárias, consultas online e cardápios customizados.</p>
                <h5 className="fw-bold text-maroon">R$ 99/mês</h5>
                <Button className="btn-brown mt-2">Assinar</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
 */