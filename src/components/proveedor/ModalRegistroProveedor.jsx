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

  
  const validarLetras = (e) => {
    const charCode = e.which || e.keyCode;
    if (
      !(charCode >= 65 && charCode <= 90) && // Uppercase letters
      !(charCode >= 97 && charCode <= 122) && // Lowercase letters
      charCode !== 8 && // Backspace
      charCode !== 46 && // Delete
      charCode !== 9 // Tab
    ) {
      e.preventDefault();
    }
  };

  // Validation for numbers only (celular and cedula)
  const validarNumeros = (e) => {
    const charCode = e.which || e.keyCode;
    if (
      !(charCode >= 48 && charCode <= 57) && // Numbers 0-9
      charCode !== 8 && // Backspace
      charCode !== 46 && // Delete
      charCode !== 9 // Tab
    ) {
      e.preventDefault();
    }
  };

  // Form validation to enable/disable submit button
  const validacionFormulario = () => {
    return (
      nuevoProveedor.nombre_proveedor.trim() !== "" &&
      nuevoProveedor.telefono.trim() !== "" &&
      nuevoProveedor.empresa.trim() !== ""
    );
  };
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
              onKeyDown={validarLetras}
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
              onKeyDown={validarNumeros}
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
              onKeyDown={validarLetras}
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
        <Button variant="primary" onClick={agregarProveedor}
          disabled={!validacionFormulario()}>
          Guardar Proveedor
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroProveedor;