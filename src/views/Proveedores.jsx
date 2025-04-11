// Importaciones necesarias para la vista
import React, { useState, useEffect } from 'react';
import { Container, Button,  Row, Col  } from "react-bootstrap";
import TablaProveedor from '../components/proveedor/TablaProveedor';
import CuadroBusquedas from '../components/busquedas/CuadroBusquedas'; // Componente para búsqueda
import ModalRegistroProveedor from '../components/proveedor/ModalRegistroProveedor';

// Declaración del componente Proveedores
const Proveedores = () => {
  // Estados para manejar los datos, carga y errores
  const [listaProveedores, setListaProveedores] = useState([]); // Almacena los datos de la API
  const [cargando, setCargando] = useState(true);              // Controla el estado de carga
  const [errorCarga, setErrorCarga] = useState(null);          // Maneja errores de la petición de datos
  const [errorFormulario, setErrorFormulario] = useState(null); // Maneja errores del formulario
  const [mostrarModal, setMostrarModal] = useState(false);     // Controla la visibilidad del modal
  const [nuevoProveedor, setNuevoProveedor] = useState({
    nombre_proveedor: '',
    telefono: '',
    empresa: '',
  }); // Estado para el nuevo proveedor con todos los campos
    const [proveedoresFiltrados, setProveedoresFiltrados] = useState([]); // Almacena los clientes filtrados
    const [textoBusqueda, setTextoBusqueda] = useState(""); // Almacena el texto de búsqueda
    const [paginaActual, establecerPaginaActual] = useState(1); // Página actual para paginación
    const elementosPorPagina = 3; // Número de elementos por página
  

  // Lógica de obtención de datos con useEffect
  const obtenerProveedores = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/proveedores');
      if (!respuesta.ok) {
        throw new Error('Error al cargar los proveedores');
      }
      const datos = await respuesta.json();
      setListaProveedores(datos); 
      setProveedoresFiltrados(datos); // Actualiza el estado con los datos
      setCargando(false);           // Indica que la carga terminó
    } catch (error) {
      setErrorCarga(error.message); // Guarda el mensaje de error
      setCargando(false);           // Termina la carga aunque haya error
    }
  };

  useEffect(() => {
    obtenerProveedores(); // Ejecuta la función al montar el componente
  }, []); // Array vacío para que solo se ejecute una vez

  // Maneja los cambios en el input del modal
  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoProveedor((prev) => ({
      ...prev,
      [name]: value || '', // Asegura que el valor nunca sea undefined
    }));
  };

  // Función para agregar un nuevo proveedor
  const agregarProveedor = async () => {
    // Validar que los campos requeridos no estén vacíos
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

      if (!respuesta.ok) throw new Error('Error al agregar el proveedor');

      await obtenerProveedores(); // Refresca la lista de proveedores
      setNuevoProveedor({
        nombre_proveedor: '',
        telefono: '',
        empresa: '',
      }); // Resetea el formulario
      setMostrarModal(false); // Cierra el modal
      setErrorFormulario(null); // Limpia el error del formulario
    } catch (error) {
      setErrorFormulario(error.message); // Guarda el error del formulario
    }
  };

  // Limpia el error del formulario al cerrar el modal
  const cerrarModal = () => {
    setMostrarModal(false);
    setErrorFormulario(null); // Limpia el error del formulario al cerrar
    setNuevoProveedor({
      nombre_proveedor: '',
      telefono: '',
      empresa: '',
    }); // Resetea el formulario
  };

    // Maneja los cambios en el cuadro de búsqueda
    const manejarCambioBusqueda = (e) => {
      const texto = e.target.value.toLowerCase();
      setTextoBusqueda(texto);
      establecerPaginaActual(1); // Reinicia la paginación al buscar
  
      const filtrados = listaProveedores.filter(
        (proveedor) =>
          proveedor.nombre_proveedor.toLowerCase().includes(texto) ||
          proveedor.telefono.toLowerCase().includes(texto) ||
          proveedor.empresa.toLowerCase().includes(texto) 
      );
      setProveedoresFiltrados(filtrados);
    };
  
    // Calcular elementos paginados
    const proveedoresPaginados = proveedoresFiltrados.slice(
      (paginaActual - 1) * elementosPorPagina,
      paginaActual * elementosPorPagina
    );
  

  // Renderizado de la vista
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

        {/* Pasa los estados como props al componente TablaProveedor */}
        <TablaProveedor 
          proveedores={proveedoresPaginados} 
          cargando={cargando} 
          error={errorCarga} 
          totalElementos={proveedoresFiltrados.length} // Total de elementos filtrados
          elementosPorPagina={elementosPorPagina} // Elementos por página
          paginaActual={paginaActual} // Página actual
          establecerPaginaActual={establecerPaginaActual} // Método para cambiar página
        />

        {/* Modal para registrar un nuevo proveedor */}
        <ModalRegistroProveedor
          mostrarModal={mostrarModal}
          setMostrarModal={setMostrarModal}
          nuevoProveedor={nuevoProveedor}
          manejarCambioInput={manejarCambioInput}
          agregarProveedor={agregarProveedor}
          errorCarga={errorFormulario}
          cerrarModal={cerrarModal}
        />
      </Container>
    </>
  );
};

// Exportación del componente
export default Proveedores;