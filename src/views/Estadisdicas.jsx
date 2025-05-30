import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import VentasPorMes from '../components/graficos/VentasPOrMes';
import VentasPorDias from '../components/graficos/VentasPorDias';
import VentasPorAño from '../components/graficos/VentaPorAno';
import VentasPorMarca from '../components/graficos/VentasPorMarca';
import VentasStockPorMarca from '../components/graficos/StockPorMarca';
import ChatIA from '../components/ChatIA/ChatIA';

const Estadisticas = () => {
  // State variables for chart data
  const [meses, setMeses ] = useState([]);
  const [totalesporMes, setTotalesPorMes] = useState([]);

 const [dias, setDia] = useState([]);
  const [totalesPorDia, setTotalesPorDia] = useState([]);

  const [ayos, setAyo] = useState([]);
  const [totalesPorAyo, setTotalesPorAyo] = useState([]);

  const [marcas, setMarca] = useState([]);
  const [totalesPorMarca, setTotalesPorMarca] = useState([]);
  const [cantidadadVendidad, setCantidadadVendidad] = useState([]);

  const [marcasStock, setMarcaStock] = useState([]);
  const [totalesPorMarcaStock, setTotalesPorMarcaStock ] = useState([]);

  const [mostrarChatModal, setMostrarChatModal] = useState(false); // Estado para el modal


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


/**
 * Fetches and updates the state with daily sales data from the API.
 * This function makes an asynchronous request to the endpoint 
 * 'http://localhost:3000/api/totalventaspordia' to retrieve the
 * total sales per day. The response is parsed and used to update 
 * the state variables 'dias' and 'totalesPorDia' with the respective 
 * day names and total sales amounts. If an error occurs during the 
 * fetch operation, an error message is logged to the console and 
 * an alert is displayed to the user.
 */

    const cargaVentasPorDia = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/totalventaspordia');
        const data = await response.json();
        setDia(data.map(item => item.dia)); // e.g., ['Enero', 'Febrero', ...]
        setTotalesPorDia(data.map(item => item.total_ventas)); // e.g., [1000, 2000, ...]
      } catch (error) {
        console.error('Error al cargar ventas:', error);
        alert('Error al cargar ventas: ' + error.message);
      }
    };

     const cargaVentasPorAno = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/totalventasporano');
        const data = await response.json();
        setAyo(data.map(item => item.Ayo)); // e.g., ['Enero', 'Febrero', ...]
        setTotalesPorAyo(data.map(item => item.total_ventas)); // e.g., [1000, 2000, ...]
      } catch (error) {
        console.error('Error al cargar ventas:', error);
        alert('Error al cargar ventas: ' + error.message);
      }
    };

      const cargaVentasPorMarca = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/totalventaspormarca');
      const data = await response.json();

      setMarca(data.map(item => item.Marca)); // e.g., ['Yamaha', 'Honda', 'Bajaj']
      setTotalesPorMarca(data.map(item => item.total_ventas)); // e.g., [3500, 2800, 1900]
      setCantidadadVendidad(data.map(item => item.cantidad_vendida));

      
    } catch (error) {
      console.error('Error al cargar ventas por marca:', error);
      alert('Error al cargar ventas por marca: ' + error.message);
    }
  };

   const cargaStockporMarca = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/stockpormarca');
      const data = await response.json();

      setMarcaStock(data.map(item => item.Marca)); // e.g., ['Yamaha', 'Honda', 'Bajaj']
      setTotalesPorMarcaStock(data.map(item => item.stock_total)); // e.g., [3500, 2800, 1900]
      
    } catch (error) {
      console.error('Error al cargar ventas por marca:', error);
      alert('Error al cargar ventas por marca: ' + error.message);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    cargaVentasPorMes();
    cargaVentasPorDia();
    cargaVentasPorAno();
    cargaVentasPorMarca()
    cargaStockporMarca()
  }, []); // Empty dependency array to run once on mount

  return (
    <Container className="mt-5">
      <br />
      <h4>Estadísticas</h4>
      
        <Button 
            variant="primary" 
            className="mb-4"
            onClick={() => setMostrarChatModal(true)}
            >
            Consultar con IA
              </Button>

      <Row className="mt-4">
        <Col xs={12} sm={12} md={12} lg={6} className="mb-5">
          <VentasPorMes meses ={meses} totales_por_mes={totalesporMes} />
        </Col>

        <Col xs={12} sm={12} md={12} lg={6} className="mb-5">
          <VentasPorDias dias  ={dias} totales_por_dias={totalesPorDia} />
        </Col>

        <Col xs={12} sm={12} md={12} lg={6} className="mb-5">
          < VentasPorAño ano={ayos} totales_por_ano={totalesPorAyo} />
        </Col>

        <Col xs={12} sm={12} md={12} lg={6} className="mb-5">
          < VentasPorMarca marca={marcas} totales_por_marca={totalesPorMarca} cantidadadvendidad={cantidadadVendidad} />
        </Col>

        <Col xs={12} sm={12} md={12} lg={6} className="mb-5">
          < VentasStockPorMarca marcasStock={marcasStock} stockPorMarca={totalesPorMarcaStock} />
        </Col>

         <Col xs={12} sm={12} md={12} lg={6} className="mb-5">
          <ChatIA />
        </Col>    

      </Row>
      <ChatIA mostrarChatModal={mostrarChatModal} setMostrarChatModal={setMostrarChatModal} />
    </Container>
  );
};

export default Estadisticas;