import React, { useEffect, useState } from "react";
import { setTitle } from "../utils/const";
import CardEvent from "../components/CardEvent";
import "../styles/allEvent.css";
import FiltroEvento from "../components/filtroEventos";
import BusquedaBar from "../components/busquedaBar";
import { estilosBarraBusqueda } from "../styles/stylesComponent";
import { usePageEventosStore } from "../store/pageEventosStore";
import SelectorPaginaEventos from "../components/SelectorPaginaEventos";
import {
  AlertasConfirmar,
  AlertasSinRedireccionar,
} from "../components/Alertas";

const AllEvent = () => {
  const {
    eventos,
    fetchEventos,
    paginaActual,
    getEventosPorPagina,
    setEventosPorPagina,
  } = usePageEventosStore();
  const [eventosFiltrados, setEventosFiltrados] = useState([]);

  useEffect(() => {
    setTitle("Eventos");
    setEventosPorPagina(8);
    fetchEventos();
  }, []);

  useEffect(() => {
    const eventosPaginados = getEventosPorPagina();
    setEventosFiltrados(eventosPaginados);
  }, [eventos, paginaActual]);

  const handleFilteredResults = (filteredResults) => {
    setEventosFiltrados(filteredResults);
  };

  useEffect(() => {
    if (eventosFiltrados.length === 0) {
      setAlerta(true);
    } else {
      setAlerta(false);
    }
  }, [eventosFiltrados]);

  const [alerta, setAlerta] = useState(false);

  return (
    <div className="body-allSocios">
      <main className="sectionPpalEventos">
        <section className="alingTitle">
          <h2 className="titleAllEvent">Eventos</h2>
        </section>
        <section className="aligFLitroBusqueda">
          <BusquedaBar
            objEvent={eventos}
            onFiltred={handleFilteredResults}
            estilos={estilosBarraBusqueda}
          />
          <FiltroEvento></FiltroEvento>
        </section>
        <section>
          <ul className="listEvent">
            {eventosFiltrados?.length === 0 && <h3 className="noEvent">No se encontro evento</h3>}
            {eventosFiltrados?.map((e, i) => (
              <li key={i}>
                {
                  <CardEvent
                    id={e.id}
                    title={e.nombre}
                    fechaFin={e.fechaFin}
                    fechaInicio={e.fechaInicio}
                    horaInicio={e.horaInicio}
                    horaFin={e.horaFin}
                    estado={e.estado !== null ? e.estado : ""}
                    lugar={e.ubicacion !== null ? e.ubicacion.direccion : ""}
                    departamento={e.departamento ? e.departamento.nombre : ""}
                    mod={e.modalidad}
                  />
                }
              </li>
            ))}
          </ul>
        </section>
        <SelectorPaginaEventos />
      </main>
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
    </div>
  );
};

Event.propTypes = {};

export default AllEvent;
