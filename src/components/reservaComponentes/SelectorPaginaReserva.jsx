import React from 'react';
import Pagination from '@mui/material/Pagination';
import usePageReservaStore from '../../store/PageReservaStore';

function SelectorPaginaReserva() {
  const { paginaActual, getTotalPaginas, setPaginaActual, fetchReservas } = usePageReservaStore();

  const handleChange = (event, value) => {
       setPaginaActual(value);
       fetchReservas();
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

export default SelectorPaginaReserva;
