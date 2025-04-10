import { useEffect, useState } from "react";

import "../styles/FormEvento.css";
import Button from "../components/button";
import {
  CssTextField,
  buttonEditar,
  buttonEliminar,
} from "../styles/stylesComponent";
import { AutoComplete, Select } from "antd";
const { Option } = Select;
import { DatePicker, TimePicker } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  ObtenerPlataformaApi,
  addEvento,
  editEvento,
  obtenerEstadosEvento,
  obtenerModalidadesEvento,
} from "../store/eventoStore";
import { getDepartments } from "../store/departmentStore";
import {
  AlertasConfirmar,
  Alertas,
  AlertasSinRedireccionar,
} from "../components/Alertas";
import * as z from "zod";
import {
  ObtenerLocalidadApi,
  ObtenerProvinciaApi,
} from "../store/provinciasYLocalidadesStore";
import { useLocation, useNavigate } from "react-router-dom";
import {
  eventoSchema,
  validarUbicacionesEvento,
} from "../validations/crearEvento";
dayjs.extend(customParseFormat);

const FormEvento = () => {
  const navigate = useNavigate();

  const {
    state: { stateModoEdicion, stateEvento },
  } = useLocation();

  const [modoEdicion, setModoEdicion] = useState(false);

  const [newEvento, setNewEvento] = useState({
    id: "",
    codigoUUID: "",
    nombre: "",
    departamento: null,
    descripcion: "",
    estado: null,
    modalidad: null,
    fechaInicio: null,
    horaInicio: null,
    fechaFin: null,
    horaFin: null,

    ubicacion: {
      provincia: null,
      localidad: null,
      direccion: "",
      calle: "",
      altura: "",
      piso: "",
    },

    plataforma: null,
    linkReunion: "",

    participantes: null,
  });

  useEffect(() => {
    async function fetchData() {
      const departments = await getDepartments();
      setDepartamentos(departments);
      const provincias = await ObtenerProvinciaApi();
      setArrayProvincias(provincias);
      const estados = await obtenerEstadosEvento();
      setEstados(estados);
      const modalidades = await obtenerModalidadesEvento();
      setModalidades(modalidades);
      const plataformas = await ObtenerPlataformaApi();
      setPlataformas(plataformas);
    }
    fetchData();

    //evaluar si es modo edicion o modo creacion
    if (stateModoEdicion == true) {
      setModoEdicion(true);
    } else {
      setModoEdicion(false);
    }
  }, []);

  //cargar datos del evento a editar en caso de que sea modo edicion
  useEffect(() => {
    if (modoEdicion === true) {
      const horaInicio = dayjs()
        .set("hour", stateEvento.horaInicio[0])
        .set("minute", stateEvento.horaInicio[1]);

      const horaFin = dayjs()
        .set("hour", stateEvento.horaFin[0])
        .set("minute", stateEvento.horaFin[1]);
        
      let eventoAModificar = {};

      eventoAModificar = {
        ...eventoAModificar,
        id: stateEvento.id,
        codigoUUID: stateEvento.codigoUUID,
        nombre: stateEvento.nombre,
        departamento: stateEvento.departamento.nombre,
        descripcion: stateEvento.descripcion,
        estado: stateEvento.estado.descripcion,
        modalidad: stateEvento.modalidad,

        fechaInicio: dayjs(stateEvento.fechaInicio),
        fechaFin: dayjs(stateEvento.fechaFin),
        horaInicio: dayjs(horaInicio, "HH:mm"),
        horaFin: dayjs(horaFin, "HH:mm"),

        participantes: stateEvento.participantes,
      };

      if (
        stateEvento.modalidad === "PRESENCIAL" ||
        stateEvento.modalidad === "HIBRIDA"
      ) {
        eventoAModificar = {
          ...eventoAModificar,
          ubicacion: {
            provincia: stateEvento.ubicacion.provincia,
            localidad: stateEvento.ubicacion.localidad,
            direccion: stateEvento.ubicacion.direccion,
            piso: stateEvento.ubicacion.piso,
          },
        };

        habilitarLocalidad(stateEvento.ubicacion.provincia);
        setFiltro(stateEvento.ubicacion.localidad);
      }

      if (
        stateEvento.modalidad === "VIRTUAL" ||
        stateEvento.modalidad === "HIBRIDA"
      ) {
        eventoAModificar = {
          ...eventoAModificar,
          plataforma: stateEvento.plataforma,
          linkReunion: stateEvento.linkReunion,
        };
      }

      setNewEvento({
        ...newEvento,
        ...eventoAModificar,
      });

      handleModalidad(stateEvento.modalidad);
      setDeshabHoraInicio(false);
      setDesHabFechaFin(false);
      setDesHabHoraFin(false);
    }
  }, [modoEdicion]);

  //manejo de fechas y horarios
  const deshabFechasPasadas = (current) => {
    return current && current < dayjs().endOf("day");
  };

  const deshabFechasFin = (current) => {
    return current && current < newEvento.fechaInicio;
  };

  const [deshabHoraInicio, setDeshabHoraInicio] = useState(true);
  const [desHabFechaFin, setDesHabFechaFin] = useState(true);
  const [desHabHoraFin, setDesHabHoraFin] = useState(true);

  //estados
  const [estados, setEstados] = useState([]);

  //modalidades
  const [modalidades, setModalidades] = useState([]);

  const [mostrarUbiPresencial, setMostrarUbiPresencial] = useState(false);
  const [mostrarUbiVirtual, setMostrarUbiVirtual] = useState(false);

  const handleModalidad = (valor) => {
    setMostrarUbiPresencial(valor === "PRESENCIAL" || valor === "HIBRIDA");
    setMostrarUbiVirtual(valor === "VIRTUAL" || valor === "HIBRIDA");
  };

  //departamentos
  const [departamentos, setDepartamentos] = useState([]);

  //manejo de Provincia y Localidad
  const [ArrayProvincias, setArrayProvincias] = useState([]);
  const [localidadEstado, setLocalidadEstado] = useState(true);
  const habilitarLocalidad = async (provincia) => {
    const localidades = await ObtenerLocalidadApi(provincia);
    setArrayLocalidades(localidades);
    setLocalidadEstado(false);
  };

  const [ArrayLocalidades, setArrayLocalidades] = useState([]);

  const [filtro, setFiltro] = useState("");
  const nombresFiltrados = ArrayLocalidades
    ? ArrayLocalidades.filter((localidad) =>
        localidad
          .toLowerCase()
          .split(" ")
          .some((palabra) => palabra.startsWith(filtro.toLowerCase()))
      )
    : [];

  //manejo de Plataforma
  const [plataformas, setPlataformas] = useState([]);

  //manejo de todos los inputs
  const handlerEvento = (name, value) => {
    setNewEvento({ ...newEvento, [name]: value });
  };

  const handlerLugar = (name, value) => {
    setNewEvento({
      ...newEvento,
      ubicacion: { ...newEvento.ubicacion, [name]: value },
    });
  };
  //alrtas
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
      let eventoAValidar = {
        ...newEvento,
        fechaInicio: new Date(newEvento.fechaInicio),
        fechaFin: new Date(newEvento.fechaFin),
        horaInicio: new Date(newEvento.horaInicio),
        horaFin: new Date(newEvento.horaFin),
      };

      await eventoSchema.parseAsync(eventoAValidar);
      validarUbicacionesEvento(eventoAValidar);
      setMsjsValidaciones({});

      //llama a la API para cargar/modificar el dpto
      let response;
      if (modoEdicion === false) {
        response = await addEvento(eventoAValidar);
      } else {
        //transformo departamento para el formato de editar
        eventoAValidar = {
          ...eventoAValidar,
          departamento: {
            nombre: eventoAValidar.departamento,
          },
          estado: {
            descripcion: eventoAValidar.estado,
          },
        };

        response = await editEvento(eventoAValidar);
      }

      if (response.status === 201 || response.status === 200) {
        setMsjAlerta(
          modoEdicion
            ? "¡Modificacion de evento exitosa!"
            : "¡Creacion de nuevo evento exitosa!"
        );
        setMostrarAlertaMsj(true);
      } else {
        setMsjAlerta(
          "¡Error al " +
            (modoEdicion ? "modificar el" : "crear nuevo") +
            " evento!"
        );
        setTitulo("CERRAR");
        setMostrarAlertaMsj(true);
      }

    } catch (err) {
      if (err.isAxiosError) {
        console.log("err:", err);
        setMsjAlerta(
          "¡Error al " +
            (modoEdicion ? "modificar el" : "crear nuevo") +
            " evento!"
        );
        setRuta("/crearEvento");
        setTitulo("CERRAR");
        setMostrarAlertaMsj(true);
      } else if (err instanceof z.ZodError) {
        console.log("err.format():", err.format());
        setMsjsValidaciones(err.format());
        setMostrarAlertaMsjError(true);
      }
    }
  };

  return (
    <main className="main_formEvento">
      <div className="container_formEvento">
        {/* <h2 className="h2_formEvento">Crear Evento</h2> */}
        <form onSubmit={handlerSubmit} className="formEvento">
          <div className="div_nombreEvento">
            <CssTextField
              id="nombre"
              label="Título del Evento"
              name="nombre"
              value={newEvento.nombre}
              onChange={(e) => handlerEvento(e.target.name, e.target.value)}
              variant="outlined"
              className="input_nombreEvento"
            />
            <p className="error">
              {msjsValidaciones.nombre && msjsValidaciones.nombre._errors[0]}
            </p>
          </div>
          <div className="div_dptoEvento">
            <label htmlFor="departamento" className="label_dptoEvento">
              Departamento a cargo:
            </label>
            <Select
              id="departamento"
              bordered={false}
              className="select_dptoEvento"
              placeholder="SELECCIONAR"
              size="large"
              onSelect={(valor) => {
                handlerEvento("departamento", valor);
              }}
              value={newEvento.departamento}
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
            <div className="div_dptoEvento">
              <label htmlFor="estado" className="label_dptoEvento">
                Estado:
              </label>
              <Select
                id="estado"
                bordered={false}
                className="select_dptoEvento"
                placeholder="SELECCIONAR"
                size="large"
                onSelect={(valor) => {
                  handlerEvento("estado", valor);
                }}
                value={newEvento.estado}
              >
                {estados?.map((estado) => (
                  <Option key={estado} value={estado}>
                    {estado}
                  </Option> //revisar Crear Socio de Sprint1
                ))}
              </Select>
              <p className="error">
                {msjsValidaciones.estado && msjsValidaciones.estado._errors[0]}
              </p>
            </div>
            <div className="div_dptoEvento">
              <label htmlFor="modalidad" className="label_dptoEvento">
                Modalidad:
              </label>
              <Select
                id="modalidad"
                bordered={false}
                className="select_dptoEvento"
                placeholder="SELECCIONAR"
                size="large"
                onSelect={(valor) => {
                  handlerEvento("modalidad", valor);
                  handleModalidad(valor);
                }}
                value={newEvento.modalidad}
              >
                {modalidades?.map((modalidad) => (
                  <Option key={modalidad} value={modalidad}>
                    {modalidad}
                  </Option> //revisar Crear Socio de Sprint1
                ))}
              </Select>
              <p className="error">
                {msjsValidaciones.modalidad &&
                  msjsValidaciones.modalidad._errors[0]}
              </p>
            </div>
          </div>

          <div className="div_descripcion_fechas">
            <div className="div_descripcionEvento">
              <label htmlFor="descripcion" className="label_dptoEvento">
                Descripción:
              </label>
              <CssTextField
                id="descripcion"
                label="Descripción del Evento"
                name="descripcion"
                value={newEvento.descripcion}
                onChange={(e) => handlerEvento(e.target.name, e.target.value)}
                variant="outlined"
                fullWidth={true}
                multiline={true}
                rows={2}
                className="input_descripcionEvento"
              />
              <p className="error">
                {msjsValidaciones.descripcion &&
                  msjsValidaciones.descripcion._errors[0]}
              </p>
            </div>
            <div className="div_fechas">
              <div className="div_unaFecha">
                <div className="">
                  <label htmlFor="fechaInicio" className="label_dptoEvento">
                    Fecha Inicio:
                  </label>
                  <DatePicker
                    id="fechaInicio"
                    value={newEvento.fechaInicio}
                    placeholder="Fecha Inicio"
                    onChange={(date) => {
                      setDeshabHoraInicio(false);
                      handlerEvento("fechaInicio", date);
                    }}
                    format={"DD/MM/YYYY"}
                    disabledDate={deshabFechasPasadas}
                    size="large"
                    showToday={false}
                    className="input_fecha"
                  />
                  <p className="error">
                    {msjsValidaciones.fechaInicio &&
                      msjsValidaciones.fechaInicio._errors[0]}
                  </p>
                </div>
                <div className="">
                  <label htmlFor="horaInicio" className="label_dptoEvento">
                    Hora Inicio:
                  </label>
                  <TimePicker
                    id="horaInicio"
                    disabled={deshabHoraInicio}
                    value={newEvento.horaInicio}
                    placeholder="Hora Inicio"
                    onChange={(time) => {
                      setDesHabFechaFin(false);
                      handlerEvento("horaInicio", time);
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
              </div>
              <div className="div_unaFecha">
                <div className="">
                  <label htmlFor="fechaFin" className="label_dptoEvento">
                    Fecha Fin:
                  </label>
                  <DatePicker
                    id="fechaFin"
                    disabled={desHabFechaFin}
                    value={newEvento.fechaFin}
                    placeholder="Fecha Fin"
                    onChange={(date) => {
                      setDesHabHoraFin(false);
                      handlerEvento("fechaFin", date);
                    }}
                    format={"DD/MM/YYYY"}
                    disabledDate={deshabFechasFin}
                    size="large"
                    showToday={false}
                    className="input_fecha"
                  />
                  <p className="error">
                    {msjsValidaciones.fechaFin &&
                      msjsValidaciones.fechaFin._errors[0]}
                  </p>
                </div>
                <div className="">
                  <label htmlFor="horaFin" className="label_dptoEvento">
                    Hora Fin:
                  </label>
                  <TimePicker
                    id="horaFin"
                    disabled={desHabHoraFin}
                    value={newEvento.horaFin}
                    placeholder="Hora Fin"
                    onChange={(time) => handlerEvento("horaFin", time)}
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

          <div className="div_ubicacion">
            <p className="label_dptoEvento">Ubicación:</p>
            {mostrarUbiPresencial && (
              <div className="div_ubiPresencial">
                <div className="">
                  <label htmlFor="provincia">Provincia:</label>
                  <Select
                    id="provincia"
                    className="input_plataforma"
                    style={{ width: "223px" }}
                    placeholder="SELECCIONAR"
                    size="large"
                    bordered={false}
                    onSelect={(valor) => {
                      handlerLugar("provincia", valor);
                      habilitarLocalidad(valor);
                      setFiltro("");
                    }}
                    value={newEvento.ubicacion.provincia}
                  >
                    {ArrayProvincias?.map((prov) => (
                      <Option key={prov} value={prov}>
                        {prov}
                      </Option> //revisar Crear Socio de Sprint1
                    ))}
                  </Select>
                  <p className="error">
                    {msjsValidaciones.ubicacion?.provincia &&
                      msjsValidaciones.ubicacion?.provincia._errors[0]}
                  </p>
                </div>
                <div className="">
                  <label htmlFor="localidad">Localidad:</label>
                  <AutoComplete
                    id="localidad"
                    className="input_plataforma"
                    placeholder="Localidad"
                    size="large"
                    bordered={false}
                    style={{ width: "223px", textTransform: "lowercase" }}
                    disabled={localidadEstado}
                    onSearch={(valor) => setFiltro(valor)}
                    options={(nombresFiltrados || []).map((localidad) => ({
                      value: localidad,
                      label: localidad,
                    }))}
                    onSelect={(valor) => {
                      handlerLugar("localidad", valor);
                      setFiltro(valor);
                    }}
                    value={filtro}
                  ></AutoComplete>
                  <p className="error">
                    {msjsValidaciones.ubicacion?.localidad &&
                      msjsValidaciones.ubicacion?.localidad._errors[0]}
                  </p>
                </div>
                <div className="">
                  <label htmlFor="direccion">Dirección:</label>
                  <CssTextField
                    id="direccion"
                    label="Dirección"
                    name="direccion"
                    size="small"
                    value={newEvento.ubicacion.direccion}
                    onChange={(e) =>
                      handlerLugar(e.target.name, e.target.value)
                    }
                    variant="outlined"
                    //className="input_fecha"
                  />
                  <p className="error">
                    {msjsValidaciones.ubicacion?.direccion &&
                      msjsValidaciones.ubicacion?.direccion._errors[0]}
                  </p>
                </div>
                <div className="">
                  <label htmlFor="piso">Piso:</label>
                  <CssTextField
                    id="piso"
                    label="Piso"
                    name="piso"
                    size="small"
                    value={newEvento.ubicacion.piso}
                    onChange={(e) =>
                      handlerLugar(e.target.name, e.target.value)
                    }
                    variant="outlined"
                    // className="input_fecha"
                  />
                  <p className="error">
                    {msjsValidaciones.lugar?.piso &&
                      msjsValidaciones.lugar?.piso._errors[0]}
                  </p>
                </div>
              </div>
            )}
            {mostrarUbiVirtual && (
              <div className="div_ubiVirtual">
                <div className="">
                  <label htmlFor="plataforma">Plataforma:</label>
                  <Select
                    id="plataforma"
                    className="input_plataforma"
                    style={{ width: "223px", borderRadius: "5px" }}
                    placeholder="SELECCIONAR"
                    bordered={false}
                    size="large"
                    onSelect={(valor) => {
                      habilitarLocalidad();
                      handlerEvento("plataforma", valor);
                    }}
                    value={newEvento.plataforma}
                  >
                    {plataformas?.map((plat) => (
                      <Option key={plat} value={plat}>
                        {plat}
                      </Option> //revisar Crear Socio de Sprint1
                    ))}
                  </Select>
                  <p className="error">
                    {msjsValidaciones.plataforma &&
                      msjsValidaciones.plataforma._errors[0]}
                  </p>
                </div>
                <div className="">
                  <label htmlFor="linkReunion">Link Reunión:</label>
                  <CssTextField
                    size="small"
                    id="linkReunion"
                    label="Link Reunión"
                    name="linkReunion"
                    value={newEvento.linkReunion}
                    onChange={(e) =>
                      handlerEvento(e.target.name, e.target.value)
                    }
                    variant="outlined"
                    //className="input_fecha"
                  />
                  <p className="error">
                    {msjsValidaciones.linkReunion &&
                      msjsValidaciones.linkReunion._errors[0]}
                  </p>
                </div>
              </div>
            )}
          </div>
        </form>

        <div className="buttonAling_eventos">
          <Button
            style={buttonEditar}
            text={modoEdicion ? "GUARDAR CAMBIOS" : "CREAR EVENTO"}
            action={handlerSubmit}
            className="buttonFormDpto"
          />
          <Button
            style={buttonEliminar}
            text="CANCELAR"
            action={() => setMostrarAlertaCancelar(true)}
            className="buttonFormDpto"
          />
        </div>
      </div>

      {/* Alertas */}
      {mostrarAlertaConfirmar && (
        <AlertasConfirmar
          title={modoEdicion ? "GUARDAR" : "CREAR"}
          msjAlerta={
            "¿Desea " + (modoEdicion ? "guardar" : "crear") + " el Evento?"
          }
          action={async () => {
            await confirmarSubmit();
            navigate("/eventos");
          }}
          actionCancelar={() => setMostrarAlertaConfirmar(false)}
        />
      )}
      {mostrarAlertaCancelar && (
        <AlertasConfirmar
          title="SI"
          msjAlerta={
            "¿Desea cancelar la " +
            (modoEdicion ? "modificacion" : "creacion") +
            " del Evento?"
          }
          action={() => navigate("/eventos")}
          actionCancelar={() => setMostrarAlertaCancelar(false)}
        />
      )}
      {mostrarAlertaMsj && (
        <Alertas
          title={titulo}
          msjAlerta={msjAlerta}
          ruta={ruta}
          action={() => setMostrarAlertaMsj(false)}
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

FormEvento.propTypes = {};

export default FormEvento;