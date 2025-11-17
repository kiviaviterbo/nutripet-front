import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import Home from './pages/Home';
import AuthPage from './components/AuthPage/AuthPage';
import NutritionTable from './components/NutritionTable/NutritionTable';
//import MeuPet from './components/MeuPet/MeuPet';
import CadastrarPet from './components/MeuPet/CadastrarPet';
import MeusPets from './components/MeuPet/MeusPets';
import RacaoDetalhes from "./components/RacaoDetalhes/RacaoDetalhes";
import EditarPerfil from './components/EditarPerfil/EditarPerfil';
import MinhasConsultas from './components/MinhasConsultas/MinhasConsultas';
import MeusDados from "./components/MeusDados/MeusDados";
import AlterarSenha from "./components/AlterarSenha/AlterarSenha";
import MinhaAssinatura from './components/MinhaAssinatura/MinhaAssinatura';
import Pagamento from './components/Pagamento/Pagamento';
import PagamentoSucesso from './components/Pagamento/PagamentoSucesso';
import NovaConsulta from './components/MinhasConsultas/NovaConsulta';
import SAQ from './components/MinhasConsultas/SAQ';
import Cupons from './components/Promocoes/Cupons';
import Sorteios from './components/Promocoes/Sorteios';



function PrivateRoute({ children }) {
  const user = JSON.parse(localStorage.getItem('user'));
  const location = useLocation();

  if (!user) {
    localStorage.setItem('redirectAfterLogin', location.pathname);
    return <Navigate to="/auth" replace />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/nutritiontable" element={<NutritionTable />} />
        <Route
          path="/usuario/meupet/cadastrar"
          element={
            <PrivateRoute>
              <CadastrarPet />
            </PrivateRoute>
          }
        />
        <Route
          path="usuario/meupet"
          element={
            <PrivateRoute>
              <MeusPets />
            </PrivateRoute>
          }
        />
        <Route path="/racao/:id" element={<RacaoDetalhes />} />
        <Route path="/usuario/editar" element={<EditarPerfil />} />
        <Route path="/usuario/consultas" element={<MinhasConsultas />} />
        <Route path="/usuario/meusdados" element={<MeusDados />} />
        <Route path="/usuario/senha" element={<AlterarSenha />} />
        <Route path="/usuario/assinatura" element={<MinhaAssinatura />} />
        <Route path="/pagamento" element={<Pagamento />} />
        <Route path="/pagamento/sucesso/:id" element={<PagamentoSucesso />} />
        <Route path="/usuario/consultas/nova" element={<NovaConsulta />} />
        <Route path="/usuario/consultas/saq" element={<SAQ />} />
        <Route path="/usuario/cupons" element={<Cupons />} />
        <Route path="/usuario/sorteios" element={<Sorteios />} />
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

export default App;
