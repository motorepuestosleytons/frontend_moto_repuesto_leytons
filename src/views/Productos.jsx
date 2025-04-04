import React, { useState, useEffect } from 'react';
import { Container, Button } from "react-bootstrap";
import TablaProductos from '../components/producto/TablaProductos';
import ModalRegistroProducto from '../components/producto/ModalRegistroProducto';

const Productos = () => {
  const [listaProductos, setListaProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [listaMarcas, setListaMarcas] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre_: '',
    modelo: '',
    precio_venta: '',
    precio_compra: '',
    stock: '',
    id_marca: ''
  });

  const obtenerProductos = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/productos');
      if (!respuesta.ok) {
        throw new Error('Error al cargar los productos');
      }
      const datos = await respuesta.json();
      setListaProductos(datos);
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
    setNuevoProducto(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const agregarProducto = async () => {
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
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  return (
    <Container className="mt-5">
      <br />
      <h4>Productos</h4>
      <Button variant="primary" onClick={() => setMostrarModal(true)} className="mb-3">
        Nuevo Producto
      </Button>

      <TablaProductos
        productos={listaProductos}
        cargando={cargando}
        error={errorCarga}
      />

      <ModalRegistroProducto
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevoProducto={nuevoProducto}
        manejarCambioInput={manejarCambioInput}
        agregarProducto={agregarProducto}
        errorCarga={errorCarga}
        marcas={listaMarcas}
      />
    </Container>
  );
};

export default Productos;