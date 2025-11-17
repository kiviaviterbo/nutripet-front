import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './AboutSection.css';
import pets from '../../assets/images/inicial.jpg';

export default function AboutSection() {
  return (
    <section id="about" className="about-section">
      <Container>
        <Row className="align-items-center justify-content-between">
          <Col md={6} className="d-flex justify-content-center mb-4 mb-md-0">
            <div className="about-image-wrapper">
              <img
                src={pets}
                alt="Pets Nutripet"
                className="about-image about-image-inicial"
              />

            </div>
          </Col>
          <Col md={6}>
            <div className="about-text">
              <h2>Quem somos</h2>
              <p>
                A <strong>Nutripet</strong> nasceu com a missão de proporcionar uma alimentação
                equilibrada, saudável e personalizada para pets, combinando ciência e amor.
              </p>
              <p>
                Nossa equipe é formada por <strong>veterinários especializados em nutrição animal</strong> apaixonados por
                animais, dedicados a criar planos alimentares sob medida para cada necessidade.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
/* import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './AboutSection.css';
import pets from '../../assets/images/pets.png';

export default function AboutSection() {
  return (
    <section id="about" className="about-section py-5">
      <Container>
        <Row className="align-items-center">
          <Col md={6} className="mb-4 mb-md-0">
            <img
              src={pets}
              alt="Nutripet"
              className="img-fluid rounded-4 shadow"
            />
          </Col>
          <Col md={6}>
            <h2 className="text-maroon fw-bold mb-3">Quem somos</h2>
            <p className="text-secondary fs-5">
              A <strong>Nutripet</strong> nasceu com a missão de proporcionar uma alimentação equilibrada,
              saudável e personalizada para pets.
            </p>
            <p className="text-secondary fs-5">
              Nossa equipe é formada por <strong>nutricionistas veterinários</strong> apaixonados por animais,
              dedicados a criar planos alimentares sob medida para cada necessidade.
            </p>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

 */