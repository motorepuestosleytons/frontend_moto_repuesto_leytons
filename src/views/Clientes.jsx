// Importaciones necesarias para la vista
import React, { useState, useEffect } from 'react';
import TablaClientes from '../components/cliente/TablaClientes'; // Componente de tabla para clientes
import ModalRegistroCliente from '../components/cliente/ModalRegistroClientes'; // Modal para registrar clientes
import CuadroBusquedas from '../components/busquedas/CuadroBusquedas'; // Componente para búsqueda
import { Container, Button, Row, Col } from "react-bootstrap";

// Declaración del componente Clientes
const Clientes = () => {
  // Estados para manejar los datos, carga y errores
  const [listaClientes, setListaClientes] = useState([]); // Almacena los datos de la API
  const [cargando, setCargando] = useState(true);        // Controla el estado de carga
  const [errorCarga, setErrorCarga] = useState(null);    // Maneja errores de la petición de datos
  const [errorFormulario, setErrorFormulario] = useState(null); // Maneja errores del formulario
  const [mostrarModal, setMostrarModal] = useState(false); // Controla la visibilidad del modal
  const [nuevoCliente, setNuevoCliente] = useState({
    cedula: '',
    nombre_cliente: '',
    apellido: '',
    telefono: '',
  }); // Estado para el nuevo cliente con todos los campos
  const [clientesFiltrados, setClientesFiltrados] = useState([]); // Almacena los clientes filtrados
  const [textoBusqueda, setTextoBusqueda] = useState(""); // Almacena el texto de búsqueda
  const [paginaActual, establecerPaginaActual] = useState(1); // Página actual para paginación
  const elementosPorPagina = 3; // Número de elementos por página

  // Lógica de obtención de datos con useEffect
  const obtenerClientes = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/clientes');
      if (!respuesta.ok) {
        throw new Error('Error al cargar los clientes');
      }
      const datos = await respuesta.json();
      setListaClientes(datos);    // Actualiza el estado con los datos
      setClientesFiltrados(datos); // Inicializa los clientes filtrados con todos los datos
      setCargando(false);         // Indica que la carga terminó
    } catch (error) {
      setErrorCarga(error.message); // Guarda el mensaje de error de carga
      setCargando(false);         // Termina la carga aunque haya error
    }
  };

  useEffect(() => {
    obtenerClientes(); // Ejecuta la función al montar el componente
  }, []); // Array vacío para que solo se ejecute una vez

  // Maneja los cambios en el input del modal
  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoCliente((prev) => ({
      ...prev,
      [name]: value || '', // Asegura que el valor nunca sea undefined
    }));
  };

  // Función para agregar un nuevo cliente
  const agregarCliente = async () => {
    // Validar que los campos requeridos no estén vacíos
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

      if (!respuesta.ok) throw new Error('Error al agregar el cliente');

      await obtenerClientes(); // Refresca la lista de clientes
      setNuevoCliente({
        cedula: '',
        nombre_cliente: '',
        apellido: '',
        telefono: '',
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
    setNuevoCliente({
      cedula: '',
      nombre_cliente: '',
      apellido: '',
      telefono: '',
    }); // Resetea el formulario
  };

  // Maneja los cambios en el cuadro de búsqueda
  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);
    establecerPaginaActual(1); // Reinicia la paginación al buscar

    const filtrados = listaClientes.filter(
      (cliente) =>
        cliente.cedula.toLowerCase().includes(texto) ||
        cliente.nombre_cliente.toLowerCase().includes(texto) ||
        cliente.apellido.toLowerCase().includes(texto) ||
        cliente.telefono.toLowerCase().includes(texto)
    );
    setClientesFiltrados(filtrados);
  };

  // Calcular elementos paginados
  const clientesPaginados = clientesFiltrados.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  // Renderizado de la vista
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

        {/* Pasa los estados como props al componente TablaClientes */}
        <TablaClientes
          clientes={clientesPaginados}
          cargando={cargando}
          error={errorCarga}
          totalElementos={clientesFiltrados.length} // Total de elementos filtrados
          elementosPorPagina={elementosPorPagina} // Elementos por página
          paginaActual={paginaActual} // Página actual
          establecerPaginaActual={establecerPaginaActual} // Método para cambiar página
        />

        {/* Modal para registrar un nuevo cliente */}
        <ModalRegistroCliente
          mostrarModal={mostrarModal}
          setMostrarModal={setMostrarModal}
          nuevoCliente={nuevoCliente}
          manejarCambioInput={manejarCambioInput}
          agregarCliente={agregarCliente}
          errorCarga={errorFormulario} // Pasa el error del formulario al modal
          cerrarModal={cerrarModal} // Pasa la función para cerrar el modal
        />
      </Container>
    </>
  );
};

// Exportación del componente
export default Clientes;