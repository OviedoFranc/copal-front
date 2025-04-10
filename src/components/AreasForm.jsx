import "../styles/AreasForm.css"; //CAMBIO IMPORTANTE LAS DOS DEPENDENCIAS ANTERIORES NO SE USARON
import { useState } from "react";
import PropTypes from 'prop-types';
const AREAS_VISIBLES = 4;
const LENGTH_AREA = 6;

const truncate = (str, cant) => {
  if (str.length > cant) {
    return str.slice(0, cant) + "...";
  } else {
    return str;
  }
};

export const AreasForm = ({ allAreas = [], areasSocio = [], handlerAreas }) => {
  const [mostrarCheckbox, setMostrarCheckbox] = useState(false);

  const handleClick = () => {
    setMostrarCheckbox(!mostrarCheckbox);
  };

  const renderVistaAreas = () => {
    return (
      <div className="vista-areas">
        {areasSocio?.map((area, index) => {
          if (index < AREAS_VISIBLES) {
            return (
              <p key={area.id} className="area">
                {truncate(area.nombre, LENGTH_AREA)}
              </p>
            );
          } else if (index === AREAS_VISIBLES) {
            return (
              <p key={area} className="puntos-suspensivos">
                ...
              </p>
            );
          }
        })}
      </div>
    );
  };

  return (
    <div className="select-areas">
      <label>Areas</label>
      <div>
        <div className="header-areas">
          {renderVistaAreas()}
          {areasSocio.length > AREAS_VISIBLES && (
            <p className="area count-areas">{areasSocio.length}</p>
          )}
          <img
            onClick={handleClick}
            className={"icon-down"}
            src={"../src/assets/down.svg"}
          ></img>
        </div>

        <div className={mostrarCheckbox ? "checkboxs" : "checkboxs oculto"}>
          {allAreas?.map((area) => (
            <div key={area.id} className="container-checkbox">
              <input
                type="checkbox"
                checked={
                  areasSocio.map((area) => area.id).indexOf(area.id) >= 0
                }
                name="department"
                value={area.id}
                onChange={(e) => handlerAreas(e.target.checked, area)}
              />{" "}
              {/* IMPORTANTE CAMBIO DE name="department" */}
              <label>{area.nombre}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

AreasForm.propTypes = {
    allAreas: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        nombre: PropTypes.string.isRequired
      })
    ),
    areasSocio: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        nombre: PropTypes.string.isRequired
      })
    ),
    handlerAreas: PropTypes.func.isRequired
  };

export default AreasForm;