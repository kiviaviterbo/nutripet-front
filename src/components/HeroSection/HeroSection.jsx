import './HeroSection.css';
import nutricao from '../../assets/images/nutricao.gif';

export default function HeroSection() {
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
            Se é Nutrição<br />
            <span className="highlight">conte com a <strong>Nutripet</strong></span>
          </h1>

          <p className="hero-subtext">
            Ofereça o melhor para quem te dá amor todos os dias.<br />
            Plano nutricional <strong>personalizado</strong> e <strong>saudável </strong> 
            para garantir o bem-estar do seu melhor amigo.
          </p>

          <button className="btn-brown" onClick={scrollToAbout}>
            Conheça
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

