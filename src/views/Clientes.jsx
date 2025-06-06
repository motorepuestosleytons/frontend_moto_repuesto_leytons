import React, { useState, useEffect } from 'react';
import TablaClientes from '../components/cliente/TablaClientes';
import ModalRegistroCliente from '../components/cliente/ModalRegistroClientes';
import ModalEliminacionCliente from '../components/cliente/ModalEliminacionCliente';
import ModalEdicionCliente from '../components/cliente/ModalEdicionCliente';
import CuadroBusquedas from '../components/busquedas/CuadroBusquedas';
import { Container, Button, Row, Col } from "react-bootstrap";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const Clientes = () => {
  const [listaClientes, setListaClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [errorFormulario, setErrorFormulario] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoCliente, setNuevoCliente] = useState({
    cedula: '',
    nombre_cliente: '',
    apellido: '',
    telefono: '',
  });
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [clienteAEliminar, setClienteAEliminar] = useState(null);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [paginaActual, establecerPaginaActual] = useState(1);
  const elementosPorPagina = 3;
  const [clienteEditado, setClienteEditado] = useState(null);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);

  const obtenerClientes = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/clientes');
      if (!respuesta.ok) {
        throw new Error('Error al cargar los clientes');
      }
      const datos = await respuesta.json();
      setListaClientes(datos);
      setClientesFiltrados(datos);
      setCargando(false);
    } catch (error) {
      setErrorCarga(error.message);
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerClientes();
  }, []);

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoCliente((prev) => ({
      ...prev,
      [name]: value || '',
    }));
  };

  const manejarCambioInputEdicion = (e) => {
    const { name, value } = e.target;
    setClienteEditado((prev) => ({
      ...prev,
      [name]: value || '',
    }));
  };

  const agregarCliente = async () => {
    if (!nuevoCliente.cedula || !nuevoCliente.nombre_cliente || !nuevoCliente.apellido || !nuevoCliente.telefono) {
      setErrorFormulario("Por favor, completa todos los campos requeridos.");
      return;
    }

    try {
      const respuesta = await fetch('http://localhost:3000/api/registrarcliente', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoCliente),
      });

      if (!respuesta.ok) {
        throw new Error('Error al agregar el cliente');
      }

      await obtenerClientes();
      setNuevoCliente({
        cedula: '',
        nombre_cliente: '',
        apellido: '',
        telefono: '',
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
    setNuevoCliente({
      cedula: '',
      nombre_cliente: '',
      apellido: '',
      telefono: '',
    });
  };

  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);
    establecerPaginaActual(1);

    const filtrados = listaClientes.filter(
      (cliente) =>
        cliente.cedula.toLowerCase().includes(texto) ||
        cliente.nombre_cliente.toLowerCase().includes(texto) ||
        cliente.apellido.toLowerCase().includes(texto) ||
        cliente.telefono.toLowerCase().includes(texto)
    );
    setClientesFiltrados(filtrados);
  };

  const eliminarCliente = async () => {
    if (!clienteAEliminar) return;

    try {
      const respuesta = await fetch(`http://localhost:3000/api/eliminarcliente/${clienteAEliminar.id_cliente}`, {
        method: 'DELETE',
      });

      if (!respuesta.ok) {
        throw new Error('Error al eliminar el cliente');
      }

      await obtenerClientes();
      setMostrarModalEliminacion(false);
      establecerPaginaActual(1);
      setClienteAEliminar(null);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const abrirModalEliminacion = (cliente) => {
    setClienteAEliminar(cliente);
    setMostrarModalEliminacion(true);
  };

  const abrirModalEdicion = (cliente) => {
    setClienteEditado(cliente);
    setMostrarModalEdicion(true);
  };

  const actualizarCliente = async () => {
    if (!clienteEditado?.cedula || !clienteEditado?.nombre_cliente || !clienteEditado?.apellido || !clienteEditado?.telefono) {
      setErrorFormulario("Por favor, completa todos los campos antes de guardar.");
      return;
    }

    try {
      const respuesta = await fetch(`http://localhost:3000/api/actualizarcliente/${clienteEditado.id_cliente}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cedula: clienteEditado.cedula,
          nombre_cliente: clienteEditado.nombre_cliente,
          apellido: clienteEditado.apellido,
          telefono: clienteEditado.telefono,
        }),
      });

      if (!respuesta.ok) {
        throw new Error('Error al actualizar el cliente');
      }

      await obtenerClientes();
      setMostrarModalEdicion(false);
      setClienteEditado(null);
      setErrorFormulario(null);
    } catch (error) {
      setErrorFormulario(error.message);
    }
  };

  const generarPDFClientes = () => {
    const doc = new jsPDF();

    // Encabezado del PDF
    doc.setFillColor(28, 41, 51);
    doc.rect(0, 0, 220, 30, 'F');

    // Título centrado con texto blanco
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.text("Lista de Clientes", doc.internal.pageSize.getWidth() / 2, 18, { align: "center" });

    const columnas = ["ID", "Cédula", "Nombre", "Apellido", "Teléfono"];

    const filas = clientesFiltrados.map((cliente) => [
      cliente.id_cliente,
      cliente.cedula,
      cliente.nombre_cliente,
      cliente.apellido,
      cliente.telefono,
    ]);

    // Marcador para mostrar el total de páginas
    const totalPaginas = "{total_pages_count_string}";

    // Configuración de la tabla
    autoTable(doc, {
      head: [columnas],
      body: filas,
      startY: 40,
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 2 },
      margin: { top: 20, left: 14, right: 14 },
      tableWidth: "auto",
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 'auto' },
        3: { cellWidth: 'auto' },
        4: { cellWidth: 'auto' },
      },
      pageBreak: "auto",
      rowPageBreak: "auto",
      didDrawPage: function (data) {
        const alturaPagina = doc.internal.pageSize.getHeight();
        const anchoPagina = doc.internal.pageSize.getWidth();
        const numeroPagina = doc.internal.getNumberOfPages();
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
    const nombreArchivo = `clientes_${dia}${mes}${anio}.pdf`;

    doc.save(nombreArchivo);
  };


  const generarPDFDetallecliente = (cliente) => {
          const pdf = new jsPDF();
          const anchoPagina = pdf.internal.pageSize.getWidth();
  
          // Encabezado
          pdf.setFillColor(28, 41, 51);
          pdf.rect(0, 0, 220, 30, 'F');
          pdf.setTextColor(255, 255, 255);
          pdf.setFontSize(22);
          pdf.text(cliente.nombre_cliente, anchoPagina / 2, 18, { align: "center" });
  
          let posicionY = 50;
  
          if (cliente.imagen) {
              const propiedadesImagen = pdf.getImageProperties(producto.imagen);
              const anchoImagen = 100;
              const altoImagen = (propiedadesImagen.height * anchoImagen) / propiedadesImagen.width;
              const posicionX = (anchoPagina - anchoImagen) / 2;
  
              pdf.addImage(cliente.imagen, 'JPEG', posicionX, 40, anchoImagen, altoImagen);
              posicionY = 40 + altoImagen + 10;
          }
  
          pdf.setTextColor(0, 0, 0);
          pdf.setFontSize(14);
  
          pdf.text(`Cedula: ${cliente.cedula}`, anchoPagina / 2, posicionY, { align: "center" });
          pdf.text(`Nombre: ${cliente.nombre_cliente}`, anchoPagina / 2, posicionY + 10, { align: "center" });
          pdf.text(`Apellido: ${cliente.apellido}`, anchoPagina / 2, posicionY + 20, { align: "center" });
          pdf.text(`Telefono: ${cliente.telefono}`, anchoPagina / 2, posicionY + 30, { align: "center" });
  
          pdf.save(`${cliente.nombre_cliente}.pdf`);
      };
             

  const exportarExcelClientes = () => {
    const datos = clientesFiltrados.map((cliente) => ({
      ID: cliente.id_cliente,
      Cédula: cliente.cedula,
      Nombre: cliente.nombre_cliente,
      Apellido: cliente.apellido,
      Teléfono: cliente.telefono,
    }));

    const hoja = XLSX.utils.json_to_sheet(datos);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Clientes");

    const excelBuffer = XLSX.write(libro, { bookType: 'xlsx', type: 'array' });

    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    const nombreArchivo = `clientes_${dia}${mes}${anio}.xlsx`;

    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, nombreArchivo);
  };

  const clientesPaginados = clientesFiltrados.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  return (
    <>
      <Container className="mt-5">
        <br />
        <h4>Clientes</h4>

        <Row>
          <Col lg={2} md={2} sm={3} xs={3}>
            <Button
              variant="primary"
              onClick={() => setMostrarModal(true)}
              style={{ width: "100%" }}
            >
              Nuevo Cliente
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
              onClick={() => generarPDFClientes()}
              variant="secondary"
              style={{ width: "100%" }}
            >
              Generar reporte PDF
            </Button>
          </Col>
          <Col lg={3} md={4} sm={4} xs={5}>
            <Button
              className="mb-3"
              onClick={() => exportarExcelClientes()}
              variant="secondary"
              style={{ width: "100%" }}
            >
              Generar Excel
            </Button>
          </Col>
        </Row>

        <br />
        <br />

        <TablaClientes
          clientes={clientesPaginados}
          cargando={cargando}
          error={errorCarga}
          totalElementos={clientesFiltrados.length}
          elementosPorPagina={elementosPorPagina}
          paginaActual={paginaActual}
          establecerPaginaActual={establecerPaginaActual}
          abrirModalEliminacion={abrirModalEliminacion}
          abrirModalEdicion={abrirModalEdicion}
         generarPDFDetalleCliente={generarPDFDetallecliente}
        />

        <ModalRegistroCliente
          mostrarModal={mostrarModal}
          setMostrarModal={setMostrarModal}
          nuevoCliente={nuevoCliente}
          manejarCambioInput={manejarCambioInput}
          agregarCliente={agregarCliente}
          errorCarga={errorFormulario}
          cerrarModal={cerrarModal}
        />

        <ModalEliminacionCliente
          mostrarModalEliminacion={mostrarModalEliminacion}
          setMostrarModalEliminacion={setMostrarModalEliminacion}
          eliminarCliente={eliminarCliente}
        />

        <ModalEdicionCliente
          mostrarModalEdicion={mostrarModalEdicion}
          setMostrarModalEdicion={setMostrarModalEdicion}
          clienteEditado={clienteEditado}
          manejarCambioInputEdicion={manejarCambioInputEdicion}
          actualizarCliente={actualizarCliente}
          errorCarga={errorFormulario}
        />
      </Container>
    </>
  );
};

export default Clientes;