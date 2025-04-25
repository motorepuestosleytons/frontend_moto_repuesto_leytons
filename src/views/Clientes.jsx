import React, { useState, useEffect } from 'react';
import TablaClientes from '../components/cliente/TablaClientes';
import ModalRegistroCliente from '../components/cliente/ModalRegistroClientes';
import ModalEliminacionCliente from '../components/cliente/ModalEliminacionCliente';
import ModalEdicionCliente from '../components/cliente/ModalEdicionCliente';
import CuadroBusquedas from '../components/busquedas/CuadroBusquedas';
import { Container, Button, Row, Col } from "react-bootstrap";

const Clientes = () => {
  const [listaClientes, setListaClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [errorFormulario, setErrorFormulario] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoCliente, setNuevoCliente] = useState({
    cedula: '',
    nombre_cliente: '',
    apellido: '',
    telefono: '',
  });
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [clienteAEliminar, setClienteAEliminar] = useState(null);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [paginaActual, establecerPaginaActual] = useState(1);
  const elementosPorPagina = 3;
  const [clienteEditado, setClienteEditado] = useState(null);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);

  const obtenerClientes = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/clientes');
      if (!respuesta.ok) {
        throw new Error('Error al cargar los clientes');
      }
      const datos = await respuesta.json();
      setListaClientes(datos);
      setClientesFiltrados(datos);
      setCargando(false);
    } catch (error) {
      setErrorCarga(error.message);
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerClientes();
  }, []);

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoCliente((prev) => ({
      ...prev,
      [name]: value || '',
    }));
  };

  const manejarCambioInputEdicion = (e) => {
    const { name, value } = e.target;
    setClienteEditado((prev) => ({
      ...prev,
      [name]: value || '',
    }));
  };

  const agregarCliente = async () => {
    if (!nuevoCliente.cedula || !nuevoCliente.nombre_cliente || !nuevoCliente.apellido || !nuevoCliente.telefono) {
      setErrorFormulario("Por favor, completa todos los campos requeridos.");
      return;
    }

    try {
      const respuesta = await fetch('http://localhost:3000/api/registrarcliente', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoCliente),
      });

      if (!respuesta.ok) {
        throw new Error('Error al agregar el cliente');
      }

      await obtenerClientes();
      setNuevoCliente({
        cedula: '',
        nombre_cliente: '',
        apellido: '',
        telefono: '',
      });
      setMostrarModal(false);
      setErrorFormulario(null);
    } catch (error) {
      setErrorFormulario(error.message);
    }
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setErrorFormulario(null);
    setNuevoCliente({
      cedula: '',
      nombre_cliente: '',
      apellido: '',
      telefono: '',
    });
  };

  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);
    establecerPaginaActual(1);

    const filtrados = listaClientes.filter(
      (cliente) =>
        cliente.cedula.toLowerCase().includes(texto) ||
        cliente.nombre_cliente.toLowerCase().includes(texto) ||
        cliente.apellido.toLowerCase().includes(texto) ||
        cliente.telefono.toLowerCase().includes(texto)
    );
    setClientesFiltrados(filtrados);
  };

  const eliminarCliente = async () => {
    if (!clienteAEliminar) return;

    try {
      const respuesta = await fetch(`http://localhost:3000/api/eliminarcliente/${clienteAEliminar.id_cliente}`, {
        method: 'DELETE',
      });

      if (!respuesta.ok) {
        throw new Error('Error al eliminar el cliente');
      }

      await obtenerClientes();
      setMostrarModalEliminacion(false);
      establecerPaginaActual(1);
      setClienteAEliminar(null);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const abrirModalEliminacion = (cliente) => {
    setClienteAEliminar(cliente);
    setMostrarModalEliminacion(true);
  };

  const abrirModalEdicion = (cliente) => {
    setClienteEditado(cliente);
    setMostrarModalEdicion(true);
  };

  const actualizarCliente = async () => {
    if (!clienteEditado?.cedula || !clienteEditado?.nombre_cliente || !clienteEditado?.apellido || !clienteEditado?.telefono) {
      setErrorFormulario("Por favor, completa todos los campos antes de guardar.");
      return;
    }

    try {
      const respuesta = await fetch(`http://localhost:3000/api/actualizarcliente/${clienteEditado.id_cliente}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cedula: clienteEditado.cedula,
          nombre_cliente: clienteEditado.nombre_cliente,
          apellido: clienteEditado.apellido,
          telefono: clienteEditado.telefono,
        }),
      });

      if (!respuesta.ok) {
        throw new Error('Error al actualizar el cliente');
      }

      await obtenerClientes();
      setMostrarModalEdicion(false);
      setClienteEditado(null);
      setErrorFormulario(null);
    } catch (error) {
      setErrorFormulario(error.message);
    }
  };

  const clientesPaginados = clientesFiltrados.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  return (
    <>
      <Container className="mt-5">
        <br />
        <h4>Clientes</h4>

        <Row>
          <Col lg={2} md={4} sm={4} xs={5}>
            <Button
              variant="primary"
              onClick={() => setMostrarModal(true)}
              style={{ width: "100%" }}
            >
              Nuevo Cliente
            </Button>
          </Col>
          <Col lg={5} md={8} sm={8} xs={7}>
            <CuadroBusquedas
              textoBusqueda={textoBusqueda}
              manejarCambioBusqueda={manejarCambioBusqueda}
            />
          </Col>
        </Row>

        <br />
        <br />

        <TablaClientes
          clientes={clientesPaginados}
          cargando={cargando}
          error={errorCarga}
          totalElementos={clientesFiltrados.length}
          elementosPorPagina={elementosPorPagina}
          paginaActual={paginaActual}
          establecerPaginaActual={establecerPaginaActual}
          abrirModalEliminacion={abrirModalEliminacion}
          abrirModalEdicion={abrirModalEdicion}
        />

        <ModalRegistroCliente
          mostrarModal={mostrarModal}
          setMostrarModal={setMostrarModal}
          nuevoCliente={nuevoCliente}
          manejarCambioInput={manejarCambioInput}
          agregarCliente={agregarCliente}
          errorCarga={errorFormulario}
          cerrarModal={cerrarModal}
        />

        <ModalEliminacionCliente
          mostrarModalEliminacion={mostrarModalEliminacion}
          setMostrarModalEliminacion={setMostrarModalEliminacion}
          eliminarCliente={eliminarCliente}
        />

        <ModalEdicionCliente
          mostrarModalEdicion={mostrarModalEdicion}
          setMostrarModalEdicion={setMostrarModalEdicion}
          clienteEditado={clienteEditado}
          manejarCambioInputEdicion={manejarCambioInputEdicion}
          actualizarCliente={actualizarCliente}
          errorCarga={errorFormulario}
        />
      </Container>
    </>
  );
};

export default Clientes;