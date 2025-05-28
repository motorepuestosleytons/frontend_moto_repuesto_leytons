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
import CatalogoProductos from "./views/CatalogoProductos";
import Dashboard from "./views/Dashboard";
import Estadisticas from "./views/Estadisdicas";
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
        <Route path="/CatalogoProductos" element={<CatalogoProductos/>} />
        <Route path="/Dashboard" element={<Dashboard/>} />
        <Route path="/Estadisticas" element={<Estadisticas/>} />




      </Routes>
      </main>
    </Router>
  );
};

export default App;