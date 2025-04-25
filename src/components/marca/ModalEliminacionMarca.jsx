import React from "react";
import { Modal, Button } from "react-bootstrap";

const ModalEliminacionMarca = ({
  mostrarModalEliminacion,
  setMostrarModalEliminacion,
  eliminarMarca,
}) => {
  return (
    <Modal show={mostrarModalEliminacion} onHide={() => setMostrarModalEliminacion(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmar Eliminación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        ¿Estás seguro de que deseas eliminar esta marca?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModalEliminacion(false)}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={eliminarMarca}>
          Eliminar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEliminacionMarca;