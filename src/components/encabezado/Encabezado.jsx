import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Nav, Navbar, Offcanvas } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import NavDropdown from "react-bootstrap/NavDropdown"
import logo from "../../assets/Logo_Moto_Repuestos.png"; // Importación del logo de la ferretería
import "../../App.css";

const Encabezado = () => {
  const [estaColapsado, setEstaColapsado] = useState(false);
  const navegar = useNavigate();
  const ubicacion = useLocation();

  const estaLogueado = !!localStorage.getItem("usuario") && !!localStorage.getItem("contraseña");

  const cerrarSesion = () => {
    setEstaColapsado(false);
    localStorage.removeItem("usuario");
    localStorage.removeItem("contraseña");
    navegar("/");
  };

  const alternarColapso = () => setEstaColapsado(!estaColapsado);

  const navegarA = (ruta) => {
    navegar(ruta);
    setEstaColapsado(false);
  };

  return (
    <Navbar expand="sm" fixed="flex" className="color-navbar">
      <Container>
        <Navbar.Brand
          onClick={() => navegarA("/inicio")}
          className="text-white"
          style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
        >
          <img alt="" src={logo} width="50" height="50" className="d-inline-block align-top" />{" "}
          <strong>Moto Repuestos Leyton</strong>
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="offcanvasNavbar-expand-sm"
          onClick={alternarColapso}
        />

        <Navbar.Offcanvas
          id="offcanvasNavbar-expand-sm"
          aria-labelledby="offcanvasNavbarLabel-expand-sm"
          placement="end"
          show={estaColapsado}
          onHide={() => setEstaColapsado(false)}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title
              id="offcanvasNavbarLabel-expand-sm"
              className={estaColapsado ? "color-texto-marca" : "text-white"}
            >
              Menú
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
  {/* Navegación */}
  <Nav className="justify-content-end flex-grow-1 pe-3">
    {estaLogueado ? (
      <>
        <Nav.Link
          onClick={() => navegarA("/inicio")}
          className={estaColapsado ? "text-black" : "text-white"}
        >
          {estaColapsado && <i className="bi-house-door-fill me-2"></i>}
          <strong>Inicio</strong>
        </Nav.Link>

        <Nav.Link
          onClick={() => navegarA("/ventas")}
          className={estaColapsado ? "text-black" : "text-white"}
        >
          {estaColapsado && <i className="bi-cash-coin me-2"></i>}
          <strong>Ventas</strong>
        </Nav.Link>

        <Nav.Link
          onClick={() => navegarA("/compras")}
          className={estaColapsado ? "text-black" : "text-white"}
        >
          {estaColapsado && <i className="bi-cart-check me-2"></i>}
          <strong>Compras</strong>
        </Nav.Link>

        <Nav.Link
          onClick={() => navegarA("/Estadisticas")}
          className={estaColapsado ? "text-black" : "text-white"}
        >
          {estaColapsado && <i className="bi-graph-up me-2"></i>}
          <strong>Estadísticas</strong>
        </Nav.Link>

        <Nav.Link
          onClick={() => navegarA("/Dashboard")}
          className={estaColapsado ? "text-black" : "text-white"}
        >
          {estaColapsado && <i className="bi-speedometer2 me-2"></i>}
          <strong>Dashboard</strong>
        </Nav.Link>

        <NavDropdown
          title={
            <span>
              {estaColapsado && <i className="bi-folder-fill me-2"></i>}
              Registros
            </span>
          }
          id="dropdown-registros"
          className={estaColapsado ? "titulo-negro" : "titulo-blanco"}
        >
          <NavDropdown.Item
            onClick={() => navegarA("/clientes")}
            className="text-black"
          >
            <strong>Gestión Clientes</strong>
          </NavDropdown.Item>
          <NavDropdown.Item
            onClick={() => navegarA("/proveedores")}
            className="text-black"
          >
            <strong>Gestión Proveedores</strong>
          </NavDropdown.Item>
        </NavDropdown>

        <NavDropdown
          title={
            <span>
              {estaColapsado && <i className="bi-box-fill me-2"></i>}
              Productos
            </span>
          }
          id="dropdown-productos"
          className={estaColapsado ? "titulo-negro" : "titulo-blanco"}
        >
          <NavDropdown.Item
            onClick={() => navegarA("/productos")}
            className="text-black"
          >
            <strong>Gestión Productos</strong>
          </NavDropdown.Item>
          <NavDropdown.Item
            onClick={() => navegarA("/marcas")}
            className="text-black"
          >
            <strong>Gestión Marcas</strong>
          </NavDropdown.Item>
          <NavDropdown.Item
            onClick={() => navegarA("/catalogoproductos")}
            className="text-black"
          >
            <strong>Catálogo Productos</strong>
          </NavDropdown.Item>
        </NavDropdown>

        <Nav.Link
          onClick={cerrarSesion}
          className={estaColapsado ? "text-black" : "text-white"}
        >
          <i className="bi-box-arrow-right me-2"></i>
          <strong>Cerrar Sesión</strong>
        </Nav.Link>
      </>
    ) : (
      <Nav.Link
        onClick={() => navegarA("/")}
        className={estaColapsado ? "text-black" : "text-white"}
      >
        <i className="bi-box-arrow-in-right me-2"></i>
        <strong>Iniciar Sesión</strong>
      </Nav.Link>
    )}
  </Nav>
</Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};

export default Encabezado;