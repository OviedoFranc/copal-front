import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import "../styles/invitacion.css";
import { FiCalendar, FiClock, FiMapPin, FiVideo } from "react-icons/fi";
import { obtenerEventoUUID } from "../store/eventoStore";
import { useParams } from "react-router-dom";
import FormInvitacionEvento from "../components/FormInvitacionEvento";

import { CircularProgress } from "@mui/material";

function Invitacion() {
  const { uuid } = useParams();
  // console.log(uuid);

  const [title, setTitle] = useState("Evento Generico");
  const [departament, setDepartament] = useState("Departamento Generico");
  const [fechaInicio, setFechaInicio] = useState("18-10-23");
  const [fechaFin, setFechaFin] = useState("21-01-24");
  const [hora, setHora] = useState("13:30 AM");
  const [lugar, setLugar] = useState("");
  const [mod, setMod] = useState("Virtual");

  const [mostrarInvitacion, setMostrarInvitacion] = useState(false);

  const iconElement = {
    color: "#D55453",
    width: "16px",
    height: "16px",
  };
  /*
  const enviarInvitacion = async () => {

    const participanteDTO = {
 
    };
  
    try {
      const data = await agregarParticipante(uuid.id, participanteDTO);
      console.log('Participante agregado:', data);
    } catch (error) {
      console.error('Error al enviar la invitación:', error);
    }
  };*/
  const formatFecha = (fechaArray) => {
    const [year, month, day] = fechaArray;
    const formattedMonth = month.toString().padStart(2, "0");
    const formattedDay = day.toString().padStart(2, "0");
    return `${formattedDay}-${formattedMonth}-${year}`;
  };

  const formatHora = (horaArray) => {
    return horaArray
      .map((segment) => segment.toString().padStart(2, "0"))
      .join(":");
  };

  useEffect(() => {
    obtenerEventoUUID(uuid).then((response) => {
      // console.log(response);
      setTitle(response.nombre);
      setDepartament(response.departamento.nombre);
      setFechaInicio(formatFecha(response.fechaInicio));
      setFechaFin(formatFecha(response.fechaFin));
      setHora(formatHora(response.horaInicio));
      setLugar(response.lugar);
      setMod(response.modalidad);
      setMostrarInvitacion(true);
    });
  }, []);

  if (mostrarInvitacion === false) {
    return (
      <div className="div_loading">
        <CircularProgress color="inherit" />
        Cargando ...
      </div>
    );
  }

  return (
    <div>
      <Typography className="tittle" variant="h4" gutterBottom>
        Invitación a {title}
      </Typography>
      <div className="container">
        <div className="leftContainer">
          <FormInvitacionEvento uuid={uuid} />
        </div>

        <div className="rightContainer">
          <section className="contElement">
            <h4 className="titleCard">{title}</h4>
            <label className="descriptionInvitacion">{departament}</label>
            <div className="alingiconInvitacion">
              <FiCalendar style={iconElement} />{" "}
              <label>
                De {fechaInicio} al {fechaFin}
              </label>
            </div>
            <div className="alingiconInvitacion">
              <FiClock style={iconElement} /> <label> {hora}</label>
            </div>
            {lugar && (
              <div className="alingiconInvitacion">
                <FiMapPin style={iconElement} />{" "}
                <label>
                  {" "}
                  {lugar.provincia +
                    ", " +
                    lugar.localidad +
                    ", " +
                    lugar.direccion}{" "}
                </label>
              </div>
            )}
            <div className="alingiconInvitacion">
              <FiVideo style={iconElement} /> <label>{mod}</label>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Invitacion;
