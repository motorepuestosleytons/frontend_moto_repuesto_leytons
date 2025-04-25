import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalEdicionCliente = ({
  mostrarModalEdicion,
  setMostrarModalEdicion,
  clienteEditado,
  manejarCambioInputEdicion,
  actualizarCliente,
  errorCarga,
}) => {
  return (
    <Modal show={mostrarModalEdicion} onHide={() => setMostrarModalEdicion(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Cliente</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formCedula">
            <Form.Label>Cédula</Form.Label>
            <Form.Control
              type="text"
              name="cedula"
              value={clienteEditado?.cedula || ""}
              onChange={manejarCambioInputEdicion}
              placeholder="Ingresa la cédula (máx. 16 caracteres)"
              maxLength={16}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formNombreCliente">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre_cliente"
              value={clienteEditado?.nombre_cliente || ""}
              onChange={manejarCambioInputEdicion}
              placeholder="Ingresa el nombre (máx. 30 caracteres)"
              maxLength={30}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formApellido">
            <Form.Label>Apellido</Form.Label>
            <Form.Control
              type="text"
              name="apellido"
              value={clienteEditado?.apellido || ""}
              onChange={manejarCambioInputEdicion}
              placeholder="Ingresa el apellido (máx. 20 caracteres)"
              maxLength={20}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formTelefono">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              type="text"
              name="telefono"
              value={clienteEditado?.telefono || ""}
              onChange={manejarCambioInputEdicion}
              placeholder="Ingresa el teléfono (máx. 15 caracteres)"
              maxLength={15}
              required
            />
          </Form.Group>
          {errorCarga && (
            <div className="text-danger mt-2">{errorCarga}</div>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModalEdicion(false)}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={actualizarCliente}>
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionCliente;