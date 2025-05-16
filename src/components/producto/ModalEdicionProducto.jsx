import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalEdicionProducto = ({
  mostrarModalEdicion,
  setMostrarModalEdicion,
  productoEditado,
  manejarCambioInputEdicion,
  actualizarProducto,
  errorCarga,
  marcas, // Lista de marcas para el select
}) => {
  return (
    <Modal show={mostrarModalEdicion} onHide={() => setMostrarModalEdicion(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Producto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formNombre">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre_"
              value={productoEditado?.nombre_ || ""}
              onChange={manejarCambioInputEdicion}
              placeholder="Ingresa el nombre del producto (máx. 50 caracteres)"
              maxLength={50}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formModelo">
            <Form.Label>Modelo</Form.Label>
            <Form.Control
              type="text"
              name="modelo"
              value={productoEditado?.modelo || ""}
              onChange={manejarCambioInputEdicion}
              placeholder="Ingresa el modelo (máx. 40 caracteres)"
              maxLength={40}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPrecioVenta">
            <Form.Label>Precio de Venta</Form.Label>
            <Form.Control
              type="number"
              name="precio_venta"
              value={productoEditado?.precio_venta || ""}
              onChange={manejarCambioInputEdicion}
              placeholder="Ingresa el precio de venta"
              step="0.01"
              min="0"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPrecioCompra">
            <Form.Label>Precio de Compra</Form.Label>
            <Form.Control
              type="number"
              name="precio_compra"
              value={productoEditado?.precio_compra || ""}
              onChange={manejarCambioInputEdicion}
              placeholder="Ingresa el precio de compra"
              step="0.01"
              min="0"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formStock">
            <Form.Label>Stock</Form.Label>
            <Form.Control
              type="number"
              name="stock"
              value={productoEditado?.stock || ""}
              onChange={manejarCambioInputEdicion}
              placeholder="Ingresa el stock"
              min="0"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formMarca">
            <Form.Label>Marca</Form.Label>
            <Form.Select
              name="id_marca"
              value={productoEditado?.id_marca || ""}
              onChange={manejarCambioInputEdicion}
              required
            >
              <option value="">Selecciona una marca</option>
              {marcas?.map((marca) => (
                <option key={marca.id_marca} value={marca.id_marca}>
                  {marca.marca}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formImagenProducto">
            <Form.Label>Imagen</Form.Label>
            {productoEditado?.imagen && (
              <div>
                <img
                  src={`data:image/png;base64,${productoEditado.imagen}`}
                  alt="Imagen actual"
                  style={{ maxWidth: '100px', marginBottom: '10px' }}
                />
              </div>
            )}
            <Form.Control
              type="file"
              name="imagen"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    manejarCambioInputEdicion({
                      target: { name: 'imagen', value: reader.result.split(',')[1] }
                    });
                  };
                  reader.readAsDataURL(file);
                }
              }}
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
        <Button variant="primary" onClick={actualizarProducto}>
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionProducto;