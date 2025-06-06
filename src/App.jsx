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
import RutaProtegida from "./components/rutas/RutaProtegida";
import PiePagina from "./components/infopie/PiePagina";
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="app-wrapper">
        <Encabezado/>
        <main className="margen-superior-main">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/inicio" element={<RutaProtegida vista={<Inicio />} />} />
            <Route path="/clientes" element={<RutaProtegida vista={<Clientes />} />} />
            <Route path="/productos" element={<RutaProtegida vista={<Productos />} />} />
            <Route path="/marcas" element={<RutaProtegida vista={<Marcas />} />} />
            <Route path="/proveedores" element={<RutaProtegida vista={<Proveedores />} />} />
            <Route path="/compras" element={<RutaProtegida vista={<Compras />} />} />
            <Route path="/ventas" element={<RutaProtegida vista={<Ventas />} />} />
            <Route path="/catalogoProductos" element={<RutaProtegida vista={<CatalogoProductos />} />} />
            <Route path="/Estadisticas" element={<RutaProtegida vista={<Estadisticas />} />} />
            <Route path="/Dashboard" element={<RutaProtegida vista={<Dashboard />} />} />
          </Routes>
        </main>
        <PiePagina/>
      </div>
    </Router>
  );
};

export default App;