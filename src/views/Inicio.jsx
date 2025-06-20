import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container,Image } from "react-bootstrap";
import fondo_moto from "../assets/fondo_moto.png";
import Proposito from "../components/inicio/Proposito";

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
      <br />
      <h1 className="text-center m-5">¡Bienvenido, {nombreUsuario}!</h1>
     <Image style={{ width: "100%"}} src={fondo_moto} fluid rounded/>
     <Proposito />
      <p>"Tu moto en marcha, con repuestos de confianza"</p>
    </Container>
  );
};

export default Inicio;