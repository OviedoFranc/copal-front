import PropTypes from 'prop-types';
import { Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import '../styles/editDepto.css'

const autStyle = {
  width: "200px",
};
const NuevaAutoridad = ({
  selectedPuesto,
  setSelectedPuesto,
  puestos,
  usuarioSelected,
  setUsuarioSelected,
  listUsuarios,
}) => (
  <>
    <FormControl style={autStyle} variant="outlined">
      <InputLabel id="role-label">Rol</InputLabel>
      <Select
        labelId="role-label"
        value={selectedPuesto}
        onChange={(e) => setSelectedPuesto(e.target.value)}
        displayEmpty
      >
        {puestos.map((role, index) => (
          <MenuItem key={index} value={role}>
            {role}
          </MenuItem>
        ))}
      </Select>
    </FormControl>


    <FormControl style={autStyle} variant="outlined">
      <InputLabel className="inputLabelAutoridadNueva" id="usuario-label">
        Nombre Persona
      </InputLabel>
      <Select
        labelId="usuario-label"
        value={usuarioSelected}
        onChange={(e) => setUsuarioSelected(e.target.value)}
        displayEmpty
      >
        {listUsuarios.map((usuario, index) => (
          <MenuItem key={index} value={usuario}>
            {usuario.nombre}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </>
);

NuevaAutoridad.propTypes = {
       selectedPuesto: PropTypes.string,
       setSelectedPuesto: PropTypes.func.isRequired,
       puestos: PropTypes.arrayOf(PropTypes.string).isRequired,
       usuarioSelected: PropTypes.object,
       setUsuarioSelected: PropTypes.func.isRequired,
       listUsuarios: PropTypes.arrayOf(PropTypes.object).isRequired
     };
     

export default NuevaAutoridad;
