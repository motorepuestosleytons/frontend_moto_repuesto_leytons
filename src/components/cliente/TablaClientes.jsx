// Importaciones necesarias para el componente visual
import React from 'react';
import { Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// Declaración del componente TablaClientes que recibe props
const TablaClientes = ({ clientes, cargando, error }) => {
  // Renderizado condicional según el estado recibido por props
  if (cargando) {
    return <div>Cargando clientes...</div>; // Muestra mensaje mientras carga
  }
  if (error) {
    return <div>Error: {error}</div>;         // Muestra error si ocurre
  }

  // Renderizado de la tabla con los datos recibidos
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>id_cliente</th>
          <th>cedula</th>
          <th>nombre_cliente</th>
          <th>apellido</th>
          <th>telefono</th>
       

        </tr>
      </thead>
      <tbody>
        {clientes.map((cliente) => (
          <tr key={cliente.id_cliente}>
             <td>{cliente.id_cliente}</td>
            <td>{cliente.cedula}</td>
            <td>{cliente.nombre_cliente}</td>
            <td>{cliente.apellido}</td>
            <td>{cliente.telefono}</td>
            
            
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

// Exportación del componente
export default TablaClientes;