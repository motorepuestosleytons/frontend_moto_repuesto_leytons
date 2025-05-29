import React from 'react';
import { Table, Button } from 'react-bootstrap';
import Paginacion from '../ordenamiento/Paginacion';
import 'bootstrap/dist/css/bootstrap.min.css';

const TablaProductos = ({
  productos,
  cargando,
  error,
  totalElementos,
  elementosPorPagina,
  paginaActual,
  establecerPaginaActual,
  abrirModalEliminacion,
  abrirModalEdicion,
  generarPDFDetalleProducto
}) => {
  if (cargando) {
    return <div>Cargando Producto...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

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
             <th>imagen</th>
            <th>Acciones</th>
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
               <td>{producto.imagen ? (
    <img
      src={`data:image/png;base64,${producto.imagen}`}
                  alt={producto.nombre_producto}
                  style={{ maxWidth: '100px' }}
                />
              ) : (
                'Sin imagen'
              )}
            </td>
              <td>

        <Button
        size="sm"
        variant="outline-secondary"
        className="me-2"
        onClick={() => generarPDFDetalleProducto(producto)}
         >
        <i className="bi bi-filetype-pdf"></i>
      </Button>
                
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="me-2"
                  onClick={() => abrirModalEliminacion(producto)}
                >
                  <i className="bi bi-trash"></i>
                </Button>
                <Button
                  variant="outline-warning"
                  size="sm"
                  onClick={() => abrirModalEdicion(producto)}
                >
                  <i className="bi bi-pencil"></i>
                </Button>
              </td>
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

export default TablaProductos;