// Importaciones necesarias para la vista
import React, { useState, useEffect } from 'react';
import TablaMarcas from '../components/marca/TablaMarcas'; // Componente de tabla para marcas
import ModalRegistroMarca from '../components/marca/ModalRegistroMarca'; // Modal para registrar marcas
import { Container, Button } from "react-bootstrap";

// Declaración del componente Marcas
const Marcas = () => {
  // Estados para manejar los datos, carga y errores
  const [listaMarcas, setListaMarcas] = useState([]); // Almacena los datos de la API
  const [cargando, setCargando] = useState(true);     // Controla el estado de carga
  const [errorCarga, setErrorCarga] = useState(null); // Maneja errores de la petición
  const [mostrarModal, setMostrarModal] = useState(false); // Controla la visibilidad del modal
  const [nuevaMarca, setNuevaMarca] = useState({ marca: '' }); // Estado para la nueva marca

  // Lógica de obtención de datos con useEffect
  const obtenerMarcas = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/marcas');
      if (!respuesta.ok) {
        throw new Error('Error al cargar las marcas');
      }
      const datos = await respuesta.json();
      setListaMarcas(datos);    // Actualiza el estado con los datos
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
      [name]: value
    }));
  };

  // Función para agregar una nueva marca
  const agregarMarca = async () => {
    if (!nuevaMarca.marca) {
      setErrorCarga("Por favor, completa el nombre de la marca.");
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
      setErrorCarga(null); // Limpia el error
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  // Renderizado de la vista
  return (
    <>
      <Container className="mt-5">
        <br />
        <h4>Marcas</h4>

        <Button variant="primary" onClick={() => setMostrarModal(true)}>
          Nueva Marca
        </Button>
        <br />
        <br />

        {/* Pasa los estados como props al componente TablaMarcas */}
        <TablaMarcas
          marcas={listaMarcas}
          cargando={cargando}
          error={errorCarga}
        />

        {/* Modal para registrar una nueva marca */}
        <ModalRegistroMarca
          mostrarModal={mostrarModal}
          setMostrarModal={setMostrarModal}
          nuevaMarca={nuevaMarca}
          manejarCambioInput={manejarCambioInput}
          agregarMarca={agregarMarca}
          errorCarga={errorCarga}
        />
      </Container>
    </>
  );
};

// Exportación del componente
export default Marcas;