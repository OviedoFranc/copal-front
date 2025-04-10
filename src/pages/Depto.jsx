import { useState, useEffect } from "react";
import { setTitle } from "../utils/const";
import { useLocation } from "react-router-dom";
import { sociosStore, disableDepto } from "../store/sociosStore";
import "../styles/allDeptos.css";
import svg from "../assets/svgexport-2 1.svg";
import Button from "../components/button";
import { buttonEditar, buttonEliminar } from "../styles/stylesComponent";
import EditDepto from "./EditDepto";
import { Alertas, AlertasConfirmar } from "../components/Alertas";
import { obtenerImagenDpto } from "../store/imagesStore";

//mandar estilos a otra carptea
const imagenStyle = {
  width: "100px",
  height: "100px",
};
const Depto = (props) => {
  const [isEditMode, setIsEditMode] = useState(false);

  //aca obtengo el id para buscar en el back el departamento
  const {
    state: { id },
  } = useLocation();
  console.log("id del departamento:", id);

  //aca se hace la consulta al back para obtener el departamento
  const { nombre, objetivo, autoridades } =
    sociosStore.getState().deptoForId(id) || {};
  setTitle(nombre);

  const [imagenSrc, setImagenSrc] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      const imageUrl = await obtenerImagenDpto(id);
      setImagenSrc(imageUrl);
    };

    fetchImage();
  }, [id]);

  const [confirmarAlerta, setConfirmar] = useState(false);
  const [alertaExito, setAlertaExito] = useState(false);
  const handClick = () => {
    let response = disableDepto(id);
    response.then((response) => {
      response.status === 202
        ? setAlertaExito(true)
        : console.log("Error no se pudo eliminar el departamento");
    });
  };

  //returns
  if (isEditMode) {
    return <EditDepto cancelEdit={() => window.location.reload() /*setIsEditMode(false)*/} {...props} />;
  }
  return (
    <main className="body-allSocios">
      <div className="body-Depto">
        <section>
          <div className="divImgYNombreDpto">
            <div>
              {(imagenSrc && (
                <img
                  src={imagenSrc}
                  style={imagenStyle}
                  alt="Descripción de la imagen"
                />
              )) || (
                <img
                  src={svg}
                  style={imagenStyle}
                  alt="Descripción de la imagen"
                />
              )}
            </div>
            <h2 className="deptTitle">{nombre}</h2>
          </div>
        </section>
        <div className="alinearbody">
          <section className="contElemnt">
            <div className="objetivo">
              <h3>Objetivo:</h3>
              <p className="obj">{objetivo}</p>
            </div>
          </section>
          <section className="contElemnt">
            <h3>Autoridades:</h3>
            <ul className="listAutoridades">
              {autoridades?.map((elemnt, i) => (
                <li key={i}>
                  <p>
                    <span className="nameRol">
                      {elemnt.puesto.toLowerCase().charAt(0).toUpperCase() +
                        elemnt.puesto.toLowerCase().slice(1)}
                    </span>
                    {" - "} {elemnt.nombre}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>
        <div className="buttonAling">
          <div className="alinbutton">
            <Button
            action={() => setIsEditMode(true)}
            style={buttonEditar}
            text="Editar"
          />
          <Button
            action={() => {
              setConfirmar(true);
            }}
            style={buttonEliminar}
            text="Eliminar"
          /></div>

          

          {confirmarAlerta && (
            <AlertasConfirmar
              title="Confirmar"
              action={handClick}
              actionCancelar={() => {
                setConfirmar(false);
              }}
              msjAlerta={"¿Desea eliminar el departamento?"}
            ></AlertasConfirmar>
          )}
          {alertaExito && (
            <Alertas
              ruta="/departamentos"
              title="Ok"
              msjAlerta={"Departamento Eliminado con Éxito"}
            />
          )}
        </div>
      </div>

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

Depto.propTypes = {};

export default Depto;
