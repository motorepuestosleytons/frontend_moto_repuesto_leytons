// Importaciones necesarias para la vista
import React, { useState, useEffect } from 'react';
import TablaMarcas from '../components/marca/TablaMarcas'; // Componente de tabla para marcas
import ModalRegistroMarca from '../components/marca/ModalRegistroMarca'; // Modal para registrar marcas
import CuadroBusquedas from '../components/busquedas/CuadroBusquedas'; // Componente para búsqueda (corregido)
import Paginacion from '../components/ordenamiento/Paginacion';
import { Container, Button, Row, Col } from "react-bootstrap";

// Declaración del componente Marcas
const Marcas = () => {
  // Estados para manejar los datos, carga y errores
  const [listaMarcas, setListaMarcas] = useState([]); // Almacena los datos de la API
  const [cargando, setCargando] = useState(true);     // Controla el estado de carga
  const [errorCarga, setErrorCarga] = useState(null); // Maneja errores de la petición
  const [errorFormulario, setErrorFormulario] = useState(null); // Maneja errores del formulario
  const [mostrarModal, setMostrarModal] = useState(false); // Controla la visibilidad del modal
  const [nuevaMarca, setNuevaMarca] = useState({ marca: '' }); // Estado para la nueva marca
  const [marcasFiltradas, setMarcasFiltradas] = useState([]); // Almacena las marcas filtradas
  const [textoBusqueda, setTextoBusqueda] = useState(""); // Almacena el texto de búsqueda
  const [paginaActual, establecerPaginaActual] = useState(1); // Página actual para paginación
  const elementosPorPagina = 3; // Número de elementos por página

  // Lógica de obtención de datos con useEffect
  const obtenerMarcas = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/marcas');
      if (!respuesta.ok) {
        throw new Error('Error al cargar las marcas');
      }
      const datos = await respuesta.json();
      setListaMarcas(datos);    // Actualiza el estado con los datos
      setMarcasFiltradas(datos); // Inicializa las marcas filtradas con todos los datos
      setCargando(false);       // Indica que la carga terminó
    } catch (error) {
      setErrorCarga(error.message); // Guarda el mensaje de error
      setCargando(false);       // Termina la carga aunque haya error
    }
  };

  useEffect(() => {
    obtenerMarcas(); // Ejecuta la función al montar el componente
  }, []); // Array vacío para que solo se ejecute una vez

  // Maneja los cambios en el input del modal
  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevaMarca((prev) => ({
      ...prev,
      [name]: value || '', // Asegura que el valor nunca sea undefined
    }));
  };

  // Función para agregar una nueva marca
  const agregarMarca = async () => {
    // Validar que el campo requerido no esté vacío
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

      if (!respuesta.ok) throw new Error('Error al agregar la marca');

      await obtenerMarcas(); // Refresca la lista de marcas
      setNuevaMarca({ marca: '' }); // Resetea el formulario
      setMostrarModal(false); // Cierra el modal
      setErrorFormulario(null); // Limpia el error del formulario
    } catch (error) {
      setErrorFormulario(error.message); // Guarda el error del formulario
    }
  };

  // Limpia el error del formulario y resetea los campos al cerrar el modal
  const cerrarModal = () => {
    setMostrarModal(false);
    setErrorFormulario(null); // Limpia el error del formulario
    setNuevaMarca({ marca: '' }); // Resetea el formulario
  };

  // Maneja los cambios en el cuadro de búsqueda
  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);
    establecerPaginaActual(1); // Reinicia la paginación al buscar

    const filtradas = listaMarcas.filter(
      (marca) => marca.marca.toLowerCase().includes(texto)
    );
    setMarcasFiltradas(filtradas);
  };

  // Calcular elementos paginados
  const marcasPaginadas = marcasFiltradas.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  // Renderizado de la vista
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

        {/* Pasa los estados como props al componente TablaMarcas */}
        <TablaMarcas
          marcas={marcasPaginadas}
          cargando={cargando}
          error={errorCarga}
          totalElementos={marcasFiltradas.length} // Total de elementos filtrados
          elementosPorPagina={elementosPorPagina} // Elementos por página
          paginaActual={paginaActual} // Página actual
          establecerPaginaActual={establecerPaginaActual} // Método para cambiar página
        />

        {/* Modal para registrar una nueva marca */}
        <ModalRegistroMarca
          mostrarModal={mostrarModal}
          setMostrarModal={setMostrarModal}
          nuevaMarca={nuevaMarca}
          manejarCambioInput={manejarCambioInput}
          agregarMarca={agregarMarca}
          errorCarga={errorFormulario} // Pasa el error del formulario
          cerrarModal={cerrarModal} // Pasa la función para cerrar el modal
        />
      </Container>
    </>
  );
};

// Exportación del componente
export default Marcas;