import { Link } from "react-router-dom";

function Home() {
    return (
        <div>

            <div className="conteudo">
                <h1>Bem-vindo à página Home!</h1>
                <p>Escolha uma opção no menu abaixo.</p>
            </div>

            <nav className="navbar">
                <ul>
                    <li><Link to="/Login">Logar</Link></li>
                    <li><Link to="/Consult">Consultar</Link></li>
                    <li><Link to="/Register">Registrar</Link></li>
                </ul>
            </nav>

            
        </div>
    );
}

export default Home