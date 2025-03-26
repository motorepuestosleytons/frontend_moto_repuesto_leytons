// Importaciones necesarias para la vista
import React, { useState, useEffect } from 'react';
import { Container } from "react-bootstrap";
import TablaCompras from '../components/compra/TablaCompras';

// Declaración del componente Clientes
const Compras= () => {
  // Estados para manejar los datos, carga y errores
  const [listaCompras, setListaCompras] = useState([]); // Almacena los datos de la API
  const [cargando, setCargando] = useState(true);            // Controla el estado de carga
  const [errorCarga, setErrorCarga] = useState(null);        // Maneja errores de la petición

  // Lógica de obtención de datos con useEffect
  useEffect(() => {
    const obtenerCompras = async () => { // Método renombrado a español
      try {
        const respuesta = await fetch('http://localhost:3000/api/compras');
        if (!respuesta.ok) {
          throw new Error('Error al cargar los Compras');
        }
        const datos = await respuesta.json();
        setListaCompras(datos);    // Actualiza el estado con los datos
        setCargando(false);           // Indica que la carga terminó
      } catch (error) {
        setErrorCarga(error.message); // Guarda el mensaje de error
        setCargando(false);           // Termina la carga aunque haya error
      }
    };
    obtenerCompras();            // Ejecuta la función al montar el componente
  }, []);                           // Array vacío para que solo se ejecute una vez

  // Renderizado de la vista
  return (
    <>
      <Container className="mt-5">
        <br />
        <h4>Compras</h4>

        {/* Pasa los estados como props al componente TablaClientes */}
        <TablaCompras 
          compras={listaCompras} 
          cargando={cargando} 
          error={errorCarga} 
        />
      </Container>
    </>
  );
};

// Exportación del componente
export default Compras;