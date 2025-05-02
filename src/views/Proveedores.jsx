import React, { useState, useEffect } from 'react';
import TablaProveedor from '../components/proveedor/TablaProveedor';
import ModalRegistroProveedor from '../components/proveedor/ModalRegistroProveedor';
import ModalEliminacionProveedor from '../components/proveedor/ModalEliminacionProveedor';
import ModalEdicionProveedor from '../components/proveedor/ModalEdicionProveedor';
import CuadroBusquedas from '../components/busquedas/CuadroBusquedas';
import { Container, Button, Row, Col } from "react-bootstrap";

const Proveedores = () => {
  const [listaProveedores, setListaProveedores] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [errorFormulario, setErrorFormulario] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoProveedor, setNuevoProveedor] = useState({
    nombre_proveedor: '',
    telefono: '',
    empresa: '',
  });
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [proveedorAEliminar, setProveedorAEliminar] = useState(null);
  const [proveedoresFiltrados, setProveedoresFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [paginaActual, establecerPaginaActual] = useState(1);
  const elementosPorPagina = 3;
  const [proveedorEditado, setProveedorEditado] = useState(null);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);

  const obtenerProveedores = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/proveedores');
      if (!respuesta.ok) {
        throw new Error('Error al cargar los proveedores');
      }
      const datos = await respuesta.json();
      setListaProveedores(datos);
      setProveedoresFiltrados(datos);
      setCargando(false);
    } catch (error) {
      setErrorCarga(error.message);
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerProveedores();
  }, []);

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoProveedor((prev) => ({
      ...prev,
      [name]: value || '',
    }));
  };

  const manejarCambioInputEdicion = (e) => {
    const { name, value } = e.target;
    setProveedorEditado((prev) => ({
      ...prev,
      [name]: value || '',
    }));
  };

  const agregarProveedor = async () => {
    if (!nuevoProveedor.nombre_proveedor || !nuevoProveedor.telefono || !nuevoProveedor.empresa) {
      setErrorFormulario("Por favor, completa todos los campos requeridos.");
      return;
    }

    try {
      const respuesta = await fetch('http://localhost:3000/api/registrarproveedor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoProveedor),
      });

      if (!respuesta.ok) {
        throw new Error('Error al agregar el proveedor');
      }

      await obtenerProveedores();
      setNuevoProveedor({
        nombre_proveedor: '',
        telefono: '',
        empresa: '',
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
    setNuevoProveedor({
      nombre_proveedor: '',
      telefono: '',
      empresa: '',
    });
  };

  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);
    establecerPaginaActual(1);

    const filtrados = listaProveedores.filter(
      (proveedor) =>
        proveedor.nombre_proveedor.toLowerCase().includes(texto) ||
        proveedor.telefono.toLowerCase().includes(texto) ||
        proveedor.empresa.toLowerCase().includes(texto)
    );
    setProveedoresFiltrados(filtrados);
  };

  const eliminarProveedor = async () => {
    if (!proveedorAEliminar) return;

    try {
      const respuesta = await fetch(`http://localhost:3000/api/eliminarproveedor/${proveedorAEliminar.id_prov}`, {
        method: 'DELETE',
      });

      if (!respuesta.ok) {
        throw new Error('Error al eliminar el proveedor');
      }

      await obtenerProveedores();
      setMostrarModalEliminacion(false);
      establecerPaginaActual(1);
      setProveedorAEliminar(null);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const abrirModalEliminacion = (proveedor) => {
    setProveedorAEliminar(proveedor);
    setMostrarModalEliminacion(true);
  };

  const abrirModalEdicion = (proveedor) => {
    setProveedorEditado(proveedor);
    setMostrarModalEdicion(true);
  };

  const actualizarProveedor = async () => {
    if (!proveedorEditado?.nombre_proveedor || !proveedorEditado?.telefono || !proveedorEditado?.empresa) {
      setErrorFormulario("Por favor, completa todos los campos antes de guardar.");
      return;
    }

    try {
      const respuesta = await fetch(`http://localhost:3000/api/actualizarproveedor/${proveedorEditado.id_prov}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre_proveedor: proveedorEditado.nombre_proveedor,
          telefono: proveedorEditado.telefono,
          empresa: proveedorEditado.empresa,
        }),
      });

      if (!respuesta.ok) {
        throw new Error('Error al actualizar el proveedor');
      }

      await obtenerProveedores();
      setMostrarModalEdicion(false);
      setProveedorEditado(null);
      setErrorFormulario(null);
    } catch (error) {
      setErrorFormulario(error.message);
    }
  };

  const proveedoresPaginados = proveedoresFiltrados.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  return (
    <>
      <Container className="mt-5">
        <br />
        <h4>Proveedores</h4>

        <Row>
          <Col lg={2} md={4} sm={4} xs={5}>
            <Button
              variant="primary"
              onClick={() => setMostrarModal(true)}
              style={{ width: "100%" }}
            >
              Nuevo Proveedor
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

        <TablaProveedor
          proveedores={proveedoresPaginados}
          cargando={cargando}
          error={errorCarga}
          totalElementos={proveedoresFiltrados.length}
          elementosPorPagina={elementosPorPagina}
          paginaActual={paginaActual}
          establecerPaginaActual={establecerPaginaActual}
          abrirModalEliminacion={abrirModalEliminacion}
          abrirModalEdicion={abrirModalEdicion}
        />

        <ModalRegistroProveedor
          mostrarModal={mostrarModal}
          setMostrarModal={setMostrarModal}
          nuevoProveedor={nuevoProveedor}
          manejarCambioInput={manejarCambioInput}
          agregarProveedor={agregarProveedor}
          errorCarga={errorFormulario}
          cerrarModal={cerrarModal}
        />

        <ModalEliminacionProveedor
          mostrarModalEliminacion={mostrarModalEliminacion}
          setMostrarModalEliminacion={setMostrarModalEliminacion}
          eliminarProveedor={eliminarProveedor}
        />

        <ModalEdicionProveedor
          mostrarModalEdicion={mostrarModalEdicion}
          setMostrarModalEdicion={setMostrarModalEdicion}
          proveedorEditado={proveedorEditado}
          manejarCambioInputEdicion={manejarCambioInputEdicion}
          actualizarProveedor={actualizarProveedor}
          errorCarga={errorFormulario}
        />
      </Container>
    </>
  );
};

export default Proveedores;