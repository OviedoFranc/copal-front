import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Button,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import "../styles/invitacion.css";
import { sociosStore } from "../store/sociosStore";
import { socioCopal } from "../utils/const";
import { formularioInvitacionParticipante } from "../store/participanteStore";
import { TIPOS_PARTICIPANTES } from "../utils/const.js";
import { AlertasSinRedireccionar } from "./Alertas";
import {
  participanteSchema,
  validarSocioRepresentando,
} from "../validations/invitacion.js";
import { z } from "zod";

const FormInvitacionEvento = ({ uuid }) => {
  // const navigate = useNavigate();
  const { listSocios, getSocios } = sociosStore();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [tipo, setTipo] = useState(TIPOS_PARTICIPANTES.INVITADO);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [invitadoPor, setInvitadoPor] = useState("");
  const [invitadoPorID, setInvitadoPorId] = useState(0);
  const [entidad, setEntidad] = useState("");
  const [socios, setSocios] = useState([]);

  //validaciones
  const [msjsValidaciones, setMsjsValidaciones] = useState({});

  useEffect(() => {
    getSocios().catch((error) => {
      console.error("Fallo al traer los socios", error);
    });
  }, []);

  useEffect(() => {
    // Agrego el socioCopal solo si aún no está presente en la lista de socios
    if (!listSocios.some((socio) => socio.id === socioCopal.id)) {
      setSocios([socioCopal, ...listSocios]);
    }
  }, [listSocios]);

  // Función para manejar el envío del formulario
  const handleSubmit = (event) => {
    event.preventDefault();
    const participanteData = {
      nombre: nombre,
      apellido: apellido,
      tipoParticipante: tipo,
      ...(tipo === TIPOS_PARTICIPANTES.SOCIO && {
        socioAsociadoId: invitadoPorID,
      }),
      ...(tipo === TIPOS_PARTICIPANTES.INVITADO && {
        socioConvocanteId: invitadoPorID,
        entidadQueRepresenta: entidad ? entidad : "",
      }),
    };

    try {
      participanteSchema.parse(participanteData);
      validarSocioRepresentando(participanteData);
      setMsjsValidaciones({});

      formularioInvitacionParticipante(uuid, participanteData)
        .then((response) => {
          console.log("Respuesta del formulario:", response);
          setShowSuccessAlert(true);
        })
        .catch((error) => {
          console.error("Error al enviar el formulario:", error);
        });
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log("err.format():", error.format());
        setMsjsValidaciones(error.format());
      }
    }
  };

  const handleCloseSuccessAlert = () => {
    setShowSuccessAlert(false);
    // navigate('/eventos');
    window.location.reload();
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        {/* Controles para Tipo */}
        <div className="tipoControl">
          <Typography className="inputLabel">Tipo:</Typography>
          <RadioGroup
            row
            name="tipo"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          >
            <FormControlLabel
              value={TIPOS_PARTICIPANTES.SOCIO}
              control={<Radio />}
              label="Socio"
            />
            <FormControlLabel
              value={TIPOS_PARTICIPANTES.INVITADO}
              control={<Radio />}
              label="Invitado"
            />
          </RadioGroup>
        </div>

        {/* Control para Nombre */}
        <p className="error">
          {msjsValidaciones.nombre && msjsValidaciones.nombre._errors[0]}
        </p>
        <div className="fullWidthControl">
          <Typography className="inputLabel">Nombre:</Typography>
          <TextField
            variant="outlined"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="inputField"
          />
        </div>

        {/* Control para Apellido */}
        <p className="error">
          {msjsValidaciones.apellido && msjsValidaciones.apellido._errors[0]}
        </p>
        <div className="fullWidthControl">
          <Typography className="inputLabel">Apellido:</Typography>
          <TextField
            variant="outlined"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            className="inputField"
          />
        </div>
        {tipo === TIPOS_PARTICIPANTES.SOCIO ? (
          <>
            <p className="error">
              {msjsValidaciones.socioAsociadoId &&
                msjsValidaciones.socioAsociadoId._errors[0]}
            </p>
            <div className="fullWidthControl">
              <Typography className="inputLabel">
                Socio a Representar:
              </Typography>
              <FormControl variant="outlined" className="selector">
                <Select
                  displayEmpty
                  value={invitadoPor}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    setInvitadoPor(selectedId);
                    const socio = socios.find(
                      (s) => s.id.toString() === selectedId
                    );
                    if (socio) {
                      setInvitadoPorId(Number(socio.id));
                    }
                  }}
                  renderValue={(selected) => {
                    if (selected === "") {
                      return <em>SELECCIONAR SOCIO A REPRESENTAR</em>;
                    }
                    const socio = socios.find(
                      (s) => s.id.toString() === selected
                    );
                    return socio ? (
                      socio.name
                    ) : (
                      <em>SELECCIONAR SOCIO A REPRESENTAR</em>
                    );
                  }}
                >
                  <MenuItem disabled value="">
                    <em>SELECCIONAR SOCIO A REPRESENTAR</em>
                  </MenuItem>
                  {listSocios.map((socio) => (
                    <MenuItem key={socio.id} value={socio.id.toString()}>
                      {socio.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </>
        ) : (
          <div>
            <p className="error">
              {msjsValidaciones.socioConvocanteId &&
                msjsValidaciones.socioConvocanteId._errors[0]}
            </p>
            <div className="fullWidthControl">
              <Typography className="inputLabel">Invitado por:</Typography>
              <FormControl variant="outlined" className="selector">
                <Select
                  displayEmpty
                  value={invitadoPor}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    setInvitadoPor(selectedId);
                    const socio = socios.find(
                      (s) => s.id.toString() === selectedId
                    );
                    if (socio) {
                      setInvitadoPorId(Number(socio.id));
                    }
                  }}
                  renderValue={(selected) => {
                    if (selected === "") {
                      return <em>SELECCIONAR SOCIO CONVOCANTE</em>;
                    }
                    const socio = socios.find(
                      (s) => s.id.toString() === selected
                    );
                    return socio ? (
                      socio.name
                    ) : (
                      <em>SELECCIONAR SOCIO CONVOCANTE</em>
                    );
                  }}
                >
                  <MenuItem disabled value="">
                    <em>SELECCIONAR SOCIO CONVOCANTE</em>
                  </MenuItem>
                  {socios.map((socio) => (
                    <MenuItem key={socio.id} value={socio.id.toString()}>
                      {socio.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="entidadContainer">
              <p className="error">
                {msjsValidaciones.entidadQueRepresenta &&
                  msjsValidaciones.entidadQueRepresenta._errors[0]}
              </p>
              <Typography className="entidadText">
                <label>Entidad que representa:</label>
              </Typography>
              <TextField
                variant="outlined"
                label="Ingrese la entidad que representa"
                value={entidad}
                onChange={(e) => setEntidad(e.target.value)}
                className="inputField"
              />
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="buttons">
          <Button type="submit" variant="contained" className="sendButton">
            Enviar
          </Button>
          <Button variant="contained" className="cancelButton">
            Cancelar
          </Button>
        </div>
      </form>
      {showSuccessAlert && (
        <AlertasSinRedireccionar
          title="Aceptar"
          msjAlerta="AGREGADO EXITOSAMENTE"
          // ruta="/eventos"
          action={handleCloseSuccessAlert}
        />
      )}
    </>
  );
};

FormInvitacionEvento.propTypes = {
  uuid: PropTypes.string.isRequired,
};

export default FormInvitacionEvento;
