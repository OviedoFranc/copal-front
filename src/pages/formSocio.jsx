import { useEffect, useState } from "react";
import { typeSociosStore } from "../store/typeSociosStore"; //IMPORTANTE PARA ESTADOS GLOBALES
import { sociosStore } from "../store/sociosStore"; //IMPORTANTE PARA ESTADOS GLOBALES
import { AreasForm } from "../components/AreasForm";
import { useNavigate } from "react-router-dom"; // IMPORTANTE PARA EL FUNCIONAMIENTO DE LA REDIRECCION
import "../styles/formSocio.css";
import { socioSchema } from "../validations/alta.js";
import { subirImagenSocio } from "../store/imagesStore";
import * as z from "zod";
import { getEtiquetas } from "../store/areasStore";

const FormSocio = () => {
  const { addSocio } = sociosStore();
  const [areas, setAreas] = useState([]);
  const [tiposSocios, setTiposSocios] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      await typeSociosStore.getState().getTypeSocios();
      const typeSocios = typeSociosStore.getState().typeSocios;
      const etiquetas = await getEtiquetas();

      setTiposSocios(typeSocios);
      setAreas(etiquetas);
    }

    fetchData();
  }, []);

  const [mostrarRta, setMostrarRta] = useState(false);
  const [newSocio, setNewSocio] = useState({
    name: "",
    presidente: "",
    category: {},
    etiquetas: [],
    phone: "",
    mail: "",
    web: "",
    dateUnion: "",
    cuit: "",
  });

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

  const [formError, setFormError] = useState({});

  async function handlerSubmit(e) {
    e.preventDefault();
    try {
      const inputImagen = document.getElementById("imagenId");
      if (!inputImagen.files[0]) {
        const errores = [];
        errores.push({
          code: "custom_error",
          message: "Logo requerido",
          path: ["logo"],
        });
        if (errores.length > 0) throw new z.ZodError(errores);
      }
      await socioSchema.parseAsync(newSocio);

      setFormError({});

      const response = await addSocio(newSocio);

      if (response.status === 200) {
        const socioCreated = response.data;
        console.log("socioCreated: ", socioCreated);

        //carga la imagen
        const inputImagen = document.getElementById("imagenId");
        await subirImagenSocio(socioCreated.id, inputImagen.files[0]);

        setMostrarRta(true);
        setNewSocio({
          name: "",
          presidente: "",
          category: {},
          etiquetas: [],
          phone: "",
          mail: "",
          web: "",
          dateUnion: "",
          cuit: "",
        });
      }
    } catch (err) {
      if (err.isAxiosError) {
        console.log(err);
      } else if (err instanceof z.ZodError) {
        console.log(err.format());
        setFormError(err.format());
      } else {
        console.log(err);
      }
    }
  }

  const handlerSocio = (campo, valor) => {
    setNewSocio({
      ...newSocio,
      [campo]: valor,
    });
  };

  const handlerChangeCategory = (e) => {
    const newCategory = tiposSocios.find(
      (type) => type.id === parseInt(e.target.value)
    );
    setNewSocio({
      ...newSocio,
      category: newCategory,
    });
  };

  const handlerAreas = (estaSeleccionado, objArea) => {
    const socioASetear = structuredClone(newSocio);
    if (estaSeleccionado) {
      socioASetear.etiquetas.push(objArea); // IMPORTANTE CAMBIO DE NOMBRE
    } else {
      socioASetear.etiquetas = socioASetear.etiquetas.filter(
        (area) => area.id !== objArea.id
      ); // IMPORTANTE CAMBIO DE NOMBRE
    }
    setNewSocio(socioASetear);
  };

  return (
    <main>
      <div className="container-formSocio">
        <div>
          <h2 className="title h2_formSocio">Crear Socio</h2>
        </div>
        <form onSubmit={handlerSubmit}>
          <div className="divImgCrear">
            <label
              htmlFor="imagenId"
              style={{
                position: "relative",
                display: "inline-block",
                height: "100%",
              }}
            >
              <img
                src={imagenPrevisualizacion}
                alt="Insertar Imagen Socio"
                style={{ width: "auto", height: "100%" }}
              />
              <p className="hover-text">Seleccionar Imagen</p>
              <input
                className="input-user"
                type="file"
                name="logo"
                id="imagenId"
                onChange={(e) => handlerCambioImagen(e)}
                placeholder="Logo del socio"
                style={{ display: "none" }}
              />
            </label>
            <p className="error">
              {formError.logo && formError.logo._errors[0]}
            </p>
          </div>

          <div className="inputs-users">
            <div>
              <input
                className="input-user"
                value={newSocio.name}
                name="name"
                onChange={(e) => {
                  handlerSocio(e.target.name, e.target.value);
                }}
                placeholder="Nombre de socio"
              ></input>
              <p className="error">
                {formError.name && formError.name._errors[0]}
              </p>
            </div>

            <div>
              <input
                className="input-user"
                type="text"
                value={newSocio.presidente}
                name="presidente"
                onChange={(e) => {
                  handlerSocio(e.target.name, e.target.value);
                }}
                placeholder="Presidente del socio"
              />
              <p className="error">
                {formError.presidente && formError.presidente._errors[0]}
              </p>
            </div>

            <div>
              <input
                className="input-user"
                type="number"
                value={newSocio.cuit}
                name="cuit"
                onChange={(e) => {
                  handlerSocio(e.target.name, parseInt(e.target.value));
                }}
                placeholder="Cuit del socio"
              />
              <p className="error">
                {formError.cuit && formError.cuit._errors[0]}
              </p>
            </div>

            <div>
              <input
                className="input-user"
                type="mail"
                value={newSocio.mail}
                name="mail"
                onChange={(e) => {
                  handlerSocio(e.target.name, e.target.value);
                }}
                placeholder="E-Mail"
              ></input>
              <p className="error">
                {formError.mail && formError.mail._errors[0]}
              </p>
            </div>

            <div>
              <input
                className="input-user"
                type="number"
                value={newSocio.phone}
                name="phone"
                onChange={(e) => {
                  handlerSocio(e.target.name, parseInt(e.target.value));
                }}
                placeholder="Telefono"
              ></input>
              <p className="error">
                {formError.phone && formError.phone._errors[0]}
              </p>
            </div>

            <div>
              <input
                className="input-user"
                name="web"
                value={newSocio.web}
                onChange={(e) => {
                  handlerSocio(e.target.name, e.target.value);
                }}
                placeholder="Direccion web"
              ></input>
              <p className="error">
                {formError.web && formError.web._errors[0]}
              </p>
            </div>
          </div>

          <div className="linea-divisor"></div>

          <div className="select-categoria">
            <label>Categoria</label>
            <select
              name="category"
              required
              value={newSocio.category.name || ""}
              onChange={handlerChangeCategory}
            >
              <option value="" disabled>
                Seleccione
              </option>
              {Array.isArray(tiposSocios) &&
                tiposSocios.map((tipo) => (
                  <option value={tipo.id} key={tipo.id}>
                    {tipo.name}
                  </option>
                ))}
            </select>
          </div>

          <AreasForm
            allAreas={areas}
            handlerAreas={handlerAreas}
            areasSocio={newSocio.etiquetas}
          ></AreasForm>

          <input type="submit" value={"CREAR"}></input>
        </form>
      </div>

      {mostrarRta && (
        <div className="response-form">
          <p>¡Creacion de nuevo usuario exitosa!</p>
          <div className="divisor"></div>
          <button
            onClick={() => {
              setMostrarRta(false);
              navigate("/socios");
            }}
          >
            CERRAR
          </button>
        </div>
      )}
      <div className="contenedorImagenesBackground">
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
    </div>
    
    </main>
  );
};

export default FormSocio;
