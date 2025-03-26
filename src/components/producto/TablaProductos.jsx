// Importaciones necesarias para el componente visual
import React from 'react';
import { Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// Declaración del componente TablaClientes que recibe props
const TablaProductos = ({ productos, cargando, error }) => {
  // Renderizado condicional según el estado recibido por props
  if (cargando) {
    return <div>Cargando Producto...</div>; // Muestra mensaje mientras carga
  }
  if (error) {
    return <div>Error: {error}</div>;         // Muestra error si ocurre
  }

  // Renderizado de la tabla con los datos recibidos
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>id_producto</th>
          <th>nombre</th>
          <th>modelo</th>
          <th>precio_venta</th>
          <th>precio_compra</th>
          <th>stock</th>
          <th>id_marca</th>
       

        </tr>
      </thead>
      <tbody>
        {productos.map((producto) => (
          <tr key={producto.id_producto}>
            <td>{producto.id_producto}</td>
             <td>{producto.nombre_}</td>
            <td>{producto.modelo}</td>
            <td>{producto.precio_venta}</td>
            <td>{producto.precio_compra}</td>
            <td>{producto.stock}</td>
            <td>{producto.id_marca}</td>
            
            
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

// Exportación del componente
export default TablaProductos;