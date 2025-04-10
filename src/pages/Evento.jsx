import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  cancelarEvento,
  getEventById,
  activarEvento,
  BajaParticipante,
} from "../store/eventoStore";
import "../styles/evento.css";
import Button from "../components/button";
import {
  buttonEditar,
  buttonEliminar,
  CssTextField,
} from "../styles/stylesComponent";
import Modality from "../components/modality";
import { EventoFormat } from "../utils/const";
import { FiClipboard } from "react-icons/fi";
import { message } from "antd";
import {
  AlertasConfirmar,
  AlertasSinRedireccionar,
} from "../components/Alertas";
import EstadoSelector from "../components/EstadoSelector";
import { Button as ButtonM } from "@mui/material";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import CircleIcon from "@mui/icons-material/Circle";

const Evento = (props) => {
  //aca obtengo el id del evento
  const [event, setEvent] = useState({});
  const [participante, setParticipante] = useState([]);

  const {
    state: { id },
  } = useLocation();
  const [confirmarAlerta, setConfirmar] = useState(false);
  const [alertaExito, setAlertaExito] = useState(false);
  //no me juzguen por esto estaba muy cansado cuando lo hice

  //actualizar estado llamndo nuevamente a la api
  const update = () => {
    // Llama a la API nuevamente para obtener el nuevo estado
    getEventById(id).then((response) => {
      // Actualiza el estado local con los nuevos datos
      console.log(response.data);
      setEvent(response.data);
      setParticipante(response.data.participantes);
    });
  };
  const [activar, setActivar] = useState();

  const cancelEvent = () => {
    cancelarEvento(id).then(() => {
      // actualiza la API nuevamente para obtener el nuevo estado
      update();
    });
    setActivar(true);
    setAlertaExito(true);
  };
  const activarE = () => {
    activarEvento(id).then(() => {
      update();
    });
    setActivar(false);
    setAlertaExito(true);
  };

  useEffect(() => {
    getEventById(id).then((response) => {
      setEvent(response.data);
      setParticipante(response.data.participantes);
    });
  }, [id]);

  //esto valida si el estado inicial el evento esta cancelado
  useEffect(() => {
    if (event?.estado?.id === 4) {
      setActivar(true);
    } else if (event?.estado?.id === 3) {
      setActivar(true);
    } else {
      setActivar(false);
    }
  }, [event]);

  let URLactual = window.location;
  let pathnames = /^(\w+):\/\/([^\/]+)([^]+)$/.exec(URLactual);

  let urlCopy = "http://" + pathnames[2] + "/invitacion/" + event.codigoUUID;

  const fecha = EventoFormat(
    event ? event.fechaFin : {},
    event ? event.fechaInicio : {},
    event ? event.horaInicio : {},
    event ? event.horaFin : {}
  );

  const [messageUrl, setMessageUrl] = message.useMessage();

  const copiarUrl = (url) => {
    navigator.clipboard.writeText(url);
    messageUrl.open({
      type: "success",
      content: "Enlace copiado al portapeles",
    });
  };

  const onEventoChange = (nuevoEstado) => {
    setEvent({ ...event, estado: nuevoEstado });
  };
  const removeParticipantes = (id) => {
    console.log("remover participantes", id);
    BajaParticipante(id).then(() => {
      update();
    });
  };

  console.log(event);

  return (
    <div className=" body-allSocios">
      {setMessageUrl}
      <main className="alignElement">
        <section>
          <h2 className="titleEvent">{event ? event.nombre : ""}</h2>
          <div className="alingDepto">
            <h3 className="">Departamento a cargo:</h3>
            <p>{event.departamento ? event.departamento.nombre : ""}</p>
          </div>
          <div className="alignMod">
            <div className="alignMod">
              <h3>Estado:</h3>
              <EstadoSelector
                idEvento={id}
                estadoActual={event.estado ? event.estado : {}}
                onChangeEvent={onEventoChange}
              />
            </div>
            <div>
              <div className="alignModalidad">
                <h3>Modalidad:</h3>
                <Modality estado={event ? event.modalidad : ""} />
              </div>
              {event.plataforma && event.linkReunion && (
                <div className="aligPlataforma">
                  <h3>Vía:</h3>
                  <p>{event.plataforma}</p>
                  <button
                    className="buttonCopy"
                    onClick={() => copiarUrl(event.linkReunion)}
                  >
                    Copiar enlace de la reunión
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
        <section className="aligSection">
          <div>
            <h3>Descripción:</h3>
            <p className="alingdescripcionEvento">
              {event ? event.descripcion : ""}
            </p>
          </div>
          <section className="aligFecha">
            <section className="">
              <div>
                <h3>Fecha inicio</h3>
                <p>{fecha ? fecha.fecha_inicio : ""} </p>
              </div>
              <div>
                <h3>Fecha Fin</h3>
                <p> {fecha ? fecha.fecha_Fin : ""} </p>
              </div>
            </section>
            <section className="">
              <div>
                <h3>Hora inicio</h3>
                <p>{fecha ? fecha.fecha_hora_inicio : ""}</p>
              </div>

              <div>
                <h3>Hora Fin</h3>
                <p> {fecha ? fecha.fecha_hora_fin : ""}</p>
              </div>
            </section>
          </section>
        </section>
        {event.lugar && (
          <section>
            <div>
              <h3>Ubicación:</h3>
              <div className="aligLocation">
                <CssTextField
                  label="Provincia"
                  variant="outlined"
                  value={event.lugar.provincia}
                  focused
                  size="small"
                  style={{ width: "168px" }}
                  inputProps={{
                    readOnly: true,
                  }}
                />

                <CssTextField
                  size="small"
                  style={{ width: "168px" }}
                  label="Localidad"
                  variant="outlined"
                  value={event.lugar.localidad}
                  focused
                  inputProps={{
                    readOnly: true,
                  }}
                />
                <CssTextField
                  style={{ width: "168px" }}
                  size="small"
                  label="Direccion"
                  variant="outlined"
                  value={event.lugar.direccion}
                  focused
                  inputProps={{
                    readOnly: true,
                  }}
                />

                <CssTextField
                  label="Piso"
                  //  color="#76B8C3"
                  style={{ width: "168px" }}
                  size="small"
                  variant="outlined"
                  value={event.lugar.piso}
                  focused
                  inputProps={{
                    readOnly: true,
                    style: {
                      borderColor: "red",
                    },
                  }}
                />
              </div>
            </div>
          </section>
        )}
        <section>
          <h3>Participantes:</h3>
          <div>
            <ul className="listInvitados_evento">
              {participante?.map((e, i) => (
                <li className="listname_invitados" key={i}>
                  <CircleIcon
                    fontSize="smaller"
                    sx={
                      e?.socioAsociado ? { color: "#0F0" } : { color: "#00F" }
                    }
                  />
                  <p>
                    {e.nombre} {e.apellido} -{" "}
                    <span className="styleSpan">
                      {e?.socioAsociado
                        ? e?.socioAsociado.nombre
                        : e?.entidadQueRepresenta}
                    </span>
                  </p>
                  <ButtonM
                    onClick={() => removeParticipantes(e.id)}
                    startIcon={<PersonRemoveIcon />}
                  />
                </li>
              ))}
              {event.estado?.descripcion === "Activo" && (
                <li>
                  <div className="iconCopy">
                    <button
                      className="buttonCopy"
                      onClick={() => copiarUrl(urlCopy)}
                    >
                      Copiar enlace de invitación
                    </button>
                    <FiClipboard />
                  </div>
                </li>
              )}
            </ul>
          </div>
        </section>
        <section className="aligButton">
          <Link
            to="/modificar_Evento"
            state={{ stateModoEdicion: true, stateEvento: event }}
          >
            <Button style={buttonEditar} text="Editar evento" />
          </Link>
          <Button
            style={buttonEliminar}
            action={() => {
              setConfirmar(true);
            }}
            text={activar ? "Activar evento" : "Cancelar evento"}
          />
          {confirmarAlerta && (
            <AlertasConfirmar
              title="Confirmar"
              action={activar ? activarE : cancelEvent}
              actionCancelar={() => {
                setConfirmar(false);
              }}
              msjAlerta={
                activar
                  ? "¿Desea Activar el Evento?"
                  : "¿Desea Cancelar el Evento?"
              }
            ></AlertasConfirmar>
          )}
          {alertaExito && (
            <AlertasSinRedireccionar
              title="Ok"
              msjAlerta={
                activar
                  ? "Evento Cancelado con Éxito"
                  : "Evento Activado con Éxito"
              }
              action={() => {
                setAlertaExito(false);
                setConfirmar(false);
              }}
            />
          )}
        </section>
      </main>
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
    </div>
  );
};

export default Evento;
