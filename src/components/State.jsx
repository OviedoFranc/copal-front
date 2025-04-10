import React from 'react'
import PropTypes from 'prop-types'
import {
  FiDisc,

} from "react-icons/fi";


const iconSuspendido = {
  color: "#EB9B23",
};
const iconActivo = {
  color: "#1BEC17",
};

const iconCancelado = {
  color: "#F11513",
};
const iconFinalizado = {
  color: "#908E8E",
};

const State = ({
  estado = 1,
  constEstilo = {
    1: iconActivo,
    2: iconSuspendido,
    3: iconFinalizado,
    4: iconCancelado,
    5: iconSuspendido,
  },
}) => {
  // console.log(estado.id)
  // const constEstilo = {};
  return (
    <div style={constEstilo[estado?.id]} className="estadoActual">
      <FiDisc style={constEstilo[estado.id]} />
      <p>{estado.descripcion}</p>
    </div>
  );
};

State.propTypes = {}

export default State
