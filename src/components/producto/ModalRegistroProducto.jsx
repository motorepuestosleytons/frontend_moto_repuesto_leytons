import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalRegistroProducto = ({
  mostrarModal,
  setMostrarModal,
  nuevoProducto,
  manejarCambioInput,
  agregarProducto,
  errorCarga,
  marcas
}) => {
  const [errores, setErrores] = useState({});

  const validarFormulario = () => {
    const nuevosErrores = {};

    // Validar nombre_
    if (!nuevoProducto.nombre_) {
      nuevosErrores.nombre_ = "El nombre del producto es requerido.";
    } else if (typeof nuevoProducto.nombre_ !== "string" || nuevoProducto.nombre_.length > 50) {
      nuevosErrores.nombre_ = "El nombre debe ser una cadena de texto de máximo 50 caracteres.";
    }

    // Validar modelo
    if (!nuevoProducto.modelo) {
      nuevosErrores.modelo = "El modelo es requerido.";
    } else if (typeof nuevoProducto.modelo !== "string" || nuevoProducto.modelo.length > 40) {
      nuevosErrores.modelo = "El modelo debe ser una cadena de texto de máximo 40 caracteres.";
    }

    // Validar precio_venta
    const precioVenta = Number(nuevoProducto.precio_venta);
    if (!nuevoProducto.precio_venta) {
      nuevosErrores.precio_venta = "El precio de venta es requerido.";
    } else if (isNaN(precioVenta) || precioVenta <= 0) {
      nuevosErrores.precio_venta = "El precio de venta debe ser un número mayor a 0.";
    }

    // Validar precio_compra
    const precioCompra = Number(nuevoProducto.precio_compra);
    if (!nuevoProducto.precio_compra) {
      nuevosErrores.precio_compra = "El precio de compra es requerido.";
    } else if (isNaN(precioCompra) || precioCompra <= 0) {
      nuevosErrores.precio_compra = "El precio de compra debe ser un número mayor a 0.";
    }

    // Validar stock
    const stock = parseInt(nuevoProducto.stock, 10);
    if (nuevoProducto.stock === "" || nuevoProducto.stock === undefined) {
      nuevosErrores.stock = "El stock es requerido.";
    } else if (isNaN(stock) || stock < 0) {
      nuevosErrores.stock = "El stock debe ser un número entero mayor o igual a 0.";
    }

    // Validar id_marca
    const idMarca = parseInt(nuevoProducto.id_marca, 10);
    if (!nuevoProducto.id_marca) {
      nuevosErrores.id_marca = "Debes seleccionar una marca.";
    } else if (isNaN(idMarca) || idMarca <= 0) {
      nuevosErrores.id_marca = "El ID de la marca debe ser un número entero mayor a 0.";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarEnvio = () => {
    if (validarFormulario()) {
      agregarProducto();
    }
  };

  return (
    <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Nuevo Producto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formNombreProducto">
            <Form.Label>Nombre del Producto</Form.Label>
            <Form.Control
              type="text"
              name="nombre_"
              value={nuevoProducto.nombre_}
              onChange={manejarCambioInput}
              placeholder="Ingresa el nombre (máx. 50 caracteres)"
              maxLength={50}
              required
              isInvalid={!!errores.nombre_}
            />
            <Form.Control.Feedback type="invalid">
              {errores.nombre_}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formModeloProducto">
            <Form.Label>Modelo</Form.Label>
            <Form.Control
              type="text"
              name="modelo"
              value={nuevoProducto.modelo}
              onChange={manejarCambioInput}
              placeholder="Ingresa el modelo (máx. 40 caracteres)"
              maxLength={40}
              required
              isInvalid={!!errores.modelo}
            />
            <Form.Control.Feedback type="invalid">
              {errores.modelo}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPrecioVentaProducto">
            <Form.Label>Precio de Venta</Form.Label>
            <Form.Control
              type="number"
              name="precio_venta"
              value={nuevoProducto.precio_venta}
              onChange={manejarCambioInput}
              placeholder="Ingresa el precio de venta"
              step="0.01"
              min="0.01"
              required
              isInvalid={!!errores.precio_venta}
            />
            <Form.Control.Feedback type="invalid">
              {errores.precio_venta}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPrecioCompraProducto">
            <Form.Label>Precio de Compra</Form.Label>
            <Form.Control
              type="number"
              name="precio_compra"
              value={nuevoProducto.precio_compra}
              onChange={manejarCambioInput}
              placeholder="Ingresa el precio de compra"
              step="0.01"
              min="0.01"
              required
              isInvalid={!!errores.precio_compra}
            />
            <Form.Control.Feedback type="invalid">
              {errores.precio_compra}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formStockProducto">
            <Form.Label>Stock</Form.Label>
            <Form.Control
              type="number"
              name="stock"
              value={nuevoProducto.stock}
              onChange={manejarCambioInput}
              placeholder="Ingresa la cantidad en stock"
              min="0"
              step="1"
              required
              isInvalid={!!errores.stock}
            />
            <Form.Control.Feedback type="invalid">
              {errores.stock}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formMarcaProducto">
            <Form.Label>Marca</Form.Label>
            <Form.Select
              name="id_marca"
              value={nuevoProducto.id_marca}
              onChange={manejarCambioInput}
              required
              isInvalid={!!errores.id_marca}
            >
              <option value="">Selecciona una marca</option>
              {marcas.map((marca) => (
                <option key={marca.id_marca} value={marca.id_marca}>
                  {marca.marca}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errores.id_marca}
            </Form.Control.Feedback>
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
        <Button variant="primary" onClick={manejarEnvio}>
          Guardar Producto
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroProducto;