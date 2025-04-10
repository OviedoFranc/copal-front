import React from 'react';
import Pagination from '@mui/material/Pagination';
import { usePageEventosStore } from '../store/pageEventosStore';

function SelectorPaginaEventos() {
       const { paginaActual, getTotalPaginas, setPaginaActual } = usePageEventosStore();

  const handleChange = (event, value) => {
       console.log("pagina actual", value);
    setPaginaActual(value);
  };

  return (
    <div>
      <Pagination
        count={getTotalPaginas()}
        page={paginaActual}
        onChange={handleChange}
        color="primary"
        variant="outlined"
        shape="rounded"
      />
    </div>
  );
}

export default SelectorPaginaEventos;
