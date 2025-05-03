import React, { useState } from 'react';
import { Table, Button, Collapse } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const TablaVentas = ({ ventas, cargando, error, obtenerDetalles, abrirModalEliminacion }) => {
  const [detalles, setDetalles] = useState({});
  const [detallesCargando, setDetallesCargando] = useState(false);
  const [detallesError, setDetallesError] = useState(null);

  // Función para manejar la obtención de detalles
  const manejarObtenerDetalles = async (id_venta) => {
    setDetallesCargando(true);
    setDetallesError(null);
    try {
      const datosDetalles = await obtenerDetalles(id_venta); // Suponiendo que devuelve un array de detalles
      setDetalles((prev) => ({ ...prev, [id_venta]: datosDetalles }));
    } catch (err) {
      setDetallesError('Error al cargar los detalles');
    } finally {
      setDetallesCargando(false);
    }
  };

  if (cargando) {
    return <div>Cargando ventas...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>ID Venta</th>
          <th>Fecha Venta</th>
          <th>Cliente</th>
          <th>Total</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {ventas.map((venta) => (
          <React.Fragment key={venta.id_venta}>
            <tr>
              <td>{venta.id_venta}</td>
              <td>{venta.fecha_venta}</td>
              <td>{venta.nombre_cliente}</td>
              <td>C$ {venta.total_venta.toFixed(2)}</td>
              <td>
                <Button
                  variant="outline-success"
                  size="sm"
                  className="me-2"
                  onClick={() => manejarObtenerDetalles(venta.id_venta)}
                >
                  <i className="bi bi-list-ul"></i>
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => abrirModalEliminacion(venta)}
                >
                  <i className="bi bi-trash"></i>
                </Button>
              </td>
            </tr>
            {/* Subtabla para detalles de la venta */}
            {detalles[venta.id_venta] && (
              <tr>
                <td colSpan="6">
                  <Collapse in={!!detalles[venta.id_venta]}>
                    <div>
                      {detallesCargando && <div>Cargando detalles...</div>}
                      {detallesError && <div>{detallesError}</div>}
                      {!detallesCargando && !detallesError && detalles[venta.id_venta].length > 0 ? (
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
                            {detalles[venta.id_venta].map((detalle) => (
                              <tr key={detalle.id_detalle_venta}>
                                <td>{detalle.id_detalle_venta}</td>
                                <td>{detalle.id_producto}</td>
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

export default TablaVentas;