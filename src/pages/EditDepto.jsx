import PropTypes from "prop-types";
import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { Button, TextField, Typography } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import CloseIcon from "@mui/icons-material/Close";
import NuevaAutoridad from "../components/nuevaAutoridad";
import "../styles/editDepto.css";
import { fetchDeptoById, updateDepartment } from "../store/departmentStore";
import useUserStore from "../store/usuariosStore";
import { setTitle } from "../utils/const";

import { obtenerImagenDpto } from "../store/imagesStore";
import { subirImagenDpto } from "../store/imagesStore";

const EditDepto = ({ cancelEdit }) => {
  const {
    state: { id },
  } = useLocation();
  const { users: listUsuarios } = useUserStore();
  const { puestos: puestos } = useUserStore();

  const [usuarioSelected, setUsuarioSelected] = useState(null);
  const [selectedPuesto, setSelectedPuesto] = useState(null);

  const [isAdding, setIsAdding] = useState(false);
  const [nameDepartament, setNameDepartament] = useState("");
  const [objective, setObjective] = useState("");
  const [authorities, setAuthorities] = useState([]);

  const fetchDepartmentData = useCallback(async () => {
    const departmentData = (await fetchDeptoById(id)) || {};
    if (departmentData) {
      const authorities = departmentData.autoridades.map((authority) => ({
        usuarioId: authority.usuarioId,
        puesto: authority.puesto,
        personName: authority.nombre,
      }));
      console.log("authorities", authorities);
      setAuthorities(authorities);
      setNameDepartament(departmentData.nombre);
      setObjective(departmentData.objetivo);
    }
  }, [id]);

  useEffect(() => {
    fetchDepartmentData();
  }, [fetchDepartmentData]);

  const handleAddAuthority = useCallback(() => {
    setAuthorities((prevAuthorities) => [
      ...prevAuthorities,
      {
        usuarioId: usuarioSelected ? usuarioSelected.id : null,
        puesto: selectedPuesto,
        personName: usuarioSelected ? usuarioSelected.nombre : "",
      },
    ]);
    setUsuarioSelected(null);
    setSelectedPuesto(null);
    setIsAdding(false);
  }, [selectedPuesto, usuarioSelected]);

  const handleRemoveAuthority = useCallback((personName) => {
    setAuthorities((prevAuthorities) =>
      prevAuthorities.filter((authority) => authority.personName !== personName)
    );
  }, []);

  const handleSaveChanges = useCallback(async () => {
    console.log("Guardando cambios...");

    const updatedDepartment = {
      id: id,
      nombre: nameDepartament,
      objetivo: objective,
      autoridades: authorities.map((authority) => ({
        usuarioId: authority.usuarioId,
        nombre: authority.personName,
        puesto: authority.puesto,
      })),
    };

    const response = await updateDepartment(id, updatedDepartment);

    //carga la imagen
    if (imgUpdated) {
      const inputImagen = document.getElementById("imagenId");
      await subirImagenDpto(id, inputImagen.files[0]);
    }

    if (response && response.id) {
      console.log("Departamento actualizado con éxito:", response);
    }

    cancelEdit();
  }, [id, nameDepartament, objective, authorities, cancelEdit]);
  setTitle("Editar departamento");

  //imagenes
  const [imagenPrevisualizacion, setImagenPrevisualizacion] = useState(
    "../src/assets/agregarImgDefault.png"
  );
  const [imgUpdated, setImgUpdated] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      const imageUrl = await obtenerImagenDpto(id);
      setImagenPrevisualizacion(imageUrl);
    };
    fetchImage();
  }, [id]);

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

  //return componente
  return (
    <main className="body-allSocios">
      <section className="body-Depto" style={{ with: "1200px" }}>
        <div className="edit-depto-container">
          {/* <div className="placeholder-svg">
        <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="black"
            strokeWidth="3"
            fill="red"
          />
        </svg>
       </div> */}
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

          <TextField
            className="department-name"
            label="Nombre Departamento"
            variant="outlined"
            value={nameDepartament}
            onChange={(e) => setNameDepartament(e.target.value)}
          />
          <section className="alinearModDepto">
            <div className="containerObjetivos">
              <h3 className="textTitle">Objetivos: </h3>
              <TextField
                className="objetivosLabel"
                label="Describa todos los objetivos del departamento"
                variant="outlined"
                multiline
                rows={4}
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
              />
            </div>
            <div className="authorities-container">
              <div className="add-authority-header">
                {/*<h3 className="textTitle">Autoridades</h3>
                <Button variant="contained" onClick={() => setIsAdding(!isAdding)}>
                  {/* <AddIcon /> 
                </Button> */}
      
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "140px",
                      height: "20px",
                    }}
                  >
                    <p className="labelCampo">Autoridades</p>
                    <img
                      src="../src/assets/arrows_circle_plus.jpg"
                      alt="hola"
                      style={{ height: "20px", width: "20px" }}
                      onClick={() => setIsAdding(!isAdding)}
                    />
                  </div>
       
              </div>
              <div>
                {isAdding && (
                  <div className="add-authority-fields">
                    <NuevaAutoridad
                      selectedPuesto={selectedPuesto}
                      setSelectedPuesto={setSelectedPuesto}
                      puestos={puestos}
                      usuarioSelected={usuarioSelected}
                      setUsuarioSelected={setUsuarioSelected}
                      listUsuarios={listUsuarios}
                    />
                    <Button
                      onClick={handleAddAuthority}
                      className="hoverButton"
                    >
                      <CheckCircleOutlineIcon
                        style={{ color: "#76B8C3", fontSize: "3em" }}
                      />
                    </Button>
                    <Button
                      className="hoverButton"
                      startIcon={
                        <CloseIcon style={{ color: "red", fontSize: "3em" }} />
                      }
                      onClick={() => setIsAdding(false)}
                    ></Button>
                  </div>
                )}

                <div className="authorities-list">
                  {authorities.map((authority) => (
                    <div
                      className="single-authority"
                      key={`${authority.puesto}-${authority.personName}`}
                    >
                      <Typography variant="h6">
                        <span className="nameRol">
                          {authority.puesto
                            .toLowerCase()
                            .charAt(0)
                            .toUpperCase() +
                            authority.puesto.toLowerCase().slice(1)}
                        </span>{" "}
                        - {authority.personName}
                      </Typography>
                      <Button
                        startIcon={<PersonRemoveIcon />}
                        onClick={() =>
                          handleRemoveAuthority(authority.personName)
                        }
                      >
                        {/* Puedes agregar texto al botón si lo deseas */}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <div className="container-botones">
            <button
              className="guardarCambiosButton"
              onClick={handleSaveChanges}
            >
              GUARDAR CAMBIOS
            </button>
            <button className="cancelarButton" onClick={cancelEdit}>
              CANCELAR
            </button>
          </div>
        </div>
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

EditDepto.propTypes = {
  cancelEdit: PropTypes.func.isRequired,
};

export default EditDepto;
