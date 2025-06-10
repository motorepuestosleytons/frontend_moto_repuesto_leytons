import React, { useState, useEffect } from 'react';
import TablaProveedor from '../components/proveedor/TablaProveedor';
import ModalRegistroProveedor from '../components/proveedor/ModalRegistroProveedor';
import ModalEliminacionProveedor from '../components/proveedor/ModalEliminacionProveedor';
import ModalEdicionProveedor from '../components/proveedor/ModalEdicionProveedor';
import CuadroBusquedas from '../components/busquedas/CuadroBusquedas';
import { Container, Button, Row, Col } from "react-bootstrap";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Proveedores = () => {
  const [listaProveedores, setListaProveedores] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [errorFormulario, setErrorFormulario] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoProveedor, setNuevoProveedor] = useState({
    nombre_proveedor: '',
    telefono: '',
    empresa: '',
  });
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [proveedorAEliminar, setProveedorAEliminar] = useState(null);
  const [proveedoresFiltrados, setProveedoresFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [paginaActual, establecerPaginaActual] = useState(1);
  const elementosPorPagina = 3;
  const [proveedorEditado, setProveedorEditado] = useState(null);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);

  const obtenerProveedores = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/proveedores');
      if (!respuesta.ok) {
        throw new Error('Error al cargar los proveedores');
      }
      const datos = await respuesta.json();
      setListaProveedores(datos);
      setProveedoresFiltrados(datos);
      setCargando(false);
    } catch (error) {
      setErrorCarga(error.message);
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerProveedores();
  }, []);

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoProveedor((prev) => ({
      ...prev,
      [name]: value || '',
    }));
  };

  const manejarCambioInputEdicion = (e) => {
    const { name, value } = e.target;
    setProveedorEditado((prev) => ({
      ...prev,
      [name]: value || '',
    }));
  };

  const agregarProveedor = async () => {
    if (!nuevoProveedor.nombre_proveedor || !nuevoProveedor.telefono || !nuevoProveedor.empresa) {
      setErrorFormulario("Por favor, completa todos los campos requeridos.");
      return;
    }

    try {
      const respuesta = await fetch('http://localhost:3000/api/registrarproveedor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoProveedor),
      });

      if (!respuesta.ok) {
        throw new Error('Error al agregar el proveedor');
      }

      await obtenerProveedores();
      setNuevoProveedor({
        nombre_proveedor: '',
        telefono: '',
        empresa: '',
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
    setNuevoProveedor({
      nombre_proveedor: '',
      telefono: '',
      empresa: '',
    });
  };

  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);
    establecerPaginaActual(1);

    const filtrados = listaProveedores.filter(
      (proveedor) =>
        proveedor.nombre_proveedor.toLowerCase().includes(texto) ||
        proveedor.telefono.toLowerCase().includes(texto) ||
        proveedor.empresa.toLowerCase().includes(texto)
    );
    setProveedoresFiltrados(filtrados);
  };

  const eliminarProveedor = async () => {
    if (!proveedorAEliminar) return;

    try {
      const respuesta = await fetch(`http://localhost:3000/api/eliminarproveedor/${proveedorAEliminar.id_prov}`, {
        method: 'DELETE',
      });

      if (!respuesta.ok) {
        throw new Error('Error al eliminar el proveedor');
      }

      await obtenerProveedores();
      setMostrarModalEliminacion(false);
      establecerPaginaActual(1);
      setProveedorAEliminar(null);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const abrirModalEliminacion = (proveedor) => {
    setProveedorAEliminar(proveedor);
    setMostrarModalEliminacion(true);
  };

  const abrirModalEdicion = (proveedor) => {
    setProveedorEditado(proveedor);
    setMostrarModalEdicion(true);
  };

  const actualizarProveedor = async () => {
    if (!proveedorEditado?.nombre_proveedor || !proveedorEditado?.telefono || !proveedorEditado?.empresa) {
      setErrorFormulario("Por favor, completa todos los campos antes de guardar.");
      return;
    }

    try {
      const respuesta = await fetch(`http://localhost:3000/api/actualizarproveedor/${proveedorEditado.id_prov}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre_proveedor: proveedorEditado.nombre_proveedor,
          telefono: proveedorEditado.telefono,
          empresa: proveedorEditado.empresa,
        }),
      });

      if (!respuesta.ok) {
        throw new Error('Error al actualizar el proveedor');
      }

      await obtenerProveedores();
      setMostrarModalEdicion(false);
      setProveedorEditado(null);
      setErrorFormulario(null);
    } catch (error) {
      setErrorFormulario(error.message);
    }
  };

  const proveedoresPaginados = proveedoresFiltrados.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

// 📄 Generar PDF con la lista de proveedores
const generarPDFProveedores = () => {
    const doc = new jsPDF();

    // Encabezado del PDF
    doc.setFillColor(28, 41, 51);
    doc.rect(0, 0, 220, 30, 'F');

    // Título centrado con texto blanco
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.text("Lista de Proveedores", doc.internal.pageSize.getWidth() / 2, 18, { align: "center" });

    const columnas = ["ID", "Nombre", "Teléfono", "Empresa"];

    const filas = proveedoresFiltrados.map((p) => [
        p.id_prov,
        p.nombre_proveedor,
        p.telefono,
        p.empresa,
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
        },
        pageBreak: "auto",
        rowPageBreak: "auto",

        // Pie de página con número de página
        didDrawPage: function () {
            const alturaPagina = doc.internal.pageSize.getHeight();
            const anchoPagina = doc.internal.pageSize.getWidth();
            const numeroPagina = doc.internal.getNumberOfPages();

            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            const piePagina = `Página ${numeroPagina} de ${totalPaginas}`;
            doc.text(piePagina, anchoPagina / 2 + 15, alturaPagina - 10, { align: "center" });
        },
    });

    // Inyectar total real de páginas
    if (typeof doc.putTotalPages === 'function') {
        doc.putTotalPages(totalPaginas);
    }

    // Guardar con nombre dinámico
    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    const nombreArchivo = `proveedores_${dia}${mes}${anio}.pdf`;

    doc.save(nombreArchivo);
};


// 📄 Generar PDF con el detalle de un solo proveedor
const generarPDFDetalleProveedor = (proveedor) => {
  const doc = new jsPDF();
  const anchoPagina = doc.internal.pageSize.getWidth();

  // Encabezado
  doc.setFillColor(28, 41, 51);
  doc.rect(0, 0, 220, 30, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text(proveedor.nombre_proveedor, anchoPagina / 2, 18, { align: "center" });

  // Detalles
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  let posicionY = 50;

  doc.text(`Teléfono: ${proveedor.telefono}`, anchoPagina / 2, posicionY, { align: "center" });
  doc.text(`Empresa: ${proveedor.empresa}`, anchoPagina / 2, posicionY + 10, { align: "center" });

  doc.save(`${proveedor.nombre_proveedor}.pdf`);
};

// 📊 Exportar proveedores a archivo Excel
const exportarExcelProveedores = () => {
  const datos = proveedoresFiltrados.map((p) => ({
    ID: p.id_prov,
    Nombre: p.nombre_proveedor,
    Teléfono: p.telefono,
    Empresa: p.empresa,
  }));

  const hoja = XLSX.utils.json_to_sheet(datos);
  const libro = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(libro, hoja, "Proveedores");

  const excelBuffer = XLSX.write(libro, { bookType: 'xlsx', type: 'array' });

  const fecha = new Date();
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const anio = fecha.getFullYear();
  const nombreArchivo = `proveedores_${dia}${mes}${anio}.xlsx`;

  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(blob, nombreArchivo);
};

  return (
    <>
      <Container className="mt-5">
        <br />
        <h4>Proveedores</h4>

        <Row>
          <Col lg={2} md={4} sm={4} xs={5}>
            <Button
              variant="primary"
              onClick={() => setMostrarModal(true)}
              style={{ width: "100%" }}
            >
              Nuevo Proveedor
            </Button>
          </Col>
          <Col lg={3} md={8} sm={8} xs={7}>
            <CuadroBusquedas
              textoBusqueda={textoBusqueda}
              manejarCambioBusqueda={manejarCambioBusqueda}
            />
          </Col>

   <Col lg={3} md={4} sm={4} xs={5}>
          <Button
            className="mb-3"
            onClick={() => generarPDFProveedores()}
            variant="secondary"
            style={{ width: "100%" }}
          >
            Generar reporte PDF
          </Button>
        </Col>

        <Col lg={3} md={4} sm={4} xs={5}>
        <Button
          className="mb-3"
          onClick={() => exportarExcelProveedores()}
          variant="secondary"
          style={{ width: "100%" }}
        >
          Generar Excel
        </Button>
      </Col>

        </Row>

        <TablaProveedor
          proveedores={proveedoresPaginados}
          cargando={cargando}
          error={errorCarga}
          totalElementos={proveedoresFiltrados.length}
          elementosPorPagina={elementosPorPagina}
          paginaActual={paginaActual}
          establecerPaginaActual={establecerPaginaActual}
          abrirModalEliminacion={abrirModalEliminacion}
          abrirModalEdicion={abrirModalEdicion}
          generarPDFDetalleProveedor={generarPDFDetalleProveedor}
        />

        <ModalRegistroProveedor
          mostrarModal={mostrarModal}
          setMostrarModal={setMostrarModal}
          nuevoProveedor={nuevoProveedor}
          manejarCambioInput={manejarCambioInput}
          agregarProveedor={agregarProveedor}
          errorCarga={errorFormulario}
          cerrarModal={cerrarModal}
        />

        <ModalEliminacionProveedor
          mostrarModalEliminacion={mostrarModalEliminacion}
          setMostrarModalEliminacion={setMostrarModalEliminacion}
          eliminarProveedor={eliminarProveedor}
        />

        <ModalEdicionProveedor
          mostrarModalEdicion={mostrarModalEdicion}
          setMostrarModalEdicion={setMostrarModalEdicion}
          proveedorEditado={proveedorEditado}
          manejarCambioInputEdicion={manejarCambioInputEdicion}
          actualizarProveedor={actualizarProveedor}
          errorCarga={errorFormulario}
        />
      </Container>
    </>
  );
};

export default Proveedores;