import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import VentasPorMes from '../components/graficos/VentasPOrMes';

const Estadisticas = () => {
  // State variables for chart data
  const [meses, setMeses ] = useState([]);
  const [totalesporMes, setTotalesPorMes] = useState([]);



const cargaVentasPorMes = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/totalventaspormes');
        const data = await response.json();
        setMeses(data.map(item => item.Mes)); // e.g., ['Enero', 'Febrero', ...]
        setTotalesPorMes(data.map(item => item.total_ventas)); // e.g., [1000, 2000, ...]
      } catch (error) {
        console.error('Error al cargar ventas:', error);
        alert('Error al cargar ventas: ' + error.message);
      }
    };


  
  // Fetch data on component mount
  useEffect(() => {
    cargaVentasPorMes();
  }, []); // Empty dependency array to run once on mount

  return (
    <Container className="mt-5">
      <br />
      <h4>Estadísticas</h4>
      <Row className="mt-4">
        <Col xs={12} sm={12} md={12} lg={6} className="mb-5">
          <VentasPorMes meses ={meses} totales_por_mes={totalesporMes} />
        </Col>
      </Row>
    </Container>
  );
};

export default Estadisticas;


