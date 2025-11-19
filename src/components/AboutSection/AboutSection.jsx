import { Container, Row, Col } from "react-bootstrap";
import "./AboutSection.css";
import pets from "../../assets/images/inicial.jpg";
import { BarChart2, CheckCircle, Brain } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="about-section">
      <Container>

        <Row className="align-items-center justify-content-between">
          {/* IMAGEM */}
          <Col md={5} className="d-flex justify-content-center mb-4 mb-md-0">
            <div className="about-image-wrapper">
              <img
                src={pets}
                alt="Pets Nutripet"
                className="about-image about-image-inicial"
              />
            </div>
          </Col>

          {/* TEXTO PRINCIPAL */}
          <Col md={7}>
            <div className="about-text">
              <h2>Transparência nutricional e cuidado para o seu pet</h2>

              <p className="intro">
                Tornamos a nutrição pet <strong>simples, transparente e confiável </strong>
                para que você saiba exatamente o que seu pet está consumindo.
              </p>

              {/* DIFERENCIAIS */}
              <div className="diferenciais">

                <div className="dif-item">
                  <BarChart2 size={26} />
                  <h4>Informação transparente</h4>
                  <p>Exibimos dados que <strong>não vêm nas embalagens</strong>, como nível real de carboidratos.</p>
                </div>

                <div className="dif-item">
                  <Brain size={26} />
                  <h4>Cálculo nutricional inteligente</h4>
                  <p>Usamos fórmulas veterinárias para interpretar os valores nutricionais.</p>
                </div>

                <div className="dif-item">
                  <CheckCircle size={26} />
                  <h4>Baseado em ciência</h4>
                  <p>Conteúdo validado por veterinários especializados em nutrição animal.</p>
                </div>

              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
