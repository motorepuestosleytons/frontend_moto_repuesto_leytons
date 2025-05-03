import React, { useState } from 'react';
import { Table, Button, Collapse } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const TablaCompras = ({ compras, cargando, error, obtenerDetalles, abrirModalEliminacion }) => {
  const [detalles, setDetalles] = useState({});
  const [detallesCargando, setDetallesCargando] = useState(false);
  const [detallesError, setDetallesError] = useState(null);

  // Función para manejar la obtención de detalles
  const manejarObtenerDetalles = async (id_compra) => {
    setDetallesCargando(true);
    setDetallesError(null);
    try {
      const datosDetalles = await obtenerDetalles(id_compra); // Suponiendo que devuelve un array de detalles
      setDetalles((prev) => ({ ...prev, [id_compra]: datosDetalles }));
    } catch (err) {
      setDetallesError('Error al cargar los detalles');
    } finally {
      setDetallesCargando(false);
    }
  };

  if (cargando) {
    return <div>Cargando compras...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>ID Compra</th>
          <th>Fecha Compra</th>
          <th>Proveedor</th>
          <th>Total</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {compras.map((compra) => (
          <React.Fragment key={compra.id_compra}>
            <tr>
              <td>{compra.id_compra}</td>
              <td>{compra.fecha_compra}</td>
              <td>{compra.nombre_proveedor}</td>
              <td>C$ {compra.total_compra.toFixed(2)}</td>
              <td>
                <Button
                  variant="outline-success"
                  size="sm"
                  className="me-2"
                  onClick={() => manejarObtenerDetalles(compra.id_compra)}
                >
                  <i className="bi bi-list-ul"></i>
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => abrirModalEliminacion(compra)}
                >
                  <i className="bi bi-trash"></i>
                </Button>
              </td>
            </tr>
            {/* Subtabla para detalles de la compra */}
            {detalles[compra.id_compra] && (
              <tr>
                <td colSpan="5">
                  <Collapse in={!!detalles[compra.id_compra]}>
                    <div>
                      {detallesCargando && <div>Cargando detalles...</div>}
                      {detallesError && <div>{detallesError}</div>}
                      {!detallesCargando && !detallesError && detalles[compra.id_compra].length > 0 ? (
                        <Table striped bordered hover size="sm">
                          <thead>
                            <tr>
                              <th>ID Detalle</th>
                              <th>Producto</th>
                              <th>Cantidad</th>
                              <th>Precio Unitario</th>
                              <th>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {detalles[compra.id_compra].map((detalle) => (
                              <tr key={detalle.id_detalle_compra}>
                                <td>{detalle.id_detalle_compra}</td>
                                <td>{detalle.nombre_producto}</td>
                                <td>{detalle.cantidad}</td>
                                <td>C$ {detalle.precio_unitario.toFixed(2)}</td>
                                <td>C$ {detalle.total.toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      ) : (
                        !detallesCargando && <div>No hay detalles disponibles</div>
                      )}
                    </div>
                  </Collapse>
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </Table>
  );
};

export default TablaCompras;