import React, { useState, useEffect } from 'react';
import TablaProductos from '../components/producto/TablaProductos';
import ModalRegistroProducto from '../components/producto/ModalRegistroProducto';
import ModalEliminacionProducto from '../components/producto/ModalEliminacionProducto';
import ModalEdicionProducto from '../components/producto/ModalEdicionProducto';
import CuadroBusquedas from '../components/busquedas/CuadroBusquedas';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Container, Button, Row, Col } from "react-bootstrap";

const Productos = () => {
  const [listaProductos, setListaProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [errorFormulario, setErrorFormulario] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre_: '',
    modelo: '',
    precio_venta: '',
    precio_compra: '',
    stock: '',
    id_marca: ''
  });
  const [listaMarcas, setListaMarcas] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [paginaActual, establecerPaginaActual] = useState(1);
  const elementosPorPagina = 20;
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const [productoEditado, setProductoEditado] = useState(null);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);

  const obtenerProductos = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/productos');
      if (!respuesta.ok) {
        throw new Error('Error al cargar los productos');
      }
      const datos = await respuesta.json();
      setListaProductos(datos);
      setProductosFiltrados(datos);
      setCargando(false);
    } catch (error) {
      setErrorCarga(error.message);
      setCargando(false);
    }
  };

  const obtenerMarcas = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/marcas');
      if (!respuesta.ok) {
        throw new Error('Error al cargar las marcas');
      }
      const datos = await respuesta.json();
      setListaMarcas(datos);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  useEffect(() => {
    obtenerProductos();
    obtenerMarcas();
  }, []);

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoProducto((prev) => ({
      ...prev,
      [name]: value || '',
    }));
  };

  const manejarCambioInputEdicion = (e) => {
    const { name, value } = e.target;
    setProductoEditado((prev) => ({
      ...prev,
      [name]: value || '',
    }));
  };

  const agregarProducto = async () => {
  if (
    !nuevoProducto.nombre_ ||
    !nuevoProducto.modelo ||
    !nuevoProducto.precio_venta ||
    !nuevoProducto.precio_compra ||
    !nuevoProducto.stock ||
    !nuevoProducto.id_marca
  ) {
    setErrorFormulario("Por favor, completa todos los campos requeridos.");
    return;
  }

  if (
    isNaN(nuevoProducto.precio_venta) ||
    isNaN(nuevoProducto.precio_compra) ||
    isNaN(nuevoProducto.stock) ||
    isNaN(nuevoProducto.id_marca)
  ) {
    setErrorFormulario("Los campos precio_venta, precio_compra, stock e id_marca deben ser numéricos.");
    return;
  }

  try {
    const productoParaEnviar = {
      nombre_: nuevoProducto.nombre_,
      modelo: nuevoProducto.modelo,
      precio_venta: Number(nuevoProducto.precio_venta),
      precio_compra: Number(nuevoProducto.precio_compra),
      stock: parseInt(nuevoProducto.stock, 10),
      id_marca: parseInt(nuevoProducto.id_marca, 10),
      imagen: nuevoProducto.imagen || ''  // Agregamos imagen aquí
    };

    const respuesta = await fetch('http://localhost:3000/api/registrarproducto', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productoParaEnviar),
    });

    if (!respuesta.ok) {
      const errorData = await respuesta.json();
      throw new Error(errorData.mensaje || 'Error al agregar el producto');
    }

    await obtenerProductos();
    setNuevoProducto({
      nombre_: '',
      modelo: '',
      precio_venta: '',
      precio_compra: '',
      stock: '',
      id_marca: '',
      imagen: ''  // Limpiamos también el campo imagen
    });
    setMostrarModal(false);
    setErrorFormulario(null);
  } catch (error) {
    setErrorFormulario(error.message);
  }
};


  const cerrarModal = () => {
    setMostrarModal(false);
    setErrorFormulario(null);
    setNuevoProducto({
      nombre_: '',
      modelo: '',
      precio_venta: '',
      precio_compra: '',
      stock: '',
      id_marca: ''
    });
  };

  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);
    establecerPaginaActual(1);

    const filtrados = listaProductos.filter(
      (producto) =>
        producto.nombre_?.toLowerCase().includes(texto) ||
        producto.modelo?.toLowerCase().includes(texto) ||
        producto.precio_venta?.toString().includes(texto) ||
        producto.precio_compra?.toString().includes(texto) ||
        producto.stock?.toString().includes(texto) ||
        producto.id_marca?.toString().includes(texto)
    );
    setProductosFiltrados(filtrados);
  };

  const eliminarProducto = async () => {
    if (!productoAEliminar) return;

    try {
      const respuesta = await fetch(`http://localhost:3000/api/eliminarproducto/${productoAEliminar.id_producto}`, {
        method: 'DELETE',
      });

      if (!respuesta.ok) {
        const errorData = await respuesta.json();
        throw new Error(errorData.mensaje || 'Error al eliminar el producto');
      }

      await obtenerProductos();
      setMostrarModalEliminacion(false);
      establecerPaginaActual(1);
      setProductoAEliminar(null);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const abrirModalEliminacion = (producto) => {
    setProductoAEliminar(producto);
    setMostrarModalEliminacion(true);
  };

  const abrirModalEdicion = (producto) => {
    setProductoEditado(producto);
    setMostrarModalEdicion(true);
  };

  const actualizarProducto = async () => {
  if (
    !productoEditado?.nombre_ ||
    !productoEditado?.modelo ||
    !productoEditado?.precio_venta ||
    !productoEditado?.precio_compra ||
    !productoEditado?.stock ||
    !productoEditado?.id_marca
  ) {
    setErrorFormulario("Por favor, completa todos los campos requeridos.");
    return;
  }

  if (
    isNaN(productoEditado.precio_venta) ||
    isNaN(productoEditado.precio_compra) ||
    isNaN(productoEditado.stock) ||
    isNaN(productoEditado.id_marca)
  ) {
    setErrorFormulario("Los campos precio_venta, precio_compra, stock e id_marca deben ser numéricos.");
    return;
  }

  try {
    const productoParaEnviar = {
      nombre_: productoEditado.nombre_,
      modelo: productoEditado.modelo,
      precio_venta: Number(productoEditado.precio_venta),
      precio_compra: Number(productoEditado.precio_compra),
      stock: parseInt(productoEditado.stock, 10),
      id_marca: parseInt(productoEditado.id_marca, 10),
    };

    // Verifica si existe una imagen para enviar
    if (productoEditado.imagen) {
      productoParaEnviar.imagen = productoEditado.imagen;
    }

    const respuesta = await fetch(
      `http://localhost:3000/api/actualizarproducto/${productoEditado.id_producto}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productoParaEnviar),
      }
    );

    if (!respuesta.ok) {
      const errorData = await respuesta.json();
      throw new Error(errorData.mensaje || 'Error al actualizar el producto');
    }

    await obtenerProductos();
    setMostrarModalEdicion(false);
    setProductoEditado(null);
    setErrorFormulario(null);
  } catch (error) {
    setErrorFormulario(error.message);
  }
};


  const productosPaginados = productosFiltrados.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

const generarPDFProductos = () => {
    
    const doc = new jsPDF();

    // Encabezado del PDF
    doc.setFillColor(28, 41, 51);
    doc.rect(0, 0, 220, 30, 'F'); //

    // Titulo centrado con texto blanco
    doc.setTextColor(255, 255, 255); // Color del titulo
    doc.setFontSize(28);
    doc.text("Lista de Productos", doc.internal.pageSize.getWidth() / 2, 18, { align: "center" });

    const columnas = ["ID", "Nombre", "Modelo", "Precio Venta", "Precio Compra", "Stock", "ID Marca"];

    const filas = productosFiltrados.map((producto) => [
        producto.id_producto,
        producto.nombre_,
        producto.modelo,
        producto.precio_venta,
        producto.precio_compra,
        producto.stock,
        producto.id_marca,
    ]);

    // Marcador para mostrar el total de paginas
    const totalPaginas = "{total_pages_count_string}";

    //Configuración de la tabla
    autoTable(doc, {
        head: [columnas],
        body: filas,
        startY: 40,
        theme: "grid",
        styles: { fontSize: 10, cellPadding: 2 },
        margin: { top: 20, left: 14, right: 14 },
        tableWidth: "auto", // Ajuste de ancho automatico
        columnStyles: {
            0: { cellWidth: 'auto' }, // Ajuste de ancho automatico
            1: { cellWidth: 'auto' },
            2: { cellWidth: 'auto' },
            3: { cellWidth: 'auto' },
            4: { cellWidth: 'auto' },
            5: { cellWidth: 'auto' },
            6: { cellWidth: 'auto' },
        },
        pageBreak: "auto",
        rowPageBreak: "auto",
        // Hook que se ejecuta al dibujar cada página
        didDrawPage: function (data) {
            // Altura y ancho de la página actual
            const alturaPagina = doc.internal.pageSize.getHeight();
            const anchoPagina = doc.internal.pageSize.getWidth();

            // Número de página actual
            const numeroPagina = doc.internal.getNumberOfPages();

            // Definir texto de número de página en el centro del documento
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            const piePagina = `Página ${numeroPagina} de ${totalPaginas}`;
            doc.text(piePagina, anchoPagina / 2 + 15, alturaPagina - 10, { align: "center" });
        },
           });

            // Actualizar el marcador con el total real de páginas
            if (typeof doc.putTotalPages === 'function') {
                doc.putTotalPages(totalPaginas);
            }

            // Guardar el PDF con un nombre basado en la fecha actual
            const fecha = new Date();
            const dia = String(fecha.getDate()).padStart(2, '0');
            const mes = String(fecha.getMonth() + 1).padStart(2, '0');
            const anio = fecha.getFullYear();
            const nombreArchivo = `productos_${dia}${mes}${anio}.pdf`;

            // Actualizar el marcador con el total real de páginas
            if (typeof doc.putTotalPages === 'function') {
                doc.putTotalPages(totalPaginas);
            }

            // Guardar el documento PDF
            doc.save(nombreArchivo);

            };

        const generarPDFDetalleProducto = (producto) => {
        const pdf = new jsPDF();
        const anchoPagina = pdf.internal.pageSize.getWidth();

        // Encabezado
        pdf.setFillColor(28, 41, 51);
        pdf.rect(0, 0, 220, 30, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(22);
        pdf.text(producto.nombre_, anchoPagina / 2, 18, { align: "center" });

        let posicionY = 50;

        if (producto.imagen) {
            const propiedadesImagen = pdf.getImageProperties(producto.imagen);
            const anchoImagen = 100;
            const altoImagen = (propiedadesImagen.height * anchoImagen) / propiedadesImagen.width;
            const posicionX = (anchoPagina - anchoImagen) / 2;

            pdf.addImage(producto.imagen, 'JPEG', posicionX, 40, anchoImagen, altoImagen);
            posicionY = 40 + altoImagen + 10;
        }

        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(14);

        pdf.text(`Modelo: ${producto.modelo}`, anchoPagina / 2, posicionY, { align: "center" });
        pdf.text(`Marca: ${producto.id_marca}`, anchoPagina / 2, posicionY + 10, { align: "center" });
        pdf.text(`Precio Venta: C$ ${producto.precio_venta}`, anchoPagina / 2, posicionY + 20, { align: "center" });
        pdf.text(`Stock: ${producto.stock}`, anchoPagina / 2, posicionY + 30, { align: "center" });

        pdf.save(`${producto.nombre_}.pdf`);
    };
           
         const exportarExcelProductos = () => {

    // Estructura de datos para la hoja Excel
    const datos = productosFiltrados.map((producto) => ({
        ID: producto.id_producto,
        Nombre: producto.nombre_,
        Modelo: producto.modelo,
        "Precio Venta": parseFloat(producto.precio_venta),
        "Precio Compra": parseFloat(producto.precio_compra),
        Stock: producto.stock,
        "Id Marca": producto.id_marca
    }));

    // Crear hoja y libro Excel
    const hoja = XLSX.utils.json_to_sheet(datos);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Productos");

    // Crear el archivo binario
    const excelBuffer = XLSX.write(libro, { bookType: 'xlsx', type: 'array' });

    // Guardar el Excel con un nombre basado en la fecha actual
    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();

    const nombreArchivo = `productos_${dia}${mes}${anio}.xlsx`;

    // Guardar archivo con nombre previamente configurado
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, nombreArchivo);
};
  return (
    <>
      <Container className="mt-5">
        <br />
        <h4>Productos</h4>

        <Row>
          <Col lg={2} md={2} sm={3} xs={3}>
            <Button
              variant="primary"
              onClick={() => setMostrarModal(true)}
              style={{ width: "100%" }}
            >
              Nuevo Producto
            </Button>
          </Col>
          <Col lg={4} md={4} sm={4} xs={4}>
            <CuadroBusquedas
              textoBusqueda={textoBusqueda}
              manejarCambioBusqueda={manejarCambioBusqueda}
            />
          </Col>

          <Col lg={3} md={4} sm={4} xs={5}>
          <Button
            className="mb-3"
            onClick={() => generarPDFProductos()}
            variant="secondary"
            style={{ width: "100%" }}
          >
            Generar reporte PDF
          </Button>
        </Col>

        <Col lg={3} md={4} sm={4} xs={5}>
        <Button
          className="mb-3"
          onClick={() => exportarExcelProductos()}
          variant="secondary"
          style={{ width: "100%" }}
        >
          Generar Excel
        </Button>
      </Col>
      
        </Row>

        <TablaProductos
          productos={productosPaginados}
          cargando={cargando}
          error={errorCarga}
          totalElementos={productosFiltrados.length}
          elementosPorPagina={elementosPorPagina}
          paginaActual={paginaActual}
          establecerPaginaActual={establecerPaginaActual}
          abrirModalEliminacion={abrirModalEliminacion}
          abrirModalEdicion={abrirModalEdicion}
          generarPDFDetalleProducto={generarPDFDetalleProducto}
        />

        <ModalRegistroProducto
          mostrarModal={mostrarModal}
          setMostrarModal={setMostrarModal}
          nuevoProducto={nuevoProducto}
          manejarCambioInput={manejarCambioInput}
          agregarProducto={agregarProducto}
          errorCarga={errorFormulario}
          marcas={listaMarcas}
          cerrarModal={cerrarModal}
        />

        <ModalEliminacionProducto
          mostrarModalEliminacion={mostrarModalEliminacion}
          setMostrarModalEliminacion={setMostrarModalEliminacion}
          eliminarProducto={eliminarProducto}
        />

        <ModalEdicionProducto
          mostrarModalEdicion={mostrarModalEdicion}
          setMostrarModalEdicion={setMostrarModalEdicion}
          productoEditado={productoEditado}
          manejarCambioInputEdicion={manejarCambioInputEdicion}
          actualizarProducto={actualizarProducto}
          errorCarga={errorFormulario}
          marcas={listaMarcas}
        />
      </Container>
    </>
  );
};

export default Productos;