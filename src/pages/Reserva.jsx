import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { eliminarReserva, getReservaById } from "../store/reservaStore";
import { FiUsers, FiClock } from "react-icons/fi";

import "../styles/Reserva.css";
import State from "../components/State";
import Button from "../components/button";
import {
  buttonEditar,
  buttonEliminar,
  iconElement,
  iconSuspendido,
  iconActivo,
  iconCancelado,
  iconFinalizado,
} from "../styles/stylesComponent";
import EditarReserva from "../components/EditarReserva";
import { Alertas, AlertasConfirmar } from "../components/Alertas";
// import  { MenuProps } from "antd"; BiTimeFive
const Reserva = (props) => {
  const {
    state: { id },
  } = useLocation();
  //console.log(id);
  const [editar, setEditar] = useState(false);
  const [reserva, setReserva] = useState();
  useEffect(() => {
    getReservaById(id).then((response) => {
      setReserva(response);
    });
  }, []);

  const [mostrarAlertaConfirmar, setMostrarAlertaConfirmar] = useState(false);
  const [mostrarAlertaCancelar, setMostrarAlertaCancelar] = useState(false);
  const [mostrarAlertaMsj, setMostrarAlertaMsj] = useState(false);
  const _fecha = reserva?.fecha.slice().reverse();
  const _horaInicio = reserva?.horaInicio.slice().reverse();
  const _horaFin = reserva?.horaFin.slice().reverse();
  const fecha_hora_inicio =
    String(reserva?.horaInicio[0]).padStart(2, "0") +
    ":" +
    String(reserva?.horaInicio[1]).padStart(2, "0");
  const fecha_hora_fin =
    String(reserva?.horaFin[0]).padStart(2, "0") +
    ":" +
    String(reserva?.horaFin[1]).padStart(2, "0");

  //console.log(lugar);
  //   console.log(horaInicio.join(":"));

  const estado = {
    id: reserva?.estadoReserva.id,
    descripcion: reserva?.estadoReserva.nombre,
  };
  if (editar) {
    return (
      <EditarReserva
        cancelarReserva={() => window.location.reload()}
        {...props}
      />
    );
  }

  const eliminarRes = () => {
    console.log("eliminando")
    eliminarReserva(id)
  }

  const hora = new Date(0, 0, 0, reserva?.horaInicio[0], reserva?.horaInicio[1]);
  const horab = new Date(0, 0, 0, reserva?.horaFin[0], reserva?.horaFin[1]);
  let diferencia = horab - hora;
  let horas = Math.floor(diferencia / 3600000); // 1 hora = 3600000 milisegundos
  diferencia = diferencia % 3600000;
  let minutos = Math.floor(diferencia / 60000); // 1 minuto = 60000 milisegundos
  diferencia = diferencia % 60000;

  const duracion = horas + ":" + minutos;
  // console.log(duracion);
  // console.log(reserva?.horaInicio);
  return (
    <main className="body-allSocios">
      <section className="AliniearReserva">
        <section className="alignTitleReserva">
          {/* titulo y depto */}
          <div>
            <h2>Reserva #{id}</h2>
            <h3>Espacio: {reserva?.lugar.nombre}</h3>
          </div>
          <div className="alingDepartamento">
            <h3>Departamento a Cargo:</h3>
            <p>{reserva?.departamento.nombre}</p>
          </div>
        </section>
        <section className="alingReserva">
          {/* estado y datos */}
          <div className="estadoReserva">
            <h3>Estado:</h3>
            <State
              estado={estado}
              constEstilo={{
                1: iconActivo,
                2: iconFinalizado,
                3: iconCancelado,
                4: iconSuspendido,
              }}
            />
          </div>
          <div>
            <div className="alingResponsable">
              <h3>Responsables: </h3>
              <FiUsers style={iconElement} />
              <p>{reserva?.nombre}</p>
            </div>
            <div className="alingResponsable">
              <h3>Email: </h3>
              <p>{reserva?.email}</p>
            </div>
          </div>
          <div className="alingDuracion">
            <h3>Duracion:</h3>
            <FiClock style={iconElement} />
            <p>{duracion} Horas</p>
          </div>
        </section>

        <section className="alingReserva">
          {/* descripcion, fecha y hora */}
          <div className="alingObserv">
            {reserva?.estadoReserva.id !== 1 &&
              reserva?.estadoReserva.id !== 2 && (
                <section>
                  {/* observaciones */}
                  <h3>Observaciones</h3>
                  <p>{reserva?.observaciones}</p>
                </section>
              )}
            <section>
              <h3>Descripción</h3>
              <p>{reserva?.descripcion}</p>
            </section>
          </div>

          <section className="alingDate">
            <div>
              <h3>Fecha</h3>
              <p>{_fecha ? _fecha.join("-") : ""}</p>
            </div>
            <div>
              <div>
                <h3>Hora Inicio</h3>
                <p>{fecha_hora_inicio}</p>
              </div>
              <div>
                <h3>Hora Fin</h3>
                <p>{fecha_hora_fin}</p>
              </div>
            </div>
          </section>
        </section>
        <section>
          {/* recursos */}
          <h3>Recursos</h3>
          <div>
            <ul className="alinearCategoria">
              {reserva?.recursos?.map((etiqueta) => (
                <li key={etiqueta.id} className="etiquetaSocio">
                  {etiqueta.nombre}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="botonesReserva">
          {/* botones */}
          <Button
            style={buttonEditar}
            text="Editar Reserva"
            action={() => setEditar(true)}
          />
          <Button
            action={() => setMostrarAlertaConfirmar(true)}
            style={buttonEliminar}
            text="Eliminar Reserva"
          />
        </section>

        {mostrarAlertaConfirmar && (
          <AlertasConfirmar
            title={"Eliminar"}
            msjAlerta={"¿Desea eliminar la Reserva?"}
            action={() => {
              eliminarRes()
              setMostrarAlertaMsj(true);
            }}
            actionCancelar={() => setMostrarAlertaConfirmar(false)}
          />
        )}
        {mostrarAlertaCancelar && (
          <AlertasConfirmar
            title="SI"
            btnCancelar="NO"
            msjAlerta={"¿Desea cancelar la modificacion de la Reserva?"}
            action={() => window.location.reload()}
            actionCancelar={() => setMostrarAlertaCancelar(false)}
          />
        )}
      
        {mostrarAlertaMsj && (
          <Alertas
            title="Ok"
            msjAlerta="Reserva eliminada!"
            ruta="/reservas"
            action={() => setMostrarAlertaMsj(false)}
          />
        )}
      </section>
      <img
        src="../src/assets/img-fondo.svg"
        className="img-fondo"
        style={{ left: "-150px", top: "100px" }}
      ></img>
      <img
        src="../src/assets/img-fondo.svg"
        className="img-fondo"
        style={{ right: "-150px", top: "400px" }}
      ></img>
    </main>
  );
};

export default Reserva;
