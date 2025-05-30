import React, { useState } from 'react';
import { Modal, Button, Form, ListGroup, Spinner, Table } from 'react-bootstrap';

const ChatIA = ({ mostrarChatModal, setMostrarChatModal }) => {

  const [mensaje, setMensaje] = useState('');
  const [respuesta, setRespuesta] = useState(null);
  const [cargando, setCargando] = useState(false);

  const enviarMensaje = async () => {
    if (!mensaje.trim()) return;

    setCargando(true);
    setRespuesta(null);
    setMensaje('');

    try {
      const prompt = `
        Genera una consulta SQL válida para un Data Mart con las siguientes tablas y relaciones:
        - dim_tiempo (id_tiempo, fecha,mes, dia)
        - dim_cliente (id_cliente, cedula, nombre_cliente, apellido)
        - dim_producto (id_producto, nombre_, modelo, precio_venta, precio_compra, stock, marca)
        - hechos_venta (id_hechos_venta, id_tiempo, id_producto, id_cliente, cantidad, precio_unitario, fecha_venta)
        Relaciones:
        - hechos_venta.id_cliente -> dim_cliente.id_cliente
        - hechos_venta.id_producto -> dim_producto.id_producto
        - hechos_venta.id_tiempo -> dim_tiempo.id_tiempo
        Instrucciones:
        - Toma en cuenta que son consultas SQL para MySQL.
        - Usa solo las columnas listadas en cada tabla.
        - Asegúrate de que los JOINs sean correctos y utilicen las claves foráneas especificadas.
        - Si se solicita información de múltiples tablas, usa JOINs explícitos.
        - No generes subconsultas complejas ni funciones avanzadas a menos que sean explícitamente solicitadas.
        - Devuelve la consulta SQL en una sola línea, sin saltos de línea, comillas triples, ni formato adicional.
        Pregunta del usuario: "${mensaje}"
      `;

      const apiKey = import.meta.env.VITE_API_KEY;

      const respuestaGemini = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { response_mime_type: 'text/plain' },
          }),
        }
      );
      
      if (!respuestaGemini.ok) throw new Error('Error en la respuesta de Gemini API');

      const datosGemini = await respuestaGemini.json();
      const consultaSQL = datosGemini.candidates?.[0]?.content?.parts?.[0]?.text || '';

      if (!consultaSQL.trim().startsWith('SELECT') || consultaSQL.includes('DROP') || consultaSQL.includes('DELETE') || consultaSQL.includes('UPDATE')) {
        throw new Error('Consulta SQL generada inválida o insegura. SOLO SE PUEDEN REALIZAR CONSULTAS SELECT.');
      }

      const response = await fetch('http://localhost:3000/ia/consultarconia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consultaSQL }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error en la respuesta del backend: ${errorText}`);
      }

      const resultadoConsulta = await response.json();

      setRespuesta({
        usuario: mensaje,
        ia: resultadoConsulta.resultados || 'No se encontraron resultados.',
      });
    } catch (error) {
      console.error('Error:', error);
      setRespuesta({
        usuario: mensaje,
        ia: `Error: ${error.message}`,
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <Modal show={mostrarChatModal} onHide={() => setMostrarChatModal(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Consulta al Data Mart con IA</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {respuesta && (
          <ListGroup style={{ maxHeight: '300px', overflowY: 'auto' }}>
            <ListGroup.Item variant="primary">
              <strong>Tú: </strong>
              {respuesta.usuario}
            </ListGroup.Item>
            <ListGroup.Item variant="light">
              <strong>IA: </strong>
              {Array.isArray(respuesta.ia) && respuesta.ia.length > 0 ? (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      {Object.keys(respuesta.ia[0]).map((key) => (
                        <th key={key}>{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {respuesta.ia.map((row, index) => (
                      <tr key={index}>
                        {Object.values(row).map((value, i) => (
                          <td key={i}>{value !== null ? value : ''}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <pre>{respuesta.ia}</pre>
              )}
            </ListGroup.Item>
          </ListGroup>
        )}
        <Form.Control
          className="mt-3"
          type="text"
          placeholder="Escribe una consulta (ej. 'Ventas totales por categoría en 2025')"
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && enviarMensaje()}
          disabled={cargando}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarChatModal(false)}>
          Cerrar
        </Button>
        <Button onClick={enviarMensaje} disabled={cargando || !mensaje.trim()}>
          {cargando ? <Spinner size="sm" animation="border" /> : 'Enviar'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ChatIA;