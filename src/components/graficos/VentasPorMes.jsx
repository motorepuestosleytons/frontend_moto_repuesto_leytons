import { Card } from "react-bootstrap";
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';


const VentasPorMes = ({ meses, totales_por_mes }) => {

  const data = {
    labels: meses, // Nombres de los meses
    datasets: [
        {
            label: 'VENTAS POR MES', // Total de ventas por mes
            data:totales_por_mes , // Total de ventas por mes
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
                    text: ' Meses',
                },
            },
        },
    },
};
return (<Card style={{ height: '100%'}}>
    <Card.Title >Ventas por Mes</Card.Title>
    <div style={{ height: "300px", justifyContent: "center", alignItems: "center", display: "flex" }}>
        <Bar data={data} options={options} />
    </div>
</Card>);
};
export default VentasPorMes;