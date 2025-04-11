  // Importaciones necesarias para el componente visual
  import React from 'react';
  import { Table } from 'react-bootstrap';
  import 'bootstrap/dist/css/bootstrap.min.css';
  import Paginacion from '../ordenamiento/Paginacion'; // Importamos el componente de paginación

  // Declaración del componente TablaClientes que recibe props
  const TablaProveedor = ({ 
  proveedores,
  cargando, 
  error,
  totalElementos,           // Nuevo prop para el total de elementos
  elementosPorPagina,      // Nuevo prop para elementos por página
  paginaActual,           // Nuevo prop para la página actual
  establecerPaginaActual  }) => {
    // Renderizado condicional según el estado recibido por props
    if (cargando) {
      return <div>Cargando Proveedor...</div>; // Muestra mensaje mientras carga
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
  export default TablaProveedor;