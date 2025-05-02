import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalEdicionProveedor = ({
  mostrarModalEdicion,
  setMostrarModalEdicion,
  proveedorEditado,
  manejarCambioInputEdicion,
  actualizarProveedor,
  errorCarga,
}) => {
  return (
    <Modal show={mostrarModalEdicion} onHide={() => setMostrarModalEdicion(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Proveedor</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formNombreProveedor">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre_proveedor"
              value={proveedorEditado?.nombre_proveedor || ""}
              onChange={manejarCambioInputEdicion}
              placeholder="Ingresa el nombre (máx. 50 caracteres)"
              maxLength={50}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formTelefono">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              type="text"
              name="telefono"
              value={proveedorEditado?.telefono || ""}
              onChange={manejarCambioInputEdicion}
              placeholder="Ingresa el teléfono (máx. 15 caracteres)"
              maxLength={15}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formEmpresa">
            <Form.Label>Empresa</Form.Label>
            <Form.Control
              type="text"
              name="empresa"
              value={proveedorEditado?.empresa || ""}
              onChange={manejarCambioInputEdicion}
              placeholder="Ingresa la empresa (máx. 100 caracteres)"
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
        <Button variant="secondary" onClick={() => setMostrarModalEdicion(false)}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={actualizarProveedor}>
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionProveedor;