import React from "react";
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Proposito = () => {
  return (
    <Container className="mt-4">
      <Row className="align-items-center mb-4">

        {/* Objetivos */}
        <Col sm={12} lg={4} className="text-center">
          <i className="bi bi-bullseye" style={{ fontSize: "2rem", color: "#dc3545" }}></i>
          <h5>Objetivos</h5>
          <p>Promover en Moto Repuestos Leyton el uso de repuestos y accesorios de calidad para motocicletas, facilitar el acceso a productos mediante una plataforma digital, y optimizar la gestión del inventario y atención al cliente a través de herramientas tecnológicas modernas.</p>
        </Col>

        {/* Misión */}
        <Col sm={12} lg={4} className="text-center">
          <i className="bi bi-flag-fill" style={{ fontSize: "2rem", color: "#0d6efd" }}></i>
          <h5>Misión</h5>
          <p>Ofrecer en Moto Repuestos Leyton soluciones confiables en repuestos para motocicletas, integrando una página web que agilice la búsqueda, compra y asesoría técnica, garantizando satisfacción, rapidez y confianza a nuestros clientes.</p>
        </Col>

        {/* Visión */}
        <Col sm={12} lg={4} className="text-center">
          <i className="bi bi-eye-fill" style={{ fontSize: "2rem", color: "#198754" }}></i>
          <h5>Visión</h5>
          <p>Ser en Moto Repuestos Leyton un referente digital en la venta de repuestos para motos en la región, destacándonos por nuestra atención personalizada, variedad de productos y plataforma web eficiente, innovadora y orientada al cliente.</p>
        </Col>

      </Row>
    </Container>
  );
};

export default Proposito;