import { Link } from "react-router-dom";
import { sociosStore } from "../store/sociosStore";
import { useEffect, useState } from "react";
import { obtenerImagenSocio } from "../store/imagesStore";
import PropTypes from 'prop-types';
import {
  FiMail,
  FiEdit,
  FiMapPin,
  FiPhone,
  FiGlobe,
} from "react-icons/fi";
import "../styles/cardSocio.css";
import { iconElement } from "../styles/stylesComponent";
import State from "./State";

/**
 *
 * @param {{socio:{id: number, name: string, image: string, category: string, department: [string], phone: number, mail: string, adress: string, asset: boolean, password: string, dateCreation: Date, dateSesion: Date}}} param0
 * @returns
 */
const CardSocio = ({ socio }) => {
  //imagen
  const imagenStyle = {
    width: "100px",
    height: "70px",
  };
  //console.log(socio)
  const [imagenSrc, setImagenSrc] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      const imageUrl = await obtenerImagenSocio(socio.id);
      setImagenSrc(imageUrl);
    };

    fetchImage();
  }, [socio]);

  const setSocioSelectDetail = sociosStore(
    (state) => state.setSocioSelectDetail
  );

  const handlerToDetail = () => {
    setSocioSelectDetail(socio.id);
  };



  const estado = {
    id: socio.estado ? 1 : 4,
    descripcion: socio.estado ? "Activo" : "Inactivo",
  };
  
  
  return (
    <Link
      to="/socios/socio"
      onClick={handlerToDetail}
      className="cardSocio"
      state={{ id: socio.id }}
    >
      <img src={imagenSrc} alt={socio.id} style={imagenStyle} />
      <section className="sectionAlineacion">
        <h2 className="titleCardSocio">{socio.name}</h2>
        <p className="tipoSocioCard">{socio.category.name}</p>
      </section>

      <section className="sectionAlineacion">
        <div className="elementSocio">
          <FiGlobe style={iconElement} />
          <p>{socio.web}</p>
        </div>
        <div className="elementSocio">
          <FiPhone style={iconElement} />
          <p>{socio.phone}</p>
        </div>
        <div className="elementSocio">
          <FiMail style={iconElement} />
          <p>{socio.mail}</p>
        </div>
      </section>
      <section className="sectionAlineacion">
        <div className="alingEstado">
          {/* <button className="buttonEditar">
            <FiEdit style={iconEditar} />
          </button> */}
          <div>
            <State estado={estado} />
            {/* <FiDisc />
                <p>Estado</p> */}
          </div>
        </div>
      </section>
      {/* <Link to="/socio" onClick={handlerToDetail}>ir a detalle</Link> */}
    </Link>
  );
};

CardSocio.propTypes = {
  socio: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string,
    category: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
    department: PropTypes.arrayOf(PropTypes.string),
    phone: PropTypes.number.isRequired,
    mail: PropTypes.string.isRequired,
    web: PropTypes.string.isRequired,
    asset: PropTypes.bool.isRequired,
    password: PropTypes.string.isRequired,
    dateCreation: PropTypes.string.isRequired,
    dateSesion: PropTypes.string.isRequired,
  }).isRequired,
}

export default CardSocio;
