import React, { useState, useEffect } from 'react';
import TablaCompras from '../components/compra/TablaCompras';
import ModalDetallesCompra from '../components/detalles_compras/ModalDetallesCompra.jsx';
import ModalEliminacionCompra from '../components/compra/ModalEliminacionCompra';
import ModalRegistroCompra from '../components/compra/ModalRegistroCompra.jsx';
import ModalActualizacionCompra from '../components/compra/ModalActualizacionCompra.jsx';
import { Container, Button, Row, Col, Alert } from 'react-bootstrap';

const Compras = () => {
  const [listaCompras, setListaCompras] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [detallesCompra, setDetallesCompra] = useState([]);
  const [cargandoDetalles, setCargandoDetalles] = useState(false);
  const [errorDetalles, setErrorDetalles] = useState(null);

  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [compraAEliminar, setCompraAEliminar] = useState(null);

  const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false);
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [nuevaCompra, setNuevaCompra] = useState({
    id_proveedor: '',
    fecha_compra: new Date(),
  });
  const [detallesNuevos, setDetallesNuevos] = useState([]);

  const [mostrarModalActualizacion, setMostrarModalActualizacion] = useState(false);
  const [compraAEditar, setCompraAEditar] = useState(null);
  const [detallesEditados, setDetallesEditados] = useState([]);

  const obtenerCompras = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/obtenercompras');
      if (!respuesta.ok) {
        throw new Error('Error al cargar las compras');
      }
      const datos = await respuesta.json();
      setListaCompras(datos);
      setCargando(false);
    } catch (error) {
      setErrorCarga(error.message);
      setCargando(false);
    }
  };

  const obtenerDetalles = async (id_compra) => {
    setCargandoDetalles(true);
    setErrorDetalles(null);
    try {
      const respuesta = await fetch(`http://localhost:3000/api/obtenerdetallescompra/${id_compra}`);
      if (!respuesta.ok) {
        throw new Error('Error al cargar los detalles de la compra');
      }
      const datos = await respuesta.json();
      setDetallesCompra(datos);
      setCargandoDetalles(false);
      setMostrarModal(true);
    } catch (error) {
      setErrorDetalles(error.message);
      setCargandoDetalles(false);
    }
  };

  const eliminarCompra = async () => {
    if (!compraAEliminar) return;

    try {
      const respuesta = await fetch(`http://localhost:3000/api/eliminarcompra/${compraAEliminar.id_compra}`, {
        method: 'DELETE',
      });

      if (!respuesta.ok) {
        throw new Error('Error al eliminar la compra');
      }

      setMostrarModalEliminacion(false);
      await obtenerCompras();
      setCompraAEliminar(null);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const abrirModalEliminacion = (compra) => {
    setCompraAEliminar(compra);
    setMostrarModalEliminacion(true);
  };

  const obtenerProveedores = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/proveedores');
      if (!respuesta.ok) throw new Error('Error al cargar los proveedores');
      const datos = await respuesta.json();
      setProveedores(datos);
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

  const agregarCompra = async () => {
    if (!nuevaCompra.id_proveedor || !nuevaCompra.fecha_compra || detallesNuevos.length === 0) {
      setErrorCarga('Por favor, completa todos los campos y agrega al menos un detalle.');
      return;
    }
    if (!(nuevaCompra.fecha_compra instanceof Date) || isNaN(nuevaCompra.fecha_compra)) {
      setErrorCarga('La fecha de compra no es válida.');
      return;
    }

    try {
      const compraData = {
        id_proveedor: nuevaCompra.id_proveedor,
        fecha_compra: nuevaCompra.fecha_compra.toLocaleString('en-CA', { 
          year: 'numeric', 
          month: '2-digit', 
          day: '2-digit', 
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit', 
          hour12: false 
        }).replace(',', ' '),
        detalles: detallesNuevos,
      };

      const respuesta = await fetch('http://localhost:3000/api/registrarcompra', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(compraData),
      });

      if (!respuesta.ok) throw new Error('Error al registrar la compra');

      await obtenerCompras();
      setNuevaCompra({ id_proveedor: '', fecha_compra: new Date() });
      setDetallesNuevos([]);
      setMostrarModalRegistro(false);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const abrirModalActualizacion = async (compra) => {
    setCargandoDetalles(true);
    try {
      const respuestaCompra = await fetch(`http://localhost:3000/api/obtenercompraporid/${compra.id_compra}`);
      if (!respuestaCompra.ok) throw new Error('Error al cargar la compra');
      const datosCompra = await respuestaCompra.json();

      const datosCompletos = {
        id_compra: datosCompra.id_compra,
        id_proveedor: datosCompra.id_proveedor,
        fecha_compra: datosCompra.fecha_compra,
        total_compra: datosCompra.total_compra,
        nombre_proveedor: compra.nombre_proveedor
      };

      setCompraAEditar(datosCompletos);

      const respuesta = await fetch(`http://localhost:3000/api/obtenerdetallescompra/${compra.id_compra}`);
      if (!respuesta.ok) throw new Error('Error al cargar los detalles de la compra');
      const datos = await respuesta.json();
      setDetallesEditados(datos);

      setCargandoDetalles(false);
      setMostrarModalActualizacion(true);
    } catch (error) {
      setErrorDetalles(error.message);
      setCargandoDetalles(false);
    }
  };

  const actualizarCompra = async (compraActualizada, detalles) => {
    if (!compraActualizada.id_proveedor || !compraActualizada.fecha_compra || detalles.length === 0) {
      setErrorCarga("Por favor, completa todos los campos y agrega al menos un detalle.");
      return;
    }
    if (!(compraActualizada.fecha_compra instanceof Date) || isNaN(compraActualizada.fecha_compra)) {
      setErrorCarga('La fecha de compra no es válida.');
      return;
    }

    try {
      const compraData = {
        id_proveedor: compraActualizada.id_proveedor,
        fecha_compra: compraActualizada.fecha_compra.toLocaleString('en-CA', { 
          year: 'numeric', 
          month: '2-digit', 
          day: '2-digit', 
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit', 
          hour12: false 
        }).replace(',', ' '),
        detalles
      };
      const respuesta = await fetch(`http://localhost:3000/api/actualizarcompra/${compraActualizada.id_compra}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(compraData)
      });
      if (!respuesta.ok) throw new Error('Error al actualizar la compra');
      await obtenerCompras();
      setMostrarModalActualizacion(false);
      setCompraAEditar(null);
      setDetallesEditados([]);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  useEffect(() => {
    obtenerCompras();
    obtenerProveedores();
    obtenerProductos();
  }, []);

  return (
    <Container className="mt-5">
      <br />
      <h4>Compras con Detalles</h4>
      {errorCarga && <Alert variant="danger">{errorCarga}</Alert>}
      <Row>
        <Col lg={2} md={4} sm={4} xs={5}>
          <Button variant="primary" onClick={() => setMostrarModalRegistro(true)} style={{ width: '100%' }}>
            <i className="bi 		bi-cart-plus me-2"></i>
            Nueva Compra
          </Button>
        </Col>
      </Row>
      <br />
      <TablaCompras
        compras={listaCompras}
        cargando={cargando}
        error={errorCarga}
        obtenerDetalles={obtenerDetalles}
        abrirModalEliminacion={abrirModalEliminacion}
        abrirModalActualizacion={abrirModalActualizacion}
      />
      <ModalDetallesCompra
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        detalles={detallesCompra}
        cargandoDetalles={cargandoDetalles}
        errorDetalles={errorDetalles}
      />
      <ModalEliminacionCompra
        mostrarModalEliminacion={mostrarModalEliminacion}
        setMostrarModalEliminacion={setMostrarModalEliminacion}
        eliminarCompra={eliminarCompra}
      />
      <ModalRegistroCompra
        mostrarModal={mostrarModalRegistro}
        setMostrarModal={setMostrarModalRegistro}
        nuevaCompra={nuevaCompra}
        setNuevaCompra={setNuevaCompra}
        detallesCompra={detallesNuevos}
        setDetallesCompra={setDetallesNuevos}
        agregarDetalle={agregarDetalle}
        agregarCompra={agregarCompra}
        errorCarga={errorCarga}
        proveedores={proveedores}
        productos={productos}
      />
      <ModalActualizacionCompra
        mostrarModal={mostrarModalActualizacion}
        setMostrarModal={setMostrarModalActualizacion}
        compra={compraAEditar}
        detallesCompra={detallesEditados}
        setDetallesCompra={setDetallesEditados}
        actualizarCompra={actualizarCompra}
        errorCarga={errorCarga}
        proveedores={proveedores}
        productos={productos}
      />
    </Container>
  );
};

export default Compras;