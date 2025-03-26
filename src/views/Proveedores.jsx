// Importaciones necesarias para la vista
import React, { useState, useEffect } from 'react';
import { Container } from "react-bootstrap";
import TablaProveedor from '../components/proveedor/TablaProveedor';

// Declaración del componente Clientes
const proveedores= () => {
  // Estados para manejar los datos, carga y errores
  const [listaProveedores, setListaProveedores] = useState([]); // Almacena los datos de la API
  const [cargando, setCargando] = useState(true);            // Controla el estado de carga
  const [errorCarga, setErrorCarga] = useState(null);        // Maneja errores de la petición

  // Lógica de obtención de datos con useEffect
  useEffect(() => {
    const obtenerProveedores = async () => { // Método renombrado a español
      try {
        const respuesta = await fetch('http://localhost:3000/api/proveedores');
        if (!respuesta.ok) {
          throw new Error('Error al cargar los Proveedor');
        }
        const datos = await respuesta.json();
        setListaProveedores(datos);    // Actualiza el estado con los datos
        setCargando(false);           // Indica que la carga terminó
      } catch (error) {
        setErrorCarga(error.message); // Guarda el mensaje de error
        setCargando(false);           // Termina la carga aunque haya error
      }
    };
    obtenerProveedores();            // Ejecuta la función al montar el componente
  }, []);                           // Array vacío para que solo se ejecute una vez

  // Renderizado de la vista
  return (
    <>
      <Container className="mt-5">
        <br />
        <h4>proveedor</h4>

        {/* Pasa los estados como props al componente TablaClientes */}
        <TablaProveedor 
          proveedores={listaProveedores} 
          cargando={cargando} 
          error={errorCarga} 
        />
      </Container>
    </>
  );
};

// Exportación del componente
export default proveedores;