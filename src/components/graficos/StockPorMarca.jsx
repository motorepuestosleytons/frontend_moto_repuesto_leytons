import { Card, Button } from "react-bootstrap";
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { useRef } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const StockPorMarca = ({ marcasStock, stockPorMarca }) => {
  const chartRef = useRef(null);

  const data = {
    labels: marcasStock, // Nombres de las marcas
    datasets: [
      {
        label: 'STOCK POR MARCA',
        data: stockPorMarca, // Stock total por marca
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Unidades en stock',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Marcas',
        },
      },
    },
  };

  const generarPDF = () => {
    const doc = new jsPDF();

    // Encabezado
    doc.setFillColor(28, 41, 51);
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), 30, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("Reporte de Stock por Marca", doc.internal.pageSize.getWidth() / 2, 20, { align: "center" });

    // Captura del gráfico
    const chartInstance = chartRef.current;
    const chartCanvas = chartInstance?.canvas;
    const chartImage = chartCanvas?.toDataURL("image/png", 1.0);

    if (chartImage) {
      doc.addImage(chartImage, "PNG", 14, 40, 180, 100);
    }

    // Tabla
    const columnas = ["Marca", "Stock Total"];
    const filas = marcasStock.map((marca, index) => [marca, stockPorMarca[index]]);

    autoTable(doc, {
      head: [columnas],
      body: filas,
      startY: 150,
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 2 },
      margin: { top: 20, left: 14, right: 14 },
    });

    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    const nombreArchivo = `StockPorMarca_${dia}${mes}${anio}.pdf`;

    doc.save(nombreArchivo);
  };

  return (
    <Card style={{ height: '100%' }}>
      <Card.Title className="text-center mt-3">Stock por Marca</Card.Title>
      <div style={{ height: "300px", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Bar ref={chartRef} data={data} options={options} />
      </div>
      <Button className="btn btn-primary mt-3 mb-3" onClick={generarPDF}>
        Generar Reporte <i className="bi bi-download"></i>
      </Button>
    </Card>
  );
};

export default StockPorMarca;