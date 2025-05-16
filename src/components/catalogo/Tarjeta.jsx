import React from "react";
import { Col, Card, Badge, Stack } from 'react-bootstrap';

const Tarjeta = ({ indice, nombre_, modelo, precio_venta, stock, id_marca, imagen }) => {
  return (
    <Col lg={3} className="mt-3">
      <Card border="">
        <Card.Img
          variant="top"
          src={imagen ? `data:image/png;base64,${imagen}` : undefined}
          alt={nombre_}
        />
        <Card.Body>
          <Card.Title>
            <strong>{nombre_}</strong>
          </Card.Title>
          <Card.Text>{modelo || 'Sin modelo'}</Card.Text>
          <Stack direction="vertical" gap={2}>
            <Badge pill bg="primary">
              <i className="bi-currency-dollar"></i> Venta: {precio_venta?.toFixed(2)}
            </Badge>
            <Badge pill bg="secondary">
              <i className="bi-box"></i> Stock: {stock}
            </Badge>
            <Badge pill bg="info">
              <i className="bi-tag"></i> Marca: {id_marca}
            </Badge>
          </Stack>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default Tarjeta;
