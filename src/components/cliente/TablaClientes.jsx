import React from 'react';
import Paginacion from '../ordenamiento/Paginacion';
import { Table, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const TablaClientes = ({
  clientes,
  cargando,
  error,
  totalElementos,
  elementosPorPagina,
  paginaActual,
  establecerPaginaActual,
  abrirModalEliminacion,
  abrirModalEdicion,
  generarPDFDetalleCliente

}) => {
  if (cargando) {
    return <div>Cargando clientes...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID Cliente</th>
            <th>Cédula</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Teléfono</th>
            <th>Acciones</th>
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
              <td>
               

               <Button
                  size="sm"
                variant="outline-secondary"
                className="me-2"
                onClick={() => generarPDFDetalleCliente(cliente)}
                  >
                  <i className="bi bi-filetype-pdf"></i>
                  </Button>

                <Button
                  variant="outline-danger"
                  size="sm"
                  className="me-2"
                  onClick={() => abrirModalEliminacion(cliente)}
                >
                  <i className="bi bi-trash"></i>
                </Button>
                <Button
                  variant="outline-warning"
                  size="sm"
                  onClick={() => abrirModalEdicion(cliente)}
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

export default TablaClientes;