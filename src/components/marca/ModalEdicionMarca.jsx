import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalEdicionMarca = ({
  mostrarModalEdicion,
  setMostrarModalEdicion,
  marcaEditada,
  manejarCambioInputEdicion,
  actualizarMarca,
  errorCarga,
}) => {
  return (
    <Modal show={mostrarModalEdicion} onHide={() => setMostrarModalEdicion(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Marca</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formMarca">
            <Form.Label>Marca</Form.Label>
            <Form.Control
              type="text"
              name="marca"
              value={marcaEditada?.marca || ""}
              onChange={manejarCambioInputEdicion}
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
        <Button variant="secondary" onClick={() => setMostrarModalEdicion(false)}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={actualizarMarca}>
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionMarca;