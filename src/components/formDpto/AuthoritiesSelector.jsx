import PropTypes from "prop-types";
import { AutoComplete, Select } from "antd";
import { FaArrowDown, FaChevronDown } from "react-icons/fa";
import { useEffect, useState } from "react";
import {
  departmentStore,
  getUsuarios,
} from "../../store/departmentStore";
import { getPuestos } from "../../store/departmentStore";

const AuthoritiesSelector = ({
  handlerAutoridad,
  handlerNewAutoridad,
  autoridades,
  formError,
}) => {
  useEffect(() => {
    const fetchPuestos = async () => {
      try {
        const puestos1 = await getPuestos();
        setPuestos(puestos1);
      } catch (error) {
        console.error("Hubo un error al obtener las categorías:", error);
      }
    };
    const fecthNombresUsuarios = async () => {
      try {
        const usuarios = await getUsuarios();
        setUsuarios(usuarios);
      } catch (error) {
        console.error("Hubo un error al obtener las categorías:", error);
      }
    };

    fetchPuestos();
    fecthNombresUsuarios();
  }, []);

  //lo siguiente es para es dropdown de Puestos
  const [puestos, setPuestos] = useState([]);
  // el filro tiene lo esctiro que dsp filtra la lista de puestos para mostrar
  const puestosFiltrados = puestos
    ? puestos /*.filter(
        (puesto) =>
          autoridades.map((aut) => aut.puesto).includes(puesto) === false
      )*/
    : [];

  //lo siguiente es para es dropdown de Nomrbes de Usuario
  const [usuarios, setUsuarios] = useState([]);
  // el filro tiene lo esctiro que dsp filtra la lista de puestos para mostrar
  const [filtroNombres, setFiltroNombres] = useState("");
  const usuariosFiltrados = usuarios
    ? usuarios.filter((usuario) =>
        usuario.nombre
          .toLowerCase()
          .split(" ")
          .some((val) => val.startsWith(filtroNombres.toLowerCase()))
      )
    : [];

  return (
    <div>
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "140px",
          }}
        >
          <p className="labelCampo">Autoridades</p>
          <img
            src="../src/assets/arrows_circle_plus.jpg"
            alt="hola"
            style={{ height: "20px", width: "20px" }}
            onClick={() => handlerNewAutoridad("puesto", "ROL")}
          />
        </div>
        {autoridades.map((autoridad, index) => (
          <div key={index} className="campoAutoridad">
            <Select
              className="popUpPuestos"
              id="puesto_autoridades"
              options={puestosFiltrados.map((val) => ({ value: val }))}
              suffixIcon={<FaChevronDown style={{ width: "15px", height: "15px", color: "red"}} />}
              onSelect={(valor) => handlerAutoridad(index, "puesto", valor)}
              value={autoridad.puesto}
              //estilos
              bordered={false}
              popupMatchSelectWidth={false}
            />
            <p style={{margin: "0"}}>-</p>
            <AutoComplete
              className="popUpUsuarios"
              bordered={false}
              placeholder="Seleccione un Usuario"
              id={"name_autoridades" + index}
              options={usuariosFiltrados.map((val) => ({ value: val.nombre }))}
              suffixIcon={<FaChevronDown style={{ width: "15px", height: "15px"}} />}
              onSearch={(valor) => setFiltroNombres(valor)}
              onSelect={(valor) => {
                setFiltroNombres("");
                handlerAutoridad(
                  index,
                  "usuarioId",
                  usuarios.find((u) => u.nombre === valor).id
                );
              }}
              onBlur={() => {
                setFiltroNombres("");
              }}
            />
            <div style={{}}>
              <p className="error">
                {formError.autoridades &&
                  formError.autoridades[index]?.puesto?._errors[0]}
              </p>
              <p className="error">
                {formError.autoridades &&
                  formError.autoridades[index]?.usuarioId?._errors[0]}
              </p>
            </div>
          </div>
        ))}
        {/* <div className="campoAutoridad">
          <label htmlFor="puesto_new_autoridades">puesto:</label>
          <Select
            className="popUpPuestos"
            id="puesto_new_autoridades"
            options={puestosFiltrados.map((val) => ({ value: val }))}
            suffixIcon={<FaArrowDown style={{ width: 20, height: 20 }} />}
            onSelect={(valor) => handlerNewAutoridad("puesto", valor)}
            value={""}
          />
          <label htmlFor="name_new_autoridades">nombre: </label>
          <input
            type="text"
            name="name_new_autoridades"
            id="name_new_autoridades"
            placeholder="Nombre NUEVA Autoridad"
            disabled={true}
          />
        </div> */}
        <p className="error">
          {formError.autoridades && formError.autoridades._errors[0]}
        </p>
      </div>
    </div>
  );
};

AuthoritiesSelector.propTypes = {
  handlerAutoridad: PropTypes.func.isRequired,
  handlerNewAutoridad: PropTypes.func.isRequired,
  autoridades: PropTypes.array.isRequired,
  formError: PropTypes.object.isRequired,
};

export default AuthoritiesSelector;
