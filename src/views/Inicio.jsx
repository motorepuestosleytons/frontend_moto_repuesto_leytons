import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";

const Inicio = () => {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const navegar = useNavigate();

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (!usuarioGuardado) {
      navegar("/");
    } else {
      setNombreUsuario(usuarioGuardado);
    }
  }, [navegar]);

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("contraseña");
    navegar("/");
  };

  return (
    <Container>
      <h1>¡Bienvenido, {nombreUsuario}!</h1>
      <p>Bienvenidos a Moto Repuestos Leyton </p>
      <p>"Tu moto en marcha, con repuestos de confianza"</p>
      <button onClick={cerrarSesion}>Cerrar Sesión</button>
    </Container>
  );
};

export default Inicio;