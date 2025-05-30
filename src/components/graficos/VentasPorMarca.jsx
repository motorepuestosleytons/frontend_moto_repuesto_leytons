import { Card, Button } from "react-bootstrap";
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { useRef } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const VentasPorMarca = ({ marca, totales_por_marca, cantidadadvendidad }) => {
  const chartRef = useRef(null);

  const data = {
    labels:  marca, // Nombres de las marcas
    datasets: [
      {
        label: 'VENTAS POR MARCA',
        data: totales_por_marca, cantidadadvendidad,// Total de ventas por marca
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
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
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Cordobas(C$)',
          },
        },
        x: {
          title: {
            display: true,
            text: 'Marcas',
          },
        },
      },
    },
  };

  const generarPDF = () => {
    const doc = new jsPDF();

    doc.setFillColor(28, 41, 51);
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), 30, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("Reporte de Ventas por Marca", doc.internal.pageSize.getWidth() / 2, 20, { align: "center" });

    const chartInstance = chartRef.current;
    const chartCanvas = chartInstance?.canvas;
    const chartImage = chartCanvas?.toDataURL("image/png", 1.0);

    if (chartImage) {
      doc.addImage(chartImage, "PNG", 14, 40, 180, 100);
    }

    const columnas = ["Marca", "Ventas (C$)", "Cantidad Vendida"];
    const filas = marca.map((marca, index) => [marca, totales_por_marca, cantidadadvendidad[index]]);

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
    const nombreArchivo = `VentasPorMarca_${dia}${mes}${anio}.pdf`;

    doc.save(nombreArchivo);
  };

  return (
    <Card style={{ height: '100%' }}>
      <Card.Title className="text-center">Ventas por Marca</Card.Title>
      <div style={{ height: "300px", justifyContent: "center", alignItems: "center", display: "flex" }}>
        <Bar ref={chartRef} data={data} options={options} />
      </div>
      <Button className="btn btn-primary mt-3" onClick={generarPDF}>
        Generar Reporte <i className="bi bi-download"></i>
      </Button>
    </Card>
  );
};

export default VentasPorMarca;