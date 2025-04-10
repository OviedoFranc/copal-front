import React from 'react'
import PropTypes from 'prop-types'
import { FiVideo, FiUsers, FiUser } from "react-icons/fi";
import { iconElement } from "../styles/stylesComponent";
const Modality = ({ estado }) => {
  
  return (
    <div className="alingicon">
      {estado === "HIBRIDA" ? <FiUsers style={iconElement} /> : ""}
      {estado === "PRESENCIAL" ? <FiUser style={iconElement} /> : ""}
      {estado === "VIRTUAL" ? <FiVideo style={iconElement} /> : ""}

      <p>
        {estado?.charAt(0).toUpperCase() + estado?.slice(1).toLowerCase()}
      </p>
    </div>
  );

}


export default Modality
