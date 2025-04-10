import React, { useEffect, useState } from "react";
import usePageSociosStore from "../../store/pageSociosStore";
import { sociosStore } from "../../store/sociosStore";
import { AutoComplete } from "antd";
import { estilosBarraBusqueda } from "../../styles/stylesComponent";
import { FiSearch } from "react-icons/fi";

const BarraBusquedaSocio =({filtro})=> {
  const { socios } = usePageSociosStore();
  useEffect(() => {
  }, [socios]);

  const handleSearch = (value) => {
    const filteredSocios = socios.filter((socio) =>
      socio.name.toLowerCase().includes(value.toLowerCase())
    );
    filtro(filteredSocios);

  };

  
  return (
    <AutoComplete
      style={estilosBarraBusqueda}
      onSearch={handleSearch}
      bordered={false}
      placeholder="Buscar..."
      suffixIcon={<FiSearch style={{ width: 20, height: 20 }} />}
    />
  );
}

export default BarraBusquedaSocio;
