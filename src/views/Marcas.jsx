import React, { useState, useEffect } from 'react';
import TablaMarcas from '../components/marca/TablaMarcas';
import ModalRegistroMarca from '../components/marca/ModalRegistroMarca';
import ModalEliminacionMarca from '../components/marca/ModalEliminacionMarca';
import ModalEdicionMarca from '../components/marca/ModalEdicionMarca';
import CuadroBusquedas from '../components/busquedas/CuadroBusquedas';
import { Container, Button, Row, Col } from "react-bootstrap";

const Marcas = () => {
  const [listaMarcas, setListaMarcas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [errorFormulario, setErrorFormulario] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevaMarca, setNuevaMarca] = useState({ marca: '' });
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [marcaAEliminar, setMarcaAEliminar] = useState(null);
  const [marcasFiltradas, setMarcasFiltradas] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [paginaActual, establecerPaginaActual] = useState(1);
  const elementosPorPagina = 3;
  const [marcaEditada, setMarcaEditada] = useState(null);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState (false);

  const obtenerMarcas = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/marcas');
      if (!respuesta.ok) {
        throw new Error('Error al cargar las marcas');
      }
      const datos = await respuesta.json();
      setListaMarcas(datos);
      setMarcasFiltradas(datos);
      setCargando(false);
    } catch (error) {
      setErrorCarga(error.message);
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerMarcas();
  }, []);

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevaMarca((prev) => ({
      ...prev,
      [name]: value || '',
    }));
  };

  const manejarCambioInputEdicion = (e) => {
    const { name, value } = e.target;
    setMarcaEditada((prev) => ({
      ...prev,
      [name]: value || '',
    }));
  };

  const agregarMarca = async () => {
    if (!nuevaMarca.marca) {
      setErrorFormulario("Por favor, completa el nombre de la marca.");
      return;
    }

    try {
      const respuesta = await fetch('http://localhost:3000/api/registrarmarcas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevaMarca),
      });

      if (!respuesta.ok) {
        throw new Error('Error al agregar la marca');
      }

      await obtenerMarcas();
      setNuevaMarca({ marca: '' });
      setMostrarModal(false);
      setErrorFormulario(null);
    } catch (error) {
      setErrorFormulario(error.message);
    }
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setErrorFormulario(null);
    setNuevaMarca({ marca: '' });
  };

  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);
    establecerPaginaActual(1);

    const filtradas = listaMarcas.filter(
      (marca) => marca.marca.toLowerCase().includes(texto)
    );
    setMarcasFiltradas(filtradas);
  };

  const eliminarMarca = async () => {
    if (!marcaAEliminar) return;

    try {
      const respuesta = await fetch(`http://localhost:3000/api/eliminarmarca/${marcaAEliminar.id_marca}`, {
        method: 'DELETE',
      });

      if (!respuesta.ok) {
        throw new Error('Error al eliminar la marca');
      }

      await obtenerMarcas();
      setMostrarModalEliminacion(false);
      establecerPaginaActual(1);
      setMarcaAEliminar(null);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const abrirModalEliminacion = (marca) => {
    setMarcaAEliminar(marca);
    setMostrarModalEliminacion(true);
  };

  const abrirModalEdicion = (marca) => {
    setMarcaEditada(marca);
    setMostrarModalEdicion(true);
  };

  const actualizarMarca = async () => {
    if (!marcaEditada?.marca) {
      setErrorFormulario("Por favor, completa el nombre de la marca antes de guardar.");
      return;
    }

    try {
      const respuesta = await fetch(`http://localhost:3000/api/actualizarmarca/${marcaEditada.id_marca}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          marca: marcaEditada.marca,
        }),
      });

      if (!respuesta.ok) {
        throw new Error('Error al actualizar la marca');
      }

      await obtenerMarcas();
      setMostrarModalEdicion(false);
      setMarcaEditada(null);
      setErrorFormulario(null);
    } catch (error) {
      setErrorFormulario(error.message);
    }
  };

  const marcasPaginadas = marcasFiltradas.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  return (
    <>
      <Container className="mt-5">
        <br />
        <h4>Marcas</h4>

        <Row>
          <Col lg={2} md={4} sm={4} xs={5}>
            <Button
              variant="primary"
              onClick={() => setMostrarModal(true)}
              style={{ width: "100%" }}
            >
              Nueva Marca
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

        <TablaMarcas
          marcas={marcasPaginadas}
          cargando={cargando}
          error={errorCarga}
          totalElementos={marcasFiltradas.length}
          elementosPorPagina={elementosPorPagina}
          paginaActual={paginaActual}
          establecerPaginaActual={establecerPaginaActual}
          abrirModalEliminacion={abrirModalEliminacion}
          abrirModalEdicion={abrirModalEdicion}
        />

        <ModalRegistroMarca
          mostrarModal={mostrarModal}
          setMostrarModal={setMostrarModal}
          nuevaMarca={nuevaMarca}
          manejarCambioInput={manejarCambioInput}
          agregarMarca={agregarMarca}
          errorCarga={errorFormulario}
          cerrarModal={cerrarModal}
        />

        <ModalEliminacionMarca
          mostrarModalEliminacion={mostrarModalEliminacion}
          setMostrarModalEliminacion={setMostrarModalEliminacion}
          eliminarMarca={eliminarMarca}
        />

        <ModalEdicionMarca
          mostrarModalEdicion={mostrarModalEdicion}
          setMostrarModalEdicion={setMostrarModalEdicion}
          marcaEditada={marcaEditada}
          manejarCambioInputEdicion={manejarCambioInputEdicion}
          actualizarMarca={actualizarMarca}
          errorCarga={errorFormulario}
        />
      </Container>
    </>
  );
};

export default Marcas;