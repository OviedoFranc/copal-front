import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "../styles/allEvent.css";
import {
  FiCalendar,
  FiClock,
  FiUser,
} from "react-icons/fi";
import State from "./State";
const iconElement = {
  color: "#D55453",
  width: "16px",
  height: "16px",
};
const iconSuspendido = {
  color: "#EB9B23",
};
const iconActivo = {
  color: "#1BEC17",
};

const iconCancelado = {
  color: "#F11513",
};
const iconFinalizado = {
  color: "#908E8E",
};


const CardReserva = ({id, nombre, fecha, horaInicio, horaFin, estado, lugar, mod,}) => {
    //   const fecha = EventoFormat(fechaFin, fechaInicio, horaInicio, horaFin);
    
  const _fecha = fecha.slice().reverse();
  const _horaInicio = horaInicio.slice().reverse();
  const _horaFin = horaFin.slice().reverse();
    //console.log(lugar);
    //   console.log(horaInicio.join(":"));
        const fecha_hora_inicio =
          String(horaInicio[0]).padStart(2, "0") +
          ":" +
          String(horaInicio[1]).padStart(2, "0");
        const fecha_hora_fin =
          String(horaFin[0]).padStart(2, "0") +
          ":" +
          String(horaFin[1]).padStart(2, "0");

  return (
    <>
      <Link to="/reservas/reserva" state={{ id: id }}>
        <div className="cardEvent">
          <section className="contElment">
            <div className="alignTitleReserva">
              <h2 className="espacioReserva">Reserva: #{id}</h2>
              <h2 className="espacioReserva">Espacio {lugar}</h2>
            </div>
            <div className="horaLugar">
              <div className="alingicon">
                <FiCalendar style={iconElement} />
                <p>{_fecha.join("-")}</p>
              </div>
              <div className="alingicon">
                <FiClock style={iconElement} />
                <p>
                  {fecha_hora_inicio} al {fecha_hora_fin}
                </p>
              </div>
              {lugar && (
                <div className="alingicon">
                  <FiUser style={iconElement} />
                  <p>{nombre}</p>
                </div>
              )}
              <div className="alingicon">
              </div>
            </div>
            <div className="estado" style={{display:"flex", justifyContent:"center"}}>
              <div >
                <State
                  estado={estado}
                  constEstilo={{
                    1: iconActivo,
                    2: iconFinalizado,
                    3: iconCancelado,
                    4: iconSuspendido,
                  }}
                />
                {/* <FiDisc />
                <p>Estado</p> */}
              </div>
            </div>
          </section>
        </div>
      </Link>
    </>
  );
};

CardReserva.propTypes = {};

export default CardReserva;
