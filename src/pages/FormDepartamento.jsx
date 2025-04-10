import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import {ZodError} from "zod";
import "../styles/FormDepartamento.css";
import { cargarAutoridad, departmentStore } from "../store/departmentStore";

import { departmentSchema } from "../validations/crearDepartamento.js";
import { subirImagenDpto } from "../store/imagesStore";
import { AlertasConfirmar, Alertas } from "../components/Alertas";
import Button from "../components/button";
import { buttonEditar, buttonEliminar } from "../styles/stylesComponent";

import AuthoritiesSelector from "../components/formDpto/AuthoritiesSelector";
import Box from "@mui/material/Box";

import TextField from "@mui/material/TextField";
import { setTitle } from "../utils/const";
import { inputText, inputObjetivos } from "../styles/stylesComponent";

const FormDepartamento = ({ accion }) => {
  const navigate = useNavigate();

  //imagenes
  const [imagenPrevisualizacion, setImagenPrevisualizacion] = useState(
    "../src/assets/agregarImgDefault.png"
  );

  const handlerCambioImagen = (evento) => {
    const imagenSeleccionada = evento.target.files[0];
    if (imagenSeleccionada) {
      setImagenPrevisualizacion(imagenSeleccionada);
      const lector = new FileReader();
      lector.onloadend = () => {
        setImagenPrevisualizacion(lector.result);
      };
      lector.readAsDataURL(imagenSeleccionada);
    }
  };

  if (accion === "modificar") {
    setTitle("Modificar Departamento");
  } else if (accion === "crear") {
    setTitle("Agregar Departamento");
  }

  //funcion para agregar un nuevo departamento
  const addDepartment = departmentStore((state) => state.addDepartment);

  //alertas
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [msjAlerta, setMsjAlerta] = useState("");
  const [ruta, setRuta] = useState("");
  const [titulo, setTitulo] = useState("");

  const [mostrarAlertaConfirmar, setMostrarAlertaConfirmar] = useState(false);

  //datos por defecto
  const [newDepartment, setNewDepartment] = useState({
    name: "",
    logo: "",
    objective: "",
    estado: "activo",
  });

  const [autoridades, setAutoridades] = useState([]);

  const [formError, setFormError] = useState({});

  const handlerSubmit = async (e) => {
    e.preventDefault();
    setMostrarAlertaConfirmar(true);
  };

  const confirmacionSubmit = async () => {
    setMostrarAlertaConfirmar(false);
    try {
      console.log({ ...newDepartment, autoridades: autoridades });
      await departmentSchema.parseAsync({
        ...newDepartment,
        autoridades: autoridades,
      });
      setFormError({});

      //llama a la API para cargar el dpto
      const response = await addDepartment(newDepartment);

      if (response.status === 201) {
        const departamentCreated = response.data;

        //carga las autoridades
        cargarAutoridad(departamentCreated.id, autoridades);

        //carga la imagen
        const inputImagen = document.getElementById("imagenId");
        await subirImagenDpto(departamentCreated.id, inputImagen.files[0]);

        setMsjAlerta("¡Creacion de nuevo departamento exitosa!");
        setRuta("/departamentos");
        setTitulo("CONTINUAR");
        setMostrarAlerta(true);
      } else {
        setMsjAlerta("¡Error al crear nuevo departamento!");
        setRuta("/crearDepartamento");
        setTitulo("CERRAR");
        setMostrarAlerta(true);
      }

      setNewDepartment({
        name: "",
        logo: "",
        objective: "",
        estado: "activo",
      });
      setAutoridades([]);
      setImagenPrevisualizacion("../src/assets/agregarImgDefault.svg");
    } catch (err) {
      if (err.isAxiosError) {
        console.log(err);
        setMsjAlerta("¡Error al crear nuevo departamento!");
        setRuta("/crearDepartamento");
        setTitulo("CERRAR");
        setMostrarAlerta(true);
      } else if (err instanceof ZodError) {
        console.log(err.format());
        setFormError(err.format());
        setMsjAlerta("¡Complete todos los campos requeridos!");
        setRuta("/crearDepartamento");
        setTitulo("CERRAR");
        setMostrarAlerta(true);
      } else {
        console.log(err);
      }
    }
  };

  // handlers de los inputs
  const handlerDepartamento = (name, value) => {
    setNewDepartment({
      ...newDepartment,
      [name]: value,
    });
  };

  const handlerAutoridad = (index, name, value) => {
    const newAutoridades = [...autoridades];
    newAutoridades[index] = {
      ...newAutoridades[index],
      [name]: value,
    };
    setAutoridades(newAutoridades);
  };

  const handlerNewAutoridad = (name, value) => {
    setAutoridades([...autoridades, { [name]: value }]);
  };

  return (
    <main className="body-allSocios">
      <div className="container_formDpto">
        <h2 className="h2FormDpto">Crear Departamento</h2>
        <form onSubmit={handlerSubmit} className="formDpto">
          <div className="divImgCrear">
            <label htmlFor="imagenId" style={{ height: "100%" }}>
              <img
                src={imagenPrevisualizacion}
                alt="hola"
                style={{ width: "auto", height: "100%" }}
              />
              <input
                className="input-user"
                type="file"
                name="logo"
                id="imagenId"
                onChange={(e) => {
                  handlerDepartamento(e.target.name, e.target.files[0].name);
                  handlerCambioImagen(e);
                }}
                placeholder="Logo del socio"
                style={{ display: "none" }}
              />
            </label>
            <p className="error">
              {formError.logo && formError.logo._errors[0]}
            </p>
          </div>

          <div className="inputName">
            <TextField
              id="name"
              label="Nombre Departamento"
              variant="outlined"
              name="name"
              value={newDepartment.name}
              onChange={(e) =>
                handlerDepartamento(e.target.name, e.target.value)
              }
              style={inputText}
            />
            <p className="error">
              {formError.name && formError.name._errors[0]}
            </p>
          </div>

          <div className="inputObjetivo">
            <label htmlFor="objective" className="labelCampo">
              Objetivo:
            </label>
            <TextField
              label="Describa los objetivos de este departamento"
              value={newDepartment.objective}
              name="objective"
              id="objective"
              onChange={(e) =>
                handlerDepartamento(e.target.name, e.target.value)
              }
              //estilos
              variant="outlined"
              fullWidth={true}
              multiline={true}
              rows={4}
              style={inputObjetivos}
              className="TextFieldObjetivos"
            />
            <p className="error">
              {formError.objective && formError.objective._errors[0]}
            </p>
          </div>

          <AuthoritiesSelector
            handlerAutoridad={handlerAutoridad}
            handlerNewAutoridad={handlerNewAutoridad}
            autoridades={autoridades}
            formError={formError}
          ></AuthoritiesSelector>
        </form>

        <div className="buttonAling" style={{ paddingTop: "20px" }}>
          <Button
            style={buttonEditar}
            text="CREAR DEPARTAMENTO"
            action={handlerSubmit}
            className="buttonFormDpto"
          />
          <Button
            style={buttonEliminar}
            text="CANCELAR"
            action={() => navigate("/departamentos")}
            className="buttonFormDpto"
          />
        </div>
      </div>

      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 1, width: "25ch" },
        }}
        noValidate
        autoComplete="off"
      ></Box>

      {mostrarAlertaConfirmar && (
        <AlertasConfirmar
          title="CREAR"
          msjAlerta="¿Desea crear el departamento?"
          action={() => confirmacionSubmit()}
          actionCancelar={() => setMostrarAlertaConfirmar(false)}
        />
      )}
      {mostrarAlerta && (
        <Alertas
          title={titulo}
          msjAlerta={msjAlerta}
          ruta={ruta}
          action={() => setMostrarAlerta(false)}
        />
      )}

      <img
        className={"img-fondo"}
        src={"../src/assets/img-fondo.svg"}
        style={{ left: "-150px", top: "100px" }}
      ></img>

      <img
        className={"img-fondo"}
        src={"../src/assets/img-fondo.svg"}
        style={{ right: "-150px", top: "400px" }}
      ></img>
    </main>
  );
};

FormDepartamento.propTypes = {
  accion: PropTypes.string,
};

export default FormDepartamento;
