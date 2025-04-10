import { useEffect, useState } from "react";

import Button from "../components/button";
import {
  CssTextField,
  buttonEditar,
} from "../styles/stylesComponent";
import { Cascader, Select } from "antd";
const { Option } = Select;
import { DatePicker, TimePicker } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { getDepartments } from "../store/departmentStore";
import {
  AlertasConfirmar,
  Alertas,
  AlertasSinRedireccionar,
} from "../components/Alertas";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { reservaSchema } from "../validations/crearReserva";
import { obtenerListaRecursos } from "../store/recursoStore";
import { crearReserva } from "../store/reservaStore";
import "../styles/FormReserva.css";
import { obtenerListaEspacios } from "../store/espaciosStore";
dayjs.extend(customParseFormat);

const FormReserva = () => {
  const navigate = useNavigate();

  const [newReserva, setNewReserva] = useState({
    lugar: null,
    departamento: null,
    responsable: "",
    email: "",
    descripcion: "",
    fecha: "",
    horaInicio: "",
    horaFin: "",
    recursos: [],
  });

  useEffect(() => {
    async function fetchData() {
      const rtaDepartments = await getDepartments();
      setDepartamentos(rtaDepartments);
      const rtaEspacios = await obtenerListaEspacios();
      setLugares(rtaEspacios.data);
      const rtaRecursos = await obtenerListaRecursos();
      setRecursos(rtaRecursos.data);
    }
    fetchData();
  }, []);

  //manejo de fechas y horarios
  const deshabFechasPasadas = (current) => {
    return current && current < dayjs().endOf("day");
  };

  const [deshabHoraInicio, setDeshabHoraInicio] = useState(true);
  const [desHabHoraFin, setDesHabHoraFin] = useState(true);

  const chequearHoraFin = (horaInicio, horaFin) => {
    try {
      if (
        horaInicio != "" &&
        horaFin != "" &&
        horaInicio != null &&
        horaFin != null &&
        horaInicio >= horaFin
      ) {
        throw new z.ZodError([
          {
            path: ["horaFin"],
            message: "Hora Fin debe ser mayor a Hora Inicio",
          },
          {
            path: ["horaInicio"],
            message: "Hora Inicio debe ser menor a Hora Fin",
          },
        ]);
      }
      setMsjsValidaciones({
        ...msjsValidaciones,
        horaInicio: null,
        horaFin: null,
      });
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        // console.log("err.format():", err.format());
        setMsjsValidaciones({
          ...msjsValidaciones,
          horaInicio: err.format().horaInicio,
          horaFin: err.format().horaFin,
        });
      }
      return false;
    }
  };

  //departamentos
  const [departamentos, setDepartamentos] = useState([]);

  //manejo de Recursos
  const [recursos, setRecursos] = useState([]);

  //manejo de Espacios
  const [lugares, setLugares] = useState([]);

  //manejo de todos los inputs
  const handlerReserva = (nombreCampo, valor) => {
    setNewReserva({ ...newReserva, [nombreCampo]: valor });
  };

  const handlerDepartamento = (valor) => {
    const departamento = departamentos.find(
      (departamento) => departamento.nombre === valor
    );
    setNewReserva({ ...newReserva, departamento: departamento });
  };

  const handlerEspacio = (valor) => {
    const lugar = lugares.find((lugar) => lugar.nombre === valor);
    setNewReserva({ ...newReserva, lugar: lugar });
  };

  const handlerReservaRecursos = (valor) => {
    setNewReserva((prevReserva) => ({
      ...prevReserva,
      recursos: valor.flat(),
    }));
  };

  //alertas
  const [mostrarAlertaCancelar, setMostrarAlertaCancelar] = useState(false);
  const [mostrarAlertaMsjError, setMostrarAlertaMsjError] = useState(false);

  const [mostrarAlertaMsj, setMostrarAlertaMsj] = useState(false);
  const [msjAlerta, setMsjAlerta] = useState("");
  const [ruta, setRuta] = useState("");
  const [titulo, setTitulo] = useState("");

  const [mostrarAlertaConfirmar, setMostrarAlertaConfirmar] = useState(false);

  //validaciones
  const [msjsValidaciones, setMsjsValidaciones] = useState({});

  //submits
  const handlerSubmit = (e) => {
    e.preventDefault();
    setMostrarAlertaConfirmar(true);
  };

  const confirmarSubmit = async () => {
    setMostrarAlertaConfirmar(false);
    try {
      let reservaAValidar = {
        ...newReserva,
        fecha: new Date(newReserva.fecha),
        horaInicio: new Date(newReserva.horaInicio),
        horaFin: new Date(newReserva.horaFin),
      };

      setMsjsValidaciones({});
      await reservaSchema.parseAsync(reservaAValidar);
      if(!chequearHoraFin(reservaAValidar.horaInicio, reservaAValidar.horaFin))
        throw new Error("Error en las horas");
      setMsjsValidaciones({});

      //llama a la API para cargar/modificar la reserva
      let response;

      response = await crearReserva(reservaAValidar);

      if (response.status === 201 || response.status === 200) {
        // ? const reservaCreated = response.data;

        setMsjAlerta("¡Creacion de la nueva reserva exitosa!");
        setRuta("/crearReserva");
        setTitulo("CONTINUAR");
        setMostrarAlertaMsj(true);
      } else {
        setMsjAlerta("¡Error al " + "crear nueva" + " reserva!");
        setRuta("/crearReserva");
        setTitulo("CERRAR");
        setMostrarAlertaMsj(true);
      }
    } catch (err) {
      if (err.isAxiosError) {
        console.log("err:", err);
        setMsjAlerta("¡Error al " + "crear nueva" + " reserva!");
        setRuta("/crearReserva");
        setTitulo("CERRAR");
        setMostrarAlertaMsj(true);
      } else if (err instanceof z.ZodError) {
        console.log("err.format():", err.format());
        setMsjsValidaciones(err.format());
        setMostrarAlertaMsjError(true);
      } else {
        console.log("err:", err);
        setMsjAlerta("¡Error al " + "crear nueva" + " reserva!");
        setRuta("/crearReserva");
        setTitulo("CERRAR");
        setMostrarAlertaMsj(true);
      }
    }
  };

  const option = recursos.map((objeto) => ({
    label: objeto.nombre,
    value: objeto.nombre,
  }));

  useEffect(() => {
    console.log("newReserva:", newReserva);
  }, [newReserva]);

  useEffect(() => {
    console.log("msjsValidaciones:", msjsValidaciones);
  }, [msjsValidaciones]);

  return (
    <main className="main_formReserva">
      <div className="container_formReserva">
        <h2 className="h2_formReserva">Reserva de Espacios colaborativos</h2>
        <form onSubmit={handlerSubmit}>
          <div className="div_dptoReserva">
            <label htmlFor="lugar" className="label_dptoReserva">
              Seleccionar Espacio:
            </label>
            <Select
              id="lugar"
              bordered={false}
              className="select_dptoReserva"
              placeholder="SELECCIONAR"
              size="large"
              onSelect={(valor) => {
                handlerEspacio(valor);
              }}
              value={newReserva.lugar?.nombre}
            >
              {lugares?.map((lugar) => (
                <Option key={lugar.id} value={lugar.nombre}>
                  {lugar.nombre}
                </Option>
              ))}
            </Select>
            <p className="error">
              {msjsValidaciones.lugar && msjsValidaciones.lugar._errors[0]}
            </p>
          </div>
          <div className="div_dptoReserva">
            <label htmlFor="departamento" className="label_dptoReserva">
              Departamento a cargo:
            </label>
            <Select
              id="departamento"
              bordered={false}
              className="select_dptoReserva"
              placeholder="SELECCIONAR"
              size="large"
              onSelect={(valor) => {
                handlerDepartamento(valor);
              }}
              value={newReserva.departamento?.nombre}
            >
              {departamentos?.map((departamento) => (
                <Option key={departamento.id} value={departamento.nombre}>
                  {departamento.nombre}
                </Option>
              ))}
            </Select>
            <p className="error">
              {msjsValidaciones.departamento &&
                msjsValidaciones.departamento._errors[0]}
            </p>
          </div>
          <div className="div_estado_modalidad">
            <div className="div_dptoReserva">
              <label htmlFor="responsable" className="label_dptoReserva">
                Nombre Responsable:
              </label>
              <CssTextField
                id="responsable"
                label="Nombre Responsable"
                name="responsable"
                size="small"
                value={newReserva.responsable}
                onChange={(e) => handlerReserva(e.target.name, e.target.value)}
                variant="outlined"
              />
              <p className="error">
                {msjsValidaciones.responsable &&
                  msjsValidaciones.responsable._errors[0]}
              </p>
            </div>
            <div className="div_dptoReserva">
              <label htmlFor="email" className="label_dptoReserva">
                Email Solicitante:
              </label>
              <CssTextField
                id="email"
                label="Email Solicitante"
                name="email"
                size="small"
                value={newReserva.email}
                onChange={(e) => handlerReserva(e.target.name, e.target.value)}
                variant="outlined"
              />
              <p className="error">
                {msjsValidaciones.email && msjsValidaciones.email._errors[0]}
              </p>
            </div>
          </div>

          <div className="div_descripcion_fechas">
            <div className="div_descripcionReserva">
              <label htmlFor="descripcion" className="label_dptoReserva">
                Descripción:
              </label>
              <CssTextField
                id="descripcion"
                label="Descripción del Reserva"
                name="descripcion"
                value={newReserva.descripcion}
                onChange={(e) => handlerReserva(e.target.name, e.target.value)}
                variant="outlined"
                fullWidth={true}
                multiline={true}
                rows={3}
                className="input_descripcionReserva"
              />
              <p className="error">
                {msjsValidaciones.descripcion &&
                  msjsValidaciones.descripcion._errors[0]}
              </p>
            </div>
            <div className="div_fechas">
              <div className="div_unaFecha">
                <div className="fechaInicioReserva">
                  <label htmlFor="fecha" className="label_dptoReserva">
                    Fecha:
                  </label>
                  <DatePicker
                    id="fecha"
                    value={newReserva.fecha}
                    placeholder="Fecha"
                    onChange={(date) => {
                      setDeshabHoraInicio(false);
                      handlerReserva("fecha", date);
                    }}
                    format={"DD/MM/YYYY"}
                    disabledDate={deshabFechasPasadas}
                    size="large"
                    showToday={false}
                    className="input_fecha"
                  />
                  <p className="error">
                    {msjsValidaciones.fecha &&
                      msjsValidaciones.fecha._errors[0]}
                  </p>
                </div>
              </div>
              <div className="div_unaFecha">
                <div className="">
                  <label htmlFor="horaInicio" className="label_dptoReserva">
                    Hora Inicio:
                  </label>
                  <TimePicker
                    id="horaInicio"
                    disabled={deshabHoraInicio}
                    value={newReserva.horaInicio}
                    placeholder="Hora Inicio"
                    onChange={(time) => {
                      setDesHabHoraFin(false);
                      handlerReserva("horaInicio", time);
                      chequearHoraFin(time, newReserva.horaFin);
                    }}
                    format={"HH:mm"}
                    size="large"
                    showNow={false}
                    className="input_fecha"
                  />
                  <p className="error">
                    {msjsValidaciones.horaInicio &&
                      msjsValidaciones.horaInicio._errors[0]}
                  </p>
                </div>
                <div className="">
                  <label htmlFor="horaFin" className="label_dptoReserva">
                    Hora Fin:
                  </label>
                  <TimePicker
                    id="horaFin"
                    disabled={desHabHoraFin}
                    value={newReserva.horaFin}
                    placeholder="Hora Fin"
                    onChange={(time) => {
                      handlerReserva("horaFin", time);
                      chequearHoraFin(newReserva.horaInicio, time);
                    }}
                    format={"HH:mm"}
                    size="large"
                    showNow={false}
                    className="input_fecha"
                  />
                  <p className="error">
                    {msjsValidaciones.horaFin &&
                      msjsValidaciones.horaFin._errors[0]}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="div_recursosReserva">
            <label htmlFor="recursos" className="label_dptoReserva">
              Seleccionar Recursos:
            </label>

            <Cascader
              style={{ width: "300px" }}
              maxTagCount="responsive"
              onChange={handlerReservaRecursos}
              options={option}
              placeholder="SELECCIONAR"
              multiple
            />

            <p className="error">
              {msjsValidaciones.recursos &&
                msjsValidaciones.recursos._errors[0]}
            </p>
          </div>
        </form>

        <div className="buttonAling_eventos">
          <Button
            style={buttonEditar}
            text={"CREAR RESERVA"}
            action={handlerSubmit}
            className="buttonFormDpto"
          />
        </div>
      </div>

      {/* Alertas */}
      {mostrarAlertaConfirmar && (
        <AlertasConfirmar
          title={"CREAR"}
          msjAlerta={"¿Desea crear la Reserva?"}
          action={() => confirmarSubmit()}
          actionCancelar={() => setMostrarAlertaConfirmar(false)}
        />
      )}
      {mostrarAlertaCancelar && (
        <AlertasConfirmar
          title="SI"
          msjAlerta={"¿Desea cancelar la creacion de la Reserva?"}
          action={() => navigate("/reservas")}
          actionCancelar={() => setMostrarAlertaCancelar(false)}
        />
      )}
      {mostrarAlertaMsj && (
        <Alertas
          title={titulo}
          msjAlerta={msjAlerta}
          ruta={ruta}
          action={() => window.location.reload()}
        />
      )}
      {mostrarAlertaMsjError && (
        <AlertasSinRedireccionar
          title="CERRAR"
          msjAlerta="¡Complete todos los campos requeridos!"
          action={() => setMostrarAlertaMsjError(false)}
        />
      )}

      <img
        className={"img-fondo"}
        src={"../src/assets/img-fondo.svg"}
        style={{ left: "-150px", top: "200px" }}
      ></img>

      <img
        className={"img-fondo"}
        src={"../src/assets/img-fondo.svg"}
        style={{ right: "-100px", top: "500px" }}
      ></img>
    </main>
  );
};

FormReserva.propTypes = {};

export default FormReserva;
