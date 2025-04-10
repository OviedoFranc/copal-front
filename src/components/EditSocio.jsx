import { useState, useEffect } from "react";
import { departmentStore } from "../store/departmentStore";
import PropTypes from "prop-types";
import { sociosStore } from "../store/sociosStore";
import { useNavigate } from "react-router-dom";
import "../styles/editSocio.css";
import { obtenerImagenSocio } from "../store/imagesStore";
import { subirImagenSocio } from "../store/imagesStore";
import { getEtiquetas } from "../store/areasStore";
import AreasForm from "./AreasForm";

const EditSocio = ({ setIsEditing, socioSelectDetail }) => {
  const navigate = useNavigate();

  const modifySocio = sociosStore((state) => state.modifySocio);
  const refreshSocios = sociosStore((state) => state.getSocios);

  const [socioEdit, setSocioEdit] = useState(socioSelectDetail);

  const [etiquetas, setAreas] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const etiquetas = await getEtiquetas();

      setAreas(etiquetas);
    }

    fetchData();
  }, []);

  const handlerCancel = (e) => {
    e.preventDefault();
    return setIsEditing(false);
  };

  const handlerChangeSocioEdit = (e) => {
    setSocioEdit({
      ...socioEdit,
      [e.target.name]: e.target.value,
    });
  };

  const checkActivated = (etiqueta) => {
    return socioSelectDetail?.etiquetas?.some(
      (departmentExist) => departmentExist.id === etiqueta.id
    );
  };

  const handlerChangeAreas = (e, department) => {
    e.target.checked
      ? addDepartmentSocioEdit(department)
      : deleteDepartmentSocioEdit(department);
  };

  const addDepartmentSocioEdit = (etiqueta) => {
    setSocioEdit({
      ...socioEdit,
      etiquetas: [...socioEdit.etiquetas, etiqueta],
    });
  };

  const deleteDepartmentSocioEdit = (etiqueta) => {
    const newDepartmentList = socioEdit.etiquetas.filter(
      (departmentExist) => departmentExist.id !== etiqueta.id
    );
    setSocioEdit({
      ...socioEdit,
      etiquetas: newDepartmentList,
    });
  };

  //imagenes
  const [imagenPrevisualizacion, setImagenPrevisualizacion] = useState(
    "../src/assets/agregarImgDefault.png"
  );
  const [imgUpdated, setImgUpdated] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      const imageUrl = await obtenerImagenSocio(socioEdit.id);
      setImagenPrevisualizacion(imageUrl);
    };
    fetchImage();
  }, [socioEdit]);

  const handlerCambioImagen = (evento) => {
    const imagenSeleccionada = evento.target.files[0];
    if (imagenSeleccionada) {
      setImgUpdated(true);
      setImagenPrevisualizacion(imagenSeleccionada);

      const lector = new FileReader();
      lector.onloadend = () => {
        setImagenPrevisualizacion(lector.result);
      };
      lector.readAsDataURL(imagenSeleccionada);
    }
  };

  const handlerSubmit = (e) => {
    e.preventDefault();
    modifySocio(socioEdit);

    //carga la imagen
    if (imgUpdated) {
      const inputImagen = document.getElementById("imagenId");
      subirImagenSocio(socioEdit.id, inputImagen.files[0]);
    }

    refreshSocios();
    return navigate("/socios");
  };

  return (
    <div className="container-edit-socio">
      <form className="edit-socio-form">
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
                handlerCambioImagen(e);
              }}
              placeholder="Logo del socio"
              style={{ display: "none" }}
            />
          </label>
        </div>
        <div className="edit-socio-section">
          <div className="filaDeElem">
            <div className="unElemento">
              <strong>NOMBRE:</strong>
              <input
                type="text"
                name="name"
                onChange={handlerChangeSocioEdit}
                value={socioEdit.name}
              />
            </div>
            <div className="unElemento">
              <strong>CATEGORIA:</strong> {socioEdit.category.name}
            </div>
            <div className="unElemento">
              <strong>CUIT:</strong>
              <input
                type="text"
                name="cuit"
                onChange={handlerChangeSocioEdit}
                value={socioEdit.cuit}
              />
            </div>
          </div>

          {/* <div className="unElemento">
            <strong>DESCRIPCION:</strong>
            <textarea
              name="description"
              onChange={handlerChangeSocioEdit}
              value={socioEdit.description}
              cols="10"
              rows="3"
            ></textarea>
          </div> */}

          <div className="filaDeElem">
            <div className="unElemento">
              <strong>TELEFONO:</strong>
              <input
                type="number"
                name="phone"
                onChange={handlerChangeSocioEdit}
                value={socioEdit.phone}
              />
            </div>
            <div className="unElemento">
              <strong>EMAIL:</strong>
              <input
                type="email"
                name="mail"
                onChange={handlerChangeSocioEdit}
                value={socioEdit.mail}
              />
            </div>
            <div className="unElemento">
              <strong>DIRECCION:</strong>
              <input
                type="text"
                name="web"
                onChange={handlerChangeSocioEdit}
                value={socioEdit.web}
              />
            </div>
          </div>
        </div>

        <div className="edit-socio-departments">
          <strong>ETIQUETAS:</strong>
          <div className="elementos-departamentos">
            {etiquetas?.map((department) => (
              <div key={department.id} className="elem-lista-departamentos">
                <input
                  type="checkbox"
                  onChange={(e) => handlerChangeAreas(e, department)}
                  name="department"
                  defaultChecked={checkActivated(department)}
                  value={department.id}
                />
                <label>{department.nombre}</label>
              </div>
            ))}
          </div>
        </div>
        <div className="edit-socio-buttons">
          <button onClick={handlerSubmit} type="submit">
            Guardar Cambios
          </button>
          <button onClick={handlerCancel}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

EditSocio.propTypes = {
  setIsEditing: PropTypes.func.isRequired,
  socioSelectDetail: PropTypes.object.isRequired,
};

export default EditSocio;
