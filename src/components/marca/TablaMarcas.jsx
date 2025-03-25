// Importaciones necesarias para el componente visual
import React from 'react';
import { Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// Declaración del componente TablaMarcas que recibe props
const TablaMarcas = ({ marcas, cargando, error }) => {
  // Renderizado condicional según el estado recibido por props
  if (cargando) {
    return <div>Cargando marcas...</div>; // Muestra mensaje mientras carga
  }
  if (error) {
    return <div>Error: {error}</div>;         // Muestra error si ocurre
  }

  // Renderizado de la tabla con los datos recibidos
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>id_marca</th>
          <th>marca</th>
        

        </tr>
      </thead>
      <tbody>
        {marcas.map((marca) => (
          <tr key={marca.id_marca}>
             <td>{marca.id_marca}</td>
            <td>{marca.marca}</td>
           
            
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

// Exportación del componente
export default TablaMarcas;