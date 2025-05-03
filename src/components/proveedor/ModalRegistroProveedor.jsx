import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalRegistroProveedor = ({
  mostrarModal,
  setMostrarModal,
  nuevoProveedor,
  manejarCambioInput,
  agregarProveedor,
  errorCarga
}) => {
  return (
    <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Nuevo Proveedor</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formNombreProveedor">
            <Form.Label>Nombre del Proveedor</Form.Label>
            <Form.Control
              type="text"
              name="nombre_proveedor"
              value={nuevoProveedor.nombre_proveedor}
              onChange={manejarCambioInput}
              placeholder="Ingresa el nombre del proveedor (máx. 50 caracteres)"
              maxLength={50}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formTelefono">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              type="tel"
              name="telefono"
              value={nuevoProveedor.telefono}
              onChange={manejarCambioInput}
              placeholder="Ingresa el teléfono (máx. 9 caracteres)"
              maxLength={9}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formEmpresa">
            <Form.Label>Empresa</Form.Label>
            <Form.Control
              type="text"
              name="empresa"
              value={nuevoProveedor.empresa}
              onChange={manejarCambioInput}
              placeholder="Ingresa el nombre de la empresa (máx. 100 caracteres)"
              maxLength={100}
              required
            />
          </Form.Group>

          {errorCarga && (
            <div className="text-danger mt-2">{errorCarga}</div>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={agregarProveedor}>
          Guardar Proveedor
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroProveedor;