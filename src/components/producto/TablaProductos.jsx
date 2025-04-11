// Importaciones necesarias para el componente visual
import React from 'react';
import Paginacion from '../ordenamiento/Paginacion'; // Importamos el componente de paginación
import { Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// Declaración del componente TablaProductos que recibe props
const TablaProductos = ({
  productos,
  cargando,
  error,
  totalElementos,           // Prop para el total de elementos
  elementosPorPagina,      // Prop para elementos por página
  paginaActual,           // Prop para la página actual
  establecerPaginaActual  // Prop para actualizar la página
}) => {
  // Renderizado condicional según el estado recibido por props
  if (cargando) {
    return <div>Cargando Producto...</div>; // Muestra mensaje mientras carga
  }
  if (error) {
    return <div>Error: {error}</div>;         // Muestra error si ocurre
  }

  // Renderizado de la tabla con los datos recibidos
  return (
    <>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>id_producto</th>
            <th>nombre_</th>
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
      <Paginacion
        elementosPorPagina={elementosPorPagina}
        totalElementos={totalElementos}
        paginaActual={paginaActual}
        establecerPaginaActual={establecerPaginaActual}
      />
    </>
  );
};

// Exportación del componente
export default TablaProductos;