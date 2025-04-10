import BarraBusquedaSocio from "../components/paginacion/BarraBusquedaSocio";
import FiltroPagina from "../components/paginacion/FiltroPagina";
import SelectorPagina from "../components/paginacion/SelectorPagina";
import usePageSociosStore from "../store/pageSociosStore";
//CARD SOCIO
import CardSocio from "../components/CardSocio";
import { useEffect, useState } from "react";
import "../styles/allSocios.css";
import { setTitle } from "../utils/const";

const AllSocios = () => {
  setTitle("Socios");

  const { socios, filters, fetchSocios } = usePageSociosStore();

  const [eventosFiltrados, setEventosFiltrados] = useState(socios);
    useEffect(() => {
      setEventosFiltrados(socios);
    }, [socios]);
  
  const handleFilteredResults = (filteredResults) => {
    setEventosFiltrados(filteredResults);
  };
  useEffect(() => {
    
    fetchSocios();
  }, [filters]);
  return (
    <main className="body-allSocios">
      <section style={{ width: "1200px" }}>
        <section className="alingTitleSocio">
          <h1>Socios</h1>
        </section>
        <section>
          <div className="contenedor-Busqueda-Filtro">
            <BarraBusquedaSocio filtro={handleFilteredResults} />
            <FiltroPagina />
          </div>
        </section>
        <section className="containerSocios">
          {eventosFiltrados?.length === 0 && (
            <h3 className="noEvent">No se encontro socio</h3>
          )}
          {eventosFiltrados?.map((socio) => {
            return <CardSocio key={socio.id} socio={socio} />;
          })}
        </section>

        <SelectorPagina />
      </section>
      <img
        src="../src/assets/img-fondo.svg"
        className="img-fondo"
        style={{ left: "-150px", top: "100px" }}
      ></img>
      <img
        src="../src/assets/img-fondo.svg"
        className="img-fondo"
        style={{ right: "-150px", top: "400px" }}
      ></img>
    </main>
  );
};

export default AllSocios;
