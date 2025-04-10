import React, { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Menu,
} from "@mui/material";
import { styled } from "@mui/system";
import { usePageEventosStore } from "../store/pageEventosStore";

const StyledMenu = styled(Menu)`
  .MuiPaper-root {
    width: 320px;
    padding: 0 10px;
  }

  .menu-footer {
    display: flex;
    justify-content: space-between;
    padding: 16px;
  }
`;

function FiltroEvento() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEstado, setSelectedEstado] = useState("");
  const [selectedModalidad, setSelectedModalidad] = useState("");
  const [selectedDepartamento, setSelectedDepartamento] = useState([]);

  const {
    estados,
    modalidades,
    departamentos,
    setFiltros,
    applyFilters,
    clearFiltros,
    fetchEstados,
    fetchModalidades,
    fetchDepartamentos
  } = usePageEventosStore();

  useEffect(() => {
    fetchEstados();
    fetchModalidades();
    fetchDepartamentos();
  }, []);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFilter = () => {
    setFiltros({
      estado: selectedEstado,
      modalidad: selectedModalidad,
      departamento: selectedDepartamento,
    });

    applyFilters();

    handleClose();
  };

  const handleClearFilters = () => {
    setSelectedEstado("");
    setSelectedModalidad("");
    setSelectedDepartamento([]);
    clearFiltros();
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleOpen}>
        Seleccionar Filtros
      </Button>

      <StyledMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <div>
          {/* Filtro por estado del evento */}
          <FormControl fullWidth variant="outlined" margin="dense">
            <InputLabel id="estado-label">Estado</InputLabel>
            <Select
              labelId="estado-label"
              value={selectedEstado}
              onChange={(e) => setSelectedEstado(e.target.value)}
              label="Estado"
            >
              {estados.map((estado,i) => (
                <MenuItem key={i} value={estado}>
                  {estado}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Filtro por modalidad del evento */}
          <FormControl fullWidth variant="outlined">
            <InputLabel id="modalidad-label">Modalidad</InputLabel>
            <Select
              labelId="modalidad-label"
              value={selectedModalidad}
              onChange={(e) => setSelectedModalidad(e.target.value)}
              label="Modalidad"
            >
              {modalidades.map((modalidad) => (
                <MenuItem key={modalidad.id} value={modalidad}>
                  {modalidad}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Filtro por departamento */}
          <FormControl fullWidth variant="outlined" margin="dense">
            <InputLabel id="departamento-label">Departamento</InputLabel>
            <Select
              labelId="departamento-label"
              multiple
              value={selectedDepartamento}
              onChange={(e) => setSelectedDepartamento(e.target.value)}
              label="Departamento"
            >
              {departamentos.map((departamento) => (
                <MenuItem key={departamento.id} value={departamento}>
                  {departamento}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="menu-footer">
          <Button onClick={handleClearFilters} size="small">
            Limpiar Filtros
          </Button>
          <Button onClick={handleFilter} color="primary" size="small">
            Filtrar
          </Button>
        </div>
      </StyledMenu>
    </div>
  );
}

export default FiltroEvento;
