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
import { getEtiquetas, sociosStore } from "../../store/sociosStore";
import { typeSociosStore } from "../../store/typeSociosStore";
import usePageSociosStore from "../../store/pageSociosStore";
const StyledMenu = styled(Menu)`
  .MuiPaper-root {
    width: 320px; // Ampliado un poco para tener en cuenta el padding
    padding: 0 10px; // Margen a los costados
  }

  .menu-footer {
    display: flex;
    justify-content: space-between;
    padding: 16px;
  }
`;

function FiltroPagina() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedActive, setSelectedActive] = useState("");
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedSocioType, setSelectedSocioType] = useState("");
  const { typeSocios, getTypeSocios } = typeSociosStore();
  const { setFilters } = usePageSociosStore();
  const { statusSocios: status } = sociosStore.getState();

  useEffect(() => {
    const fetchDepartments = async () => {
      const departments = await getEtiquetas();
      setDepartments(departments);
    };

    fetchDepartments();
    getTypeSocios();
  }, []);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFilter = () => {
    setFilters({
      etiqueta: selectedDepartments,
      activo: selectedActive,
      categoria: selectedSocioType,
    });

    handleClose();
  };

  const handleClearFilters = () => {
    setSelectedDepartments([]);
    setSelectedActive("");
    setSelectedSocioType("");
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
          {/* Categoria de socio */}
          <FormControl fullWidth variant="outlined" margin="dense">
            <InputLabel id="active-label"> Tipo de Socio </InputLabel>
            <Select
              labelId="active-label"
              value={selectedSocioType}
              onChange={(e) => setSelectedSocioType(e.target.value)}
              label=" Tipo de Socio "
            >
              {typeSocios.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* Departamentos adheridos */}
          <FormControl fullWidth variant="outlined">
            <InputLabel id="department-label">Etiquetas</InputLabel>
            <Select
              labelId="department-label"
              multiple
              value={selectedDepartments}
              onChange={(e) => setSelectedDepartments(e.target.value)}
              label="Etiquetas"
            >
              {departments.map((department) => (
                <MenuItem key={department.id} value={department.nombre}>
                  {department.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* Activo o inactivo */}
          <FormControl fullWidth variant="outlined" margin="dense">
            <InputLabel id="active-label">Estado</InputLabel>
            <Select
              labelId="active-label"
              value={selectedActive}
              onChange={(e) => setSelectedActive(e.target.value)}
              label="Activo"
            >
              {status.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
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

export default FiltroPagina;
