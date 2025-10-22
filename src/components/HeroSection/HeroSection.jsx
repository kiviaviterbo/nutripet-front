import React from 'react';
import './HeroSection.css';
//import dogFood from '../../assets/images/dog-food.jpg';
import nutricao from '../../assets/images/nutricao.gif';

export default function HeroSection() {
  // Função de rolagem suave até a seção "Quem somos"
  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-section">
      <div className="hero-content container">
        <div className="hero-text">
          <h1>
            Se é Saúde e Nutrição<br />
            <span className="highlight">conte com a Nutripet</span>
          </h1>
          <p>
            Ofereça o melhor para quem te dá amor todos os dias.<br />
            Planos nutricionais <strong>personalizados</strong> e <strong>saudáveis </strong> 
            para garantir o bem-estar do seu melhor amigo.
          </p>
          <button className="btn-brown" onClick={scrollToAbout}>
            Saiba mais
          </button>
        </div>

        <div className="hero-image-wrapper">
          <img src={nutricao} alt="Nutripet" className="hero-image" />
          <div className="image-overlay"></div>
        </div>
      </div>
    </section>
  );
}
