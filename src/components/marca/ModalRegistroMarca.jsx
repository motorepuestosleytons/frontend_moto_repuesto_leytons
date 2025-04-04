import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalRegistroMarca = ({
  mostrarModal,
  setMostrarModal,
  nuevaMarca,
  manejarCambioInput,
  agregarMarca,
  errorCarga
}) => {
  return (
    <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Nueva Marca</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formNombreMarca">
            <Form.Label>Nombre de la Marca</Form.Label>
            <Form.Control
              type="text"
              name="marca"
              value={nuevaMarca.marca}
              onChange={manejarCambioInput}
              placeholder="Ingresa el nombre de la marca (máx. 30 caracteres)"
              maxLength={30}
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
        <Button variant="primary" onClick={agregarMarca}>
          Guardar Marca
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroMarca;