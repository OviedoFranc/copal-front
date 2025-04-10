import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  listarEstadosReserva,
  getReservaById,
  modificarReserva,
} from "../store/reservaStore";
import State from "./State";

import {
  buttonEditar,
  buttonEliminar,
  iconElement,
  iconSuspendido,
  iconActivo,
  iconCancelado,
  iconFinalizado,
  CssTextField,
} from "../styles/stylesComponent";
import { FiUsers, FiClock } from "react-icons/fi";
import Button from "./button";
import { Cascader, AutoComplete, Select } from "antd";
const { Option } = Select;
import { object } from "zod";
import { obtenerListaRecursos } from "../store/recursoStore";
import { Alertas, AlertasConfirmar } from "./Alertas";

const EditarReserva = ({ cancelarReser }) => {
  // ALERTAS
  const [mostrarAlertaConfirmar, setMostrarAlertaConfirmar] = useState(false);
  const [mostrarAlertaCancelar, setMostrarAlertaCancelar] = useState(false);
  const [mostrarAlertaMsj, setMostrarAlertaMsj] = useState(false);
  const navigate = useNavigate();

  const {
    state: { id },
  } = useLocation();
  const [reserva, setReserva] = useState();
  // console.log(reserva);
  const [recursos, setRecursos] = useState([]);
  const [guardarModificacion, setGuardarModificacion] = useState();
  // console.log("json modificado", guardarModificacion);
  const [estados, setEstados] = useState();
  useEffect(() => {
    // getReservaById(id).then((response) => {
    //     setReserva(response);
    // });

    const fetchData = async () => {
      const rtaReservas = await getReservaById(id);
      setReserva(rtaReservas);
      const rtaRecursos = await obtenerListaRecursos();
      setRecursos(rtaRecursos.data);
      const rtaEstados = await listarEstadosReserva();
      setEstados(rtaEstados);
    };
    fetchData();
  }, []);

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
  const hora = new Date(0, 0, 0, reserva?.horaInicio[0], 0);
  const horab = new Date(0, 0, 0, 4, 30);
  let diferencia = horab - hora;
  let horas = Math.floor(diferencia / 3600000); // 1 hora = 3600000 milisegundos
  diferencia = diferencia % 3600000;
  let minutos = Math.floor(diferencia / 60000); // 1 minuto = 60000 milisegundos
  diferencia = diferencia % 60000;

  const duracion = horas + ":" + minutos;

  // console.log(guardarModificacion);

  //[reserva?.recursos?.map((object) => object.nombre)];
  const [selectedValues, setSelectedValues] = useState([]);
  const [selectEstado, setSelectEstado] = useState({});
  const [observaciones, setObservaciones] = useState("");
  useEffect(() => {
    //[ [ string ] , [string] ]
    const nombre = reserva?.recursos?.map((object) => [object.nombre]);
    setSelectedValues(nombre);
    setSelectEstado(reserva?.estadoReserva.nombre);
    setGuardarModificacion({
      ...reserva,
      recursos: reserva?.recursos?.map((obj) => obj.nombre),
    });
    setObservaciones(reserva?.observaciones || "");
  }, [reserva]);

  const estadoReserva = (valor) => {
    setSelectEstado(valor.value);

    // console.log(valor);
    setGuardarModificacion((res) => ({
      ...res,
      estadoReserva: { id: valor.key, nombre: valor.value },
    }));
  };

  const guardarObservaciones = (value) => {
    // console.log(value);
    setObservaciones(value);
    setGuardarModificacion((res) => ({
      ...res,
      observaciones: value,
    }));
  };
  const modifcacionRecurso = (value) => {
    //setSelectedValues(value.label);

    const objRecurso = value.flat();
    console.log(objRecurso);
    // const algo = objRecurso?.map((obj) => ({
    //   id: obj.value,
    //   nombre: obj.label,
    // }));
    const algo = objRecurso?.map((obj) => obj.value);
    setGuardarModificacion((res) => ({
      ...res,
      recursos: algo,
    }));
  };

  useEffect(() => {
    console.log("guardarModificacion", guardarModificacion);
  }, [guardarModificacion]);

  const option = recursos?.map((objeto) => ({
    label: objeto.nombre,
    value: objeto.nombre,
  }));

  const guardarMod = () => {
    setMostrarAlertaConfirmar(false);
    // console.log("guardando");
    // console.log(guardarModificacion);
    const reservaDTO = {
      ...guardarModificacion,
      recursos: guardarModificacion?.recursos?.map((obj) =>
        recursos?.find((rec) => rec.nombre === obj)
      ),
    };
    modificarReserva(id, reservaDTO)
      .then((response) => {
        if (response.status === 200) {
          setMostrarAlertaMsj(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //console.log(recursoDefault)
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
            <Select
              id="estado"
              bordered={false}
              className="select_dptoEvento"
              placeholder="SELECCIONAR"
              size="large"
              onSelect={(valor, obj) => {
                // console.log(obj);

                //handlerEvento("estado", valor);
                estadoReserva(obj);
              }}
              value={selectEstado}
            >
              {estados?.map(
                (estado) => (
                  <Option key={estado.id} value={estado.nombre}>
                    {estado.nombre}
                  </Option>
                ) //revisar Crear Socio de Sprint1
              )}
            </Select>
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
            <section>
              {/* observaciones */}
              {/* <h3>Observaciones</h3> */}
              <CssTextField
                id="descripcion"
                label="Observaciones"
                name="descripcion"
                value={observaciones}
                onChange={(e) => guardarObservaciones(e.target.value)}
                style={{width:"500px"}}
                variant="outlined"
                fullWidth={true}
                multiline={true}
                //rows={3}
                className=""
              />
            </section>

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
                <h3>hora Inicio</h3>
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
          <Cascader
            style={{ width: "300px" }}
            multiple
            options={option}
            onChange={(valor, obj) => {
              // Verificar si obj es un array y tiene al menos un elemento no nulo

              // obj puede ser un array no nulo o un array nulo
              setSelectedValues(valor);

              // Si obj es nulo, pasar un array vacío
              modifcacionRecurso(obj);
            }}
            maxTagCount="responsive"
            value={selectedValues}
          />
          {/* <div>
            <ul className="alinearCategoria">
              {reserva?.recursos?.map((etiqueta) => (
                <li key={etiqueta.id} className="etiquetaSocio">
                  {etiqueta.nombre}
                </li>
              ))}
            </ul>
                  </div> */}
        </section>

        <section className="botonesReserva">
          {/* botones */}
          <Button
            style={buttonEditar}
            text="Guardar Cambios"
            action={() => setMostrarAlertaConfirmar(true)}
          />
          <Button
            style={buttonEliminar}
            text="Cancelar"
            action={() => setMostrarAlertaCancelar(true)}
          />
        </section>

        {/* Alertas () => window.location.reload()*/}
        {mostrarAlertaConfirmar && (
          <AlertasConfirmar
            title={"Guardar"}
            msjAlerta={"¿Desea modificar la Reserva?"}
            action={() => guardarMod()}
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
            title="CERRAR"
            msjAlerta="Modificacion de la reserva exitosa!"
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

export default EditarReserva;
