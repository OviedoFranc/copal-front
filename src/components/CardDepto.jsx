import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';
import '../styles/cardDepto.css'
import imgSvg from '../assets/svgexport-2 1.svg';
import Button from './button';
import { obtenerImagenDpto } from '../store/imagesStore';

const CardDepto = ({ id, title, description }) => {
  const buttonStile = {
    padding: "18.5px 30px",
    textTransform: "uppercase",
    border:"none"
  };
  const imagenStyle = {
    width: "96px",
    height:"96"
  };

  const [imagenSrc, setImagenSrc] = useState(null);

  useEffect(() => {
      const fetchImage = async () => {
          const imageUrl = await obtenerImagenDpto(id);
          setImagenSrc(imageUrl);
      }

      fetchImage();
  }, [id]);

  let url = encodeURIComponent(title.replace(/ /g, "_").toLowerCase());
  return (
    <Link to={url} state={{ id: id }}>
      {/* <img src={imganBack}></img> */}
      <div className="cardDept ">
        <div>
          {imagenSrc && (
            <img
              src={imagenSrc}
              style={imagenStyle}
              alt="Descripción de la imagen"
            />
          )
          ||
          <img src={imgSvg} style={imagenStyle} alt="Descripción de la imagen" /> 
          }
        </div>
        <div className="element" style={{ height: "342px" }}>
          <h2 className="titleCard">{title}</h2>
          <p className="description">
            {description.length >= 230
              ? description.substr(0, 200) + "..."
              : description}
          </p>
          <div className='alinbutton'>
            <Button style={buttonStile} text="Ver departamento" />
          </div>
        </div>
      </div>
    </Link>
  );
}



export default CardDepto
