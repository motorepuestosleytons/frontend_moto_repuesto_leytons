import React, { useState, useEffect } from 'react';
import TablaProductos from '../components/producto/TablaProductos';
import ModalRegistroProducto from '../components/producto/ModalRegistroProducto';
import ModalEliminacionProducto from '../components/producto/ModalEliminacionProducto';
import ModalEdicionProducto from '../components/producto/ModalEdicionProducto';
import CuadroBusquedas from '../components/busquedas/CuadroBusquedas';
import { Container, Button, Row, Col } from "react-bootstrap";

const Productos = () => {
  const [listaProductos, setListaProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [errorFormulario, setErrorFormulario] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre_: '',
    modelo: '',
    precio_venta: '',
    precio_compra: '',
    stock: '',
    id_marca: ''
  });
  const [listaMarcas, setListaMarcas] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [paginaActual, establecerPaginaActual] = useState(1);
  const elementosPorPagina = 3;
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const [productoEditado, setProductoEditado] = useState(null);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);

  const obtenerProductos = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/productos');
      if (!respuesta.ok) {
        throw new Error('Error al cargar los productos');
      }
      const datos = await respuesta.json();
      setListaProductos(datos);
      setProductosFiltrados(datos);
      setCargando(false);
    } catch (error) {
      setErrorCarga(error.message);
      setCargando(false);
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
  }, []);

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoProducto((prev) => ({
      ...prev,
      [name]: value || '',
    }));
  };

  const manejarCambioInputEdicion = (e) => {
    const { name, value } = e.target;
    setProductoEditado((prev) => ({
      ...prev,
      [name]: value || '',
    }));
  };

  const agregarProducto = async () => {
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
      const productoParaEnviar = {
        nombre_: nuevoProducto.nombre_,
        modelo: nuevoProducto.modelo,
        precio_venta: Number(nuevoProducto.precio_venta),
        precio_compra: Number(nuevoProducto.precio_compra),
        stock: parseInt(nuevoProducto.stock, 10),
        id_marca: parseInt(nuevoProducto.id_marca, 10)
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

      await obtenerProductos();
      setNuevoProducto({
        nombre_: '',
        modelo: '',
        precio_venta: '',
        precio_compra: '',
        stock: '',
        id_marca: ''
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
    setNuevoProducto({
      nombre_: '',
      modelo: '',
      precio_venta: '',
      precio_compra: '',
      stock: '',
      id_marca: ''
    });
  };

  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);
    establecerPaginaActual(1);

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

  const eliminarProducto = async () => {
    if (!productoAEliminar) return;

    try {
      const respuesta = await fetch(`http://localhost:3000/api/eliminarproducto/${productoAEliminar.id_producto}`, {
        method: 'DELETE',
      });

      if (!respuesta.ok) {
        const errorData = await respuesta.json();
        throw new Error(errorData.mensaje || 'Error al eliminar el producto');
      }

      await obtenerProductos();
      setMostrarModalEliminacion(false);
      establecerPaginaActual(1);
      setProductoAEliminar(null);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const abrirModalEliminacion = (producto) => {
    setProductoAEliminar(producto);
    setMostrarModalEliminacion(true);
  };

  const abrirModalEdicion = (producto) => {
    setProductoEditado(producto);
    setMostrarModalEdicion(true);
  };

  const actualizarProducto = async () => {
    if (
      !productoEditado?.nombre_ ||
      !productoEditado?.modelo ||
      !productoEditado?.precio_venta ||
      !productoEditado?.precio_compra ||
      !productoEditado?.stock ||
      !productoEditado?.id_marca
    ) {
      setErrorFormulario("Por favor, completa todos los campos requeridos.");
      return;
    }

    if (
      isNaN(productoEditado.precio_venta) ||
      isNaN(productoEditado.precio_compra) ||
      isNaN(productoEditado.stock) ||
      isNaN(productoEditado.id_marca)
    ) {
      setErrorFormulario("Los campos precio_venta, precio_compra, stock e id_marca deben ser numéricos.");
      return;
    }

    try {
      const productoParaEnviar = {
        nombre_: productoEditado.nombre_,
        modelo: productoEditado.modelo,
        precio_venta: Number(productoEditado.precio_venta),
        precio_compra: Number(productoEditado.precio_compra),
        stock: parseInt(productoEditado.stock, 10),
        id_marca: parseInt(productoEditado.id_marca, 10)
      };

      const respuesta = await fetch(`http://localhost:3000/api/actualizarproducto/${productoEditado.id_producto}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productoParaEnviar),
      });

      if (!respuesta.ok) {
        const errorData = await respuesta.json();
        throw new Error(errorData.mensaje || 'Error al actualizar el producto');
      }

      await obtenerProductos();
      setMostrarModalEdicion(false);
      setProductoEditado(null);
      setErrorFormulario(null);
    } catch (error) {
      setErrorFormulario(error.message);
    }
  };

  const productosPaginados = productosFiltrados.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

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

        <TablaProductos
          productos={productosPaginados}
          cargando={cargando}
          error={errorCarga}
          totalElementos={productosFiltrados.length}
          elementosPorPagina={elementosPorPagina}
          paginaActual={paginaActual}
          establecerPaginaActual={establecerPaginaActual}
          abrirModalEliminacion={abrirModalEliminacion}
          abrirModalEdicion={abrirModalEdicion}
        />

        <ModalRegistroProducto
          mostrarModal={mostrarModal}
          setMostrarModal={setMostrarModal}
          nuevoProducto={nuevoProducto}
          manejarCambioInput={manejarCambioInput}
          agregarProducto={agregarProducto}
          errorCarga={errorFormulario}
          marcas={listaMarcas}
          cerrarModal={cerrarModal}
        />

        <ModalEliminacionProducto
          mostrarModalEliminacion={mostrarModalEliminacion}
          setMostrarModalEliminacion={setMostrarModalEliminacion}
          eliminarProducto={eliminarProducto}
        />

        <ModalEdicionProducto
          mostrarModalEdicion={mostrarModalEdicion}
          setMostrarModalEdicion={setMostrarModalEdicion}
          productoEditado={productoEditado}
          manejarCambioInputEdicion={manejarCambioInputEdicion}
          actualizarProducto={actualizarProducto}
          errorCarga={errorFormulario}
          marcas={listaMarcas}
        />
      </Container>
    </>
  );
};

export default Productos;