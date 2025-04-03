import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./views/Login";
import Inicio from "./views/Inicio";
import Encabezado from "./components/encabezado/Encabezado";
import Clientes from "./views/Clientes";
import Productos from "./views/Productos";
import Marcas from "./views/Marcas";
import Proveedores from "./views/Proveedores";
import Compras from "./views/Compras";
import Ventas from "./views/Ventas";
import './App.css';

const App = () => {
  return (
    <Router>
      <Encabezado/>
      <main className="margen-superior-main">
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/productos" element={<Productos/>} />
        <Route path="/marcas" element={<Marcas />} />
        <Route path="/proveedores" element={<Proveedores/>} />
        <Route path="/compras" element={<Compras/>} />
        <Route path="/ventas" element={<Ventas/>} />



      </Routes>
      </main>
    </Router>
  );
};

export default App;