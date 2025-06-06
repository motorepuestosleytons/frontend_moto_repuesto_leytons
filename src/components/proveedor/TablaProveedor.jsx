import React from 'react';
import Paginacion from '../ordenamiento/Paginacion';
import { Table, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const TablaProveedor = ({
  proveedores,
  cargando,
  error,
  totalElementos,
  elementosPorPagina,
  paginaActual,
  establecerPaginaActual,
  abrirModalEliminacion,
  abrirModalEdicion,
  generarPDFDetalleProveedor
}) => {
  if (cargando) {
    return <div>Cargando proveedores...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID Proveedor</th>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Empresa</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {proveedores.map((proveedor) => (
            <tr key={proveedor.id_prov}>
              <td>{proveedor.id_prov}</td>
              <td>{proveedor.nombre_proveedor}</td>
              <td>{proveedor.telefono}</td>
              <td>{proveedor.empresa}</td>
              <td>

            <Button
                size="sm"
                variant="outline-secondary"
                className="me-2"
                onClick={() => generarPDFDetalleProveedor(proveedor)}
                >
                <i className="bi bi-filetype-pdf"></i>
              </Button>

                <Button
                  variant="outline-danger"
                  size="sm"
                  className="me-2"
                  onClick={() => abrirModalEliminacion(proveedor)}
                >
                  <i className="bi bi-trash"></i>
                </Button>
                <Button
                  variant="outline-warning"
                  size="sm"
                  onClick={() => abrirModalEdicion(proveedor)}
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

export default TablaProveedor;