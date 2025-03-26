// Importaciones necesarias para el componente visual
import React from 'react';
import { Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// Declaración del componente TablaClientes que recibe props
const TablaProveedor = ({ proveedores, cargando, error }) => {
  // Renderizado condicional según el estado recibido por props
  if (cargando) {
    return <div>Cargando Proveedor...</div>; // Muestra mensaje mientras carga
  }
  if (error) {
    return <div>Error: {error}</div>;         // Muestra error si ocurre
  }

  // Renderizado de la tabla con los datos recibidos
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>id_prov</th>
          <th>nombre_proveedor</th>
          <th>telefono</th>
          <th>empresa</th>
          
       

        </tr>
      </thead>
      <tbody>
        {proveedores.map((proveedor) => (
          <tr key={proveedor.id_prov}>
            <td>{proveedor.id_prov}</td>
             <td>{proveedor.nombre_proveedor}</td>
            <td>{proveedor.telefono}</td>
            <td>{proveedor.empresa}</td>
          
            
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

// Exportación del componente
export default TablaProveedor;