import { BrowserRouter, Routes, Route } from "react-router-dom";
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
