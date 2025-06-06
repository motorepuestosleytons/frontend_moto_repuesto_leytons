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
      nuevaMarca.marca.trim() !== "" 
    );

  };
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
              onKeyDown={validarLetras}
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
        <Button variant="primary" onClick={agregarMarca}
          disabled={!validacionFormulario()}>
          Guardar Marca
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroMarca;