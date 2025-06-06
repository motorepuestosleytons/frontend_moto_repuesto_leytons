import React, { useState, useEffect } from 'react';
import TablaMarcas from '../components/marca/TablaMarcas';
import ModalRegistroMarca from '../components/marca/ModalRegistroMarca';
import ModalEliminacionMarca from '../components/marca/ModalEliminacionMarca';
import ModalEdicionMarca from '../components/marca/ModalEdicionMarca';
import CuadroBusquedas from '../components/busquedas/CuadroBusquedas';
import { Container, Button, Row, Col } from "react-bootstrap";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const Marcas = () => {
  const [listaMarcas, setListaMarcas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [errorFormulario, setErrorFormulario] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevaMarca, setNuevaMarca] = useState({ marca: '' });
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [marcaAEliminar, setMarcaAEliminar] = useState(null);
  const [marcasFiltradas, setMarcasFiltradas] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [paginaActual, establecerPaginaActual] = useState(1);
  const elementosPorPagina = 3;
  const [marcaEditada, setMarcaEditada] = useState(null);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);

  const obtenerMarcas = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/marcas');
      if (!respuesta.ok) {
        throw new Error('Error al cargar las marcas');
      }
      const datos = await respuesta.json();
      setListaMarcas(datos);
      setMarcasFiltradas(datos);
      setCargando(false);
    } catch (error) {
      setErrorCarga(error.message);
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerMarcas();
  }, []);

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevaMarca((prev) => ({
      ...prev,
      [name]: value || '',
    }));
  };

  const manejarCambioInputEdicion = (e) => {
    const { name, value } = e.target;
    setMarcaEditada((prev) => ({
      ...prev,
      [name]: value || '',
    }));
  };

  const agregarMarca = async () => {
    if (!nuevaMarca.marca) {
      setErrorFormulario("Por favor, completa el nombre de la marca.");
      return;
    }

    try {
      const respuesta = await fetch('http://localhost:3000/api/registrarmarca', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevaMarca),
      });

      if (!respuesta.ok) {
        throw new Error('Error al agregar la marca');
      }

      await obtenerMarcas();
      setNuevaMarca({ marca: '' });
      setMostrarModal(false);
      setErrorFormulario(null);
    } catch (error) {
      setErrorFormulario(error.message);
    }
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setErrorFormulario(null);
    setNuevaMarca({ marca: '' });
  };

  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);
    establecerPaginaActual(1);

    const filtradas = listaMarcas.filter(
      (marca) => marca.marca.toLowerCase().includes(texto)
    );
    setMarcasFiltradas(filtradas);
  };

  const eliminarMarca = async () => {
    if (!marcaAEliminar) return;

    try {
      const respuesta = await fetch(`http://localhost:3000/api/eliminarmarca/${marcaAEliminar.id_marca}`, {
        method: 'DELETE',
      });

      if (!respuesta.ok) {
        throw new Error('Error al eliminar la marca');
      }

      await obtenerMarcas();
      setMostrarModalEliminacion(false);
      establecerPaginaActual(1);
      setMarcaAEliminar(null);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const abrirModalEliminacion = (marca) => {
    setMarcaAEliminar(marca);
    setMostrarModalEliminacion(true);
  };

  const abrirModalEdicion = (marca) => {
    setMarcaEditada(marca);
    setMostrarModalEdicion(true);
  };

  const actualizarMarca = async () => {
    if (!marcaEditada?.marca) {
      setErrorFormulario("Por favor, completa el nombre de la marca antes de guardar.");
      return;
    }

    try {
      const respuesta = await fetch(`http://localhost:3000/api/actualizarmarca/${marcaEditada.id_marca}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          marca: marcaEditada.marca,
        }),
      });

      if (!respuesta.ok) {
        throw new Error('Error al actualizar la marca');
      }

      await obtenerMarcas();
      setMostrarModalEdicion(false);
      setMarcaEditada(null);
      setErrorFormulario(null);
    } catch (error) {
      setErrorFormulario(error.message);
    }
  };

  const generarPDFMarcas = () => {
    const doc = new jsPDF();

    // Encabezado del PDF
    doc.setFillColor(28, 41, 51);
    doc.rect(0, 0, 220, 30, 'F');

    // Título centrado con texto blanco
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.text("Lista de Marcas", doc.internal.pageSize.getWidth() / 2, 18, { align: "center" });

    const columnas = ["ID", "Nombre de la Marca"];

    const filas = marcasFiltradas.map((marca) => [
      marca.id_marca,
      marca.marca,
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
    const nombreArchivo = `marcas_${dia}${mes}${anio}.pdf`;

    doc.save(nombreArchivo);
  };

  const exportarExcelMarcas = () => {
    const datos = marcasFiltradas.map((marca) => ({
      ID: marca.id_marca,
      Nombre: marca.marca,
    }));

    const hoja = XLSX.utils.json_to_sheet(datos);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Marcas");

    const excelBuffer = XLSX.write(libro, { bookType: 'xlsx', type: 'array' });

    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    const nombreArchivo = `marcas_${dia}${mes}${anio}.xlsx`;

    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, nombreArchivo);
  };
   const generarPDFDetalleMarca = (marca) => {
     const doc = new jsPDF();
     const anchoPagina = doc.internal.pageSize.getWidth();
   
     // Encabezado
     doc.setFillColor(28, 41, 51);
     doc.rect(0, 0, 220, 30, 'F');
     doc.setTextColor(255, 255, 255);
     doc.setFontSize(22);
     doc.text(marca.marca, anchoPagina / 2, 18, { align: "center" });
   
     // Detalles
     doc.setTextColor(0, 0, 0);
     doc.setFontSize(14);
     let posicionY = 50;
   
     doc.text(`Marca: ${marca.marca}`, anchoPagina / 2, posicionY, { align: "center" });
    
     doc.save(`${marca.marca}.pdf`);
   };
  
  





  const marcasPaginadas = marcasFiltradas.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  return (
    <>
      <Container className="mt-5">
        <br />
        <h4>Marcas</h4>

        <Row>
          <Col lg={2} md={2} sm={3} xs={3}>
            <Button
              variant="primary"
              onClick={() => setMostrarModal(true)}
              style={{ width: "100%" }}
            >
              Nueva Marca
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
              onClick={() => generarPDFMarcas()}
              variant="secondary"
              style={{ width: "100%" }}
            >
              Generar reporte PDF
            </Button>
          </Col>
          <Col lg={3} md={4} sm={4} xs={5}>
            <Button
              className="mb-3"
              onClick={() => exportarExcelMarcas()}
              variant="secondary"
              style={{ width: "100%" }}
            >
              Generar Excel
            </Button>
          </Col>
        </Row>

        <br />
        <br />

        <TablaMarcas
          marcas={marcasPaginadas}
          cargando={cargando}
          error={errorCarga}
          totalElementos={marcasFiltradas.length}
          elementosPorPagina={elementosPorPagina}
          paginaActual={paginaActual}
          establecerPaginaActual={establecerPaginaActual}
          abrirModalEliminacion={abrirModalEliminacion}
          abrirModalEdicion={abrirModalEdicion}
          generarPDFDetalleMarca={generarPDFDetalleMarca}
        />

        <ModalRegistroMarca
          mostrarModal={mostrarModal}
          setMostrarModal={setMostrarModal}
          nuevaMarca={nuevaMarca}
          manejarCambioInput={manejarCambioInput}
          agregarMarca={agregarMarca}
          errorCarga={errorFormulario}
          cerrarModal={cerrarModal}
        />

        <ModalEliminacionMarca
          mostrarModalEliminacion={mostrarModalEliminacion}
          setMostrarModalEliminacion={setMostrarModalEliminacion}
          eliminarMarca={eliminarMarca}
        />

        <ModalEdicionMarca
          mostrarModalEdicion={mostrarModalEdicion}
          setMostrarModalEdicion={setMostrarModalEdicion}
          marcaEditada={marcaEditada}
          manejarCambioInputEdicion={manejarCambioInputEdicion}
          actualizarMarca={actualizarMarca}
          errorCarga={errorFormulario}
        />
      </Container>
    </>
  );
};

export default Marcas;