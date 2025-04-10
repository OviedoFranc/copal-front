import React from 'react';
import Pagination from '@mui/material/Pagination';
import usePageSociosStore from '../../store/pageSociosStore';

function SelectorPagina() {
  const { currentPage, totalPages, setCurrentPage, fetchSocios } = usePageSociosStore();

  const handleChange = (event, value) => {
    setCurrentPage(value);
    fetchSocios({ page: value });
  };

  return (
    <div>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handleChange}
        color="primary"
        variant="outlined"
        shape="rounded"
      />
    </div>
  );
}

export default SelectorPagina;
