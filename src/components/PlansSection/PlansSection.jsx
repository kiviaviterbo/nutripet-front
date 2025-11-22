import { useNavigate } from "react-router-dom";
import { PawPrint, ShieldCheck, Stethoscope, HeartHandshake, Crown, Users } from "lucide-react";
import "./PlansSection.css";
import vetImage from "../../assets/images/premium2.gif";

export default function PlansSection() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const isLogged = !!user;

  const handleAssinar = () => {
    if (isLogged) {
      navigate("/pagamento");
    } else {
      navigate("/auth");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section id="plans" className="plano-premium-section">
      <div className="vantagens-premium">
        <h2>Por que ser Premium?</h2>
        <div className="vantagens-grid">
          <div className="vantagem-card">
            <ShieldCheck size={38} />
            <h3>Atendimento Especializado</h3>
            <p>Tenha suporte direto com nossos veterinários especializados em nutrição animal.</p>
          </div>
          <div className="vantagem-card">
            <Stethoscope size={38} />
            <h3>Consultas com Veterinários</h3>
            <p>
              Inclui consultas trimestrais com profissionais especializados e acompanhamento.
            </p>
          </div>
          <div className="vantagem-card">
            <HeartHandshake size={38} />
            <h3>Planos Personalizados</h3>
            <p>
              Receba recomendações nutricionais adequadas para as necessidades do seu pet.
            </p>
          </div>
          <div className="vantagem-card">
            <Users size={38} />
            <h3>Até 2 Pets por CPF</h3>
            <p>
              Seu plano cobre até <strong>2 animais por CPF</strong>. 
            </p>
          </div>
          <div className="vantagem-card">
            <Crown size={38} />
            <h3>Benefícios Exclusivos</h3>
            <p>
              Descontos em lojas parceiras, acesso antecipado a novidades e suporte Premium.
            </p>
          </div>
          <div className="vantagem-card">
            <PawPrint size={38} />
            <h3>Tranquilidade Garantida</h3>
            <p>
              Nós cuidamos da parte técnica, para que você só precise se preocupar em mimar seu
              pet como ele merece.
            </p>
          </div>
        </div>
      </div>

      <div className="detalhes-plano">
        <div className="detalhes-texto">
          <h2>Como funciona o Plano Premium?</h2>
          <ul>
            <li>
               Assinatura <strong>trimestral</strong> por <strong>R$ 49,90/mês</strong>.
            </li>
            <li>
              Cobre até 2 pets por CPF
            </li>
            <li>
             Direito a consultas com veterinários e especialistas em nutrição animal.
            </li>
            <li>
             Acompanhamento periódico, orientações alimentares e relatórios personalizados.
            </li>
          </ul>

          <button className="btn-assinar-agora grande" onClick={handleAssinar}>
            {isLogged ? "Ir para pagamento" : "Cadastre-se e assine agora"}
          </button>
        </div>

        <div className="detalhes-imagem">
          <img src={vetImage} alt="Nutrição e cuidado" />
        </div>
      </div>
    </section>
  );
}
