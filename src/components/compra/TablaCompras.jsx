// Importaciones necesarias para el componente visual
import React from 'react';
import { Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// Declaración del componente TablaMarcas que recibe props
const TablaCompras = ({ compras, cargando, error }) => {
  // Renderizado condicional según el estado recibido por props
  if (cargando) {
    return <div>Cargando compras...</div>; // Muestra mensaje mientras carga
  }
  if (error) {
    return <div>Error: {error}</div>;         // Muestra error si ocurre
  }

  // Renderizado de la tabla con los datos recibidos
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>id_compra</th>
          <th>fecha_compra</th>
          <th>id_proveedor</th>
        

        </tr>
      </thead>
      <tbody>
        {compras.map((compra) => (
          <tr key={compra.id_compra}>
             <td>{compra.id_compra}</td>
            <td>{compra.fecha_compra}</td>
            <td>{compra.id_proveedor}</td>
           
            
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

// Exportación del componente
export default TablaCompras;