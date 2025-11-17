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
            Se é Saúde e Nutrição<br />
            <span className="highlight">conte com a Nutripet</span>
          </h1>

          <p className="hero-subtext">
            Alimentação equilibrada, ciência e carinho para quem faz parte da sua família.
          </p>

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

