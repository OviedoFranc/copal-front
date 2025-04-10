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
import { listarEstadosReserva } from "../../store/reservaStore";
import usePageReservaStore from "../../store/PageReservaStore";

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

function FiltroReserva() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedStates, setSelectedStates] = useState([]);
  const [states, setStates] = useState([]);
  
  const { setFilters, fetchReservas } = usePageReservaStore();

  useEffect(() => {
    const fetchStates = async () => {
      const states = await listarEstadosReserva();
      setStates(states);
    };

    fetchStates();
  }, []);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFilter = () => {
    const selectedFilter = selectedStates.map(state => state.nombre);
    setFilters({
        estado: selectedFilter
    });

    fetchReservas();
    handleClose();
  };

  const handleClearFilters = () => {
       setSelectedStates([]);
       setFilters({});
       fetchReservas();
       handleClose();
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
          {/* Estado de reserva */}
          <FormControl fullWidth variant="outlined">
            <InputLabel id="state-label">Estados</InputLabel>
            <Select
              labelId="state-label"
              multiple
              value={selectedStates}
              onChange={(e) => setSelectedStates(e.target.value)}
              label="Estados"
            >
              {states.map((state) => (
                <MenuItem key={state.id} value={state}>
                  {state.nombre}
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

export default FiltroReserva;
