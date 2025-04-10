import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "../styles/FormDepartamento.css";
import "../styles/Alertas.css";
import { buttonEditar, buttonEliminar } from "../styles/stylesComponent";

export const Alertas = ({ title, msjAlerta, ruta, action }) => {
  //console.log("la alerta " + msjAlerta + title);
  return (
    <>
      <div className="oscurecedorDeFondo"></div>
      <div className="response-form">
        <p>{msjAlerta}</p>
        <Link to={ruta}>
          <button onClick={() => action()} style={buttonEditar}>
            {title}
          </button>
        </Link>
      </div>
    </>
  );
};

export const AlertasConfirmar = ({
  title,
  msjAlerta,
  ruta = "/",
  action,
  actionCancelar,
  btnCancelar = "CANCELAR",
}) => {
  //console.log("la alerta " + msjAlerta + title);
  return (
    <>
      <div className="oscurecedorDeFondo"></div>
      <div className="response-form">
        <p>{msjAlerta}</p>
        <div className="alertAlign">
          <button
            onClick={() => {
              action();
            }}
            style={buttonEditar}
          >
            {title}
          </button>

          <button
            onClick={() => {
              actionCancelar();
            }}
            style={buttonEliminar}
          >
            {btnCancelar}
          </button>
        </div>
      </div>
    </>
  );
};

export const AlertasSinRedireccionar = ({ title, msjAlerta, action }) => {
  //console.log("la alerta " + msjAlerta + title);
  return (
    <>
      <div className="oscurecedorDeFondo"></div>
      <div className="response-form">
        <p>{msjAlerta}</p>
        <button
          onClick={() => {
            action();
          }}
          style={buttonEditar}
        >
          {title}
        </button>
      </div>
    </>
  );
};
