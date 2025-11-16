import React from 'react';
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
{/* 
        <Route
          path="/meupet"
          element={
            <PrivateRoute>
              <MeuPet />
            </PrivateRoute>
          }
        /> */}
        <Route
          path="/meupet/cadastrar"
          element={
            <PrivateRoute>
              <CadastrarPet />
            </PrivateRoute>
          }
        />
        <Route
          path="/meupet/listar"
          element={
            <PrivateRoute>
              <MeusPets />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/racao/:id" element={<RacaoDetalhes />} />
        <Route path="/usuario/editar" element={<EditarPerfil />} />
        <Route path="/usuario/consultas" element={<MinhasConsultas />} />
        <Route path="/usuario/meusdados" element={<MeusDados />} />
        <Route path="/usuario/senha" element={<AlterarSenha />} />
        <Route path="/usuario/assinatura" element={<MinhaAssinatura />} />
        <Route path="/pagamento" element={<Pagamento />} />
        <Route path="/pagamento/sucesso/:id" element={<PagamentoSucesso />} />
      </Routes>
    </Router>
  );
}

export default App;




/* import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./containers/Home";
import Consult from "./containers/Consult";
import Login from "./containers/Login";
import Register from "./containers/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Consult" element={<Consult />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;



 */