// Importaciones necesarias para la vista
import React, { useState, useEffect } from 'react';
import TablaProductos from '../components/producto/TablaProductos'; // Componente de tabla para productos
import ModalRegistroProducto from '../components/producto/ModalRegistroProducto'; // Modal para registrar productos
import CuadroBusquedas from '../components/busquedas/CuadroBusquedas'; // Componente para búsqueda
import { Container, Button, Row, Col } from "react-bootstrap";

// Declaración del componente Productos
const Productos = () => {
  // Estados para manejar los datos, carga y errores
  const [listaProductos, setListaProductos] = useState([]); // Almacena los datos de la API
  const [cargando, setCargando] = useState(true);          // Controla el estado de carga
  const [errorCarga, setErrorCarga] = useState(null);      // Maneja errores de la petición
  const [errorFormulario, setErrorFormulario] = useState(null); // Maneja errores del formulario
  const [mostrarModal, setMostrarModal] = useState(false); // Controla la visibilidad del modal
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre_: '',
    modelo: '',
    precio_venta: '',
    precio_compra: '',
    stock: '',
    id_marca: ''
  }); // Estado para el nuevo producto con todos los campos
  const [listaMarcas, setListaMarcas] = useState([]);      // Almacena las marcas
  const [productosFiltrados, setProductosFiltrados] = useState([]); // Almacena los productos filtrados
  const [textoBusqueda, setTextoBusqueda] = useState("");  // Almacena el texto de búsqueda
  const [paginaActual, establecerPaginaActual] = useState(1); // Página actual para paginación
  const elementosPorPagina = 3; // Número de elementos por página

  // Lógica de obtención de datos con useEffect
  const obtenerProductos = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/productos');
      if (!respuesta.ok) {
        throw new Error('Error al cargar los productos');
      }
      const datos = await respuesta.json();
      setListaProductos(datos);    // Actualiza el estado con los datos
      setProductosFiltrados(datos); // Inicializa los productos filtrados con todos los datos
      setCargando(false);         // Indica que la carga terminó
    } catch (error) {
      setErrorCarga(error.message); // Guarda el mensaje de error de carga
      setCargando(false);         // Termina la carga aunque haya error
    }
  };

  const obtenerMarcas = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/marcas');
      if (!respuesta.ok) {
        throw new Error('Error al cargar las marcas');
      }
      const datos = await respuesta.json();
      setListaMarcas(datos);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  useEffect(() => {
    obtenerProductos();
    obtenerMarcas();
  }, []); // Array vacío para que solo se ejecute una vez

  // Maneja los cambios en el input del modal
  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoProducto((prev) => ({
      ...prev,
      [name]: value || '', // Asegura que el valor nunca sea undefined
    }));
  };

  // Función para agregar un nuevo producto
  const agregarProducto = async () => {
    // Validar que los campos requeridos no estén vacíos
    if (
      !nuevoProducto.nombre_ ||
      !nuevoProducto.modelo ||
      !nuevoProducto.precio_venta ||
      !nuevoProducto.precio_compra ||
      !nuevoProducto.stock ||
      !nuevoProducto.id_marca
    ) {
      setErrorFormulario("Por favor, completa todos los campos requeridos.");
      return;
    }

    // Validar que los campos numéricos sean válidos
    if (
      isNaN(nuevoProducto.precio_venta) ||
      isNaN(nuevoProducto.precio_compra) ||
      isNaN(nuevoProducto.stock) ||
      isNaN(nuevoProducto.id_marca)
    ) {
      setErrorFormulario("Los campos precio_venta, precio_compra, stock e id_marca deben ser numéricos.");
      return;
    }

    try {
      // Convertir los valores a los tipos correctos antes de enviarlos
      const productoParaEnviar = {
        nombre_: nuevoProducto.nombre_,
        modelo: nuevoProducto.modelo,
        precio_venta: Number(nuevoProducto.precio_venta), // Convertir a número
        precio_compra: Number(nuevoProducto.precio_compra), // Convertir a número
        stock: parseInt(nuevoProducto.stock, 10), // Convertir a entero
        id_marca: parseInt(nuevoProducto.id_marca, 10) // Convertir a entero
      };

      const respuesta = await fetch('http://localhost:3000/api/registrarproducto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productoParaEnviar),
      });

      if (!respuesta.ok) {
        const errorData = await respuesta.json();
        throw new Error(errorData.mensaje || 'Error al agregar el producto');
      }

      await obtenerProductos(); // Refresca la lista de productos
      setNuevoProducto({
        nombre_: '',
        modelo: '',
        precio_venta: '',
        precio_compra: '',
        stock: '',
        id_marca: ''
      }); // Resetea el formulario
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
    setNuevoProducto({
      nombre_: '',
      modelo: '',
      precio_venta: '',
      precio_compra: '',
      stock: '',
      id_marca: ''
    }); // Resetea el formulario
  };

  // Maneja los cambios en el cuadro de búsqueda
  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);
    establecerPaginaActual(1); // Reinicia la paginación al buscar

    const filtrados = listaProductos.filter(
      (producto) =>
        producto.nombre_?.toLowerCase().includes(texto) ||
        producto.modelo?.toLowerCase().includes(texto) ||
        producto.precio_venta?.toString().includes(texto) ||
        producto.precio_compra?.toString().includes(texto) ||
        producto.stock?.toString().includes(texto) ||
        producto.id_marca?.toString().includes(texto)
    );
    setProductosFiltrados(filtrados);
  };

  // Calcular elementos paginados
  const productosPaginados = productosFiltrados.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  // Renderizado de la vista
  return (
    <>
      <Container className="mt-5">
        <br />
        <h4>Productos</h4>

        <Row>
          <Col lg={2} md={4} sm={4} xs={5}>
            <Button
              variant="primary"
              onClick={() => setMostrarModal(true)}
              style={{ width: "100%" }}
            >
              Nuevo Producto
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

        {/* Pasa los estados como props al componente TablaProductos */}
        <TablaProductos
          productos={productosPaginados}
          cargando={cargando}
          error={errorCarga}
          totalElementos={productosFiltrados.length} // Total de elementos filtrados
          elementosPorPagina={elementosPorPagina} // Elementos por página
          paginaActual={paginaActual} // Página actual
          establecerPaginaActual={establecerPaginaActual} // Método para cambiar página
        />

        {/* Modal para registrar un nuevo producto */}
        <ModalRegistroProducto
          mostrarModal={mostrarModal}
          setMostrarModal={setMostrarModal}
          nuevoProducto={nuevoProducto}
          manejarCambioInput={manejarCambioInput}
          agregarProducto={agregarProducto}
          errorCarga={errorFormulario} // Pasa el error del formulario
          marcas={listaMarcas}
          cerrarModal={cerrarModal} // Pasa la función para cerrar el modal
        />
      </Container>
    </>
  );
};

// Exportación del componente
export default Productos;