import React, { useState, useEffect } from 'react';
import TablaVentas from '../components/venta/TablaVentas';
import { Container, Button, Row, Col, Alert } from 'react-bootstrap';
import ModalDetallesVenta from '../components/detalles_ventas/ModalDetallesVentas.jsx';
import ModalEliminacionVenta from '../components/venta/ModalEliminacionVenta';
import ModalRegistroVenta from '../components/venta/ModalRegistroVenta.jsx';

const Ventas = () => {
  const [listaVentas, setListaVentas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [detallesVenta, setDetallesVenta] = useState([]);
  const [cargandoDetalles, setCargandoDetalles] = useState(false);
  const [errorDetalles, setErrorDetalles] = useState(null);

  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [ventaAEliminar, setVentaAEliminar] = useState(null);

  const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [nuevaVenta, setNuevaVenta] = useState({
    id_cliente: '',
    fecha_venta: new Date(),
  });
  const [detallesNuevos, setDetallesNuevos] = useState([]);

  const obtenerVentas = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/obtenerventas');
      if (!respuesta.ok) {
        throw new Error('Error al cargar las ventas');
      }
      const datos = await respuesta.json();
      setListaVentas(datos);
      setCargando(false);
    } catch (error) {
      setErrorCarga(error.message);
      setCargando(false);
    }
  };

  const obtenerDetalles = async (id_venta) => {
    setCargandoDetalles(true);
    setErrorDetalles(null);
    try {
      const respuesta = await fetch(`http://localhost:3000/api/obtenerdetallesventa/${id_venta}`);
      if (!respuesta.ok) {
        throw new Error('Error al cargar los detalles de la venta');
      }
      const datos = await respuesta.json();
      setDetallesVenta(datos);
      setCargandoDetalles(false);
      setMostrarModal(true);
    } catch (error) {
      setErrorDetalles(error.message);
      setCargandoDetalles(false);
    }
  };

  const eliminarVenta = async () => {
    if (!ventaAEliminar) return;

    try {
      const respuesta = await fetch(`http://localhost:3000/api/eliminarventa/${ventaAEliminar.id_venta}`, {
        method: 'DELETE',
      });

      if (!respuesta.ok) {
        throw new Error('Error al eliminar la venta');
      }

      setMostrarModalEliminacion(false);
      await obtenerVentas();
      setVentaAEliminar(null);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const abrirModalEliminacion = (venta) => {
    setVentaAEliminar(venta);
    setMostrarModalEliminacion(true);
  };

  const obtenerClientes = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/clientes');
      if (!respuesta.ok) throw new Error('Error al cargar los clientes');
      const datos = await respuesta.json();
      setClientes(datos);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const obtenerProductos = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/productos');
      if (!respuesta.ok) throw new Error('Error al cargar los productos');
      const datos = await respuesta.json();
      setProductos(datos);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const agregarDetalle = (detalle) => {
    const nuevoDetalle = {
      id_producto: detalle.id_producto,
      cantidad: detalle.cantidad,
      precio_unitario: detalle.precio_unitario,
      total: detalle.cantidad * detalle.precio_unitario,
    };
    setDetallesNuevos((prev) => [...prev, nuevoDetalle]);
  };

  const agregarVenta = async () => {
    if (!nuevaVenta.id_cliente || !nuevaVenta.fecha_venta || detallesNuevos.length === 0) {
      setErrorCarga('Por favor, completa todos los campos y agrega al menos un detalle.');
      return;
    }

    try {
      const ventaData = {
        id_cliente: nuevaVenta.id_cliente,
        fecha_venta: nuevaVenta.fecha_venta.toISOString(),
        detalles: detallesNuevos,
      };

      const respuesta = await fetch('http://localhost:3000/api/registrarventa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ventaData),
      });

      if (!respuesta.ok) throw new Error('Error al registrar la venta');

      await obtenerVentas();
      setNuevaVenta({ id_cliente: '', fecha_venta: new Date() });
      setDetallesNuevos([]);
      setMostrarModalRegistro(false);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  useEffect(() => {
    obtenerVentas();
    obtenerClientes();
    obtenerProductos();
  }, []);

  return (
    
    <Container className="mt-5">
          <br />
      <h4>Ventas con Detalles</h4>
      {errorCarga && <Alert variant="danger">{errorCarga}</Alert>}
      <Row>
        <Col lg={2} md={4} sm={4} xs={5}>
          <Button variant="primary" onClick={() => setMostrarModalRegistro(true)} style={{ width: '100%' }}>
            Nueva Venta
          </Button>
        </Col>
      </Row>
      <br />
      
      <TablaVentas
        ventas={listaVentas}
        cargando={cargando}
        error={errorCarga}
        obtenerDetalles={obtenerDetalles}
        abrirModalEliminacion={abrirModalEliminacion}
      />
      <ModalDetallesVenta
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        detalles={detallesVenta}
        cargandoDetalles={cargandoDetalles}
        errorDetalles={errorDetalles}
      />
      <ModalEliminacionVenta
        mostrarModalEliminacion={mostrarModalEliminacion}
        setMostrarModalEliminacion={setMostrarModalEliminacion}
        eliminarVenta={eliminarVenta}
      />
      <ModalRegistroVenta
        mostrarModal={mostrarModalRegistro}
        setMostrarModal={setMostrarModalRegistro}
        nuevaVenta={nuevaVenta}
        setNuevaVenta={setNuevaVenta}
        detallesVenta={detallesNuevos}
        setDetallesVenta={setDetallesNuevos}
        agregarDetalle={agregarDetalle}
        agregarVenta={agregarVenta}
        errorCarga={errorCarga}
        clientes={clientes}
        productos={productos}
      />
    </Container>
  );
};

export default Ventas;