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
import MeuPet from './components/MeuPet/MeuPet';
import CadastrarPet from './components/MeuPet/CadastrarPet';
import MeusPets from './components/MeuPet/MeusPets';
import RacaoDetalhes from "./components/RacaoDetalhes/RacaoDetalhes";

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
          path="/meupet"
          element={
            <PrivateRoute>
              <MeuPet />
            </PrivateRoute>
          }
        />
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