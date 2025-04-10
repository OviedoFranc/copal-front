import React, { useEffect, useState } from "react";
import { setTitle } from "../utils/const";
import CardReserva from "../components/CardReserva";
import "../styles/Reservas.css";
import "../styles/allReservas.css";
import BusquedaReservaBar from "../components/reservaComponentes/BusquedaReservaBar";
import { estilosBarraBusqueda } from "../styles/stylesComponent";
import FiltroReserva from "../components/reservaComponentes/FiltroReserva";
import usePageReservaStore from "../store/PageReservaStore";
import SelectorPaginaReserva from "../components/reservaComponentes/SelectorPaginaReserva";

const AllReservas = () => {
  setTitle("Reservas");
  const [reservas, setReservas] = useState();
  const { reservasStore, fetchReservas } = usePageReservaStore();

  useEffect(() => {
    fetchReservas();
  }, []);

  useEffect(() => {
    setReservas(reservasStore);
  }, [reservasStore]);

  const handleFilteredResults = (e) => {
    console.log(e);
    setReservas(e);
  };

  return (
    <main className="body-allSocios">
      <section className="sectionPpalReservas">
        <section className="titleReservasAlign">
          <h2>Reservas</h2>
        </section>
        <section className="aligFLitroBusqueda">
          <BusquedaReservaBar
            estilos={estilosBarraBusqueda}
            objEvent={reservasStore}
            onFiltred={handleFilteredResults}
          ></BusquedaReservaBar>
          <FiltroReserva />
        </section>
        <main>
          <section>
            {reservas?.length === 0 ? (
              <h2>No hay reservas</h2>
            ) : (
              <ul className="listReservas">
                {reservas?.map((e, i) => (
                  <li key={i}>
                    <CardReserva
                      nombre={e.nombre}
                      id={e.id}
                      fecha={e.fecha}
                      horaInicio={e.horaInicio}
                      horaFin={e.horaFin}
                      lugar={e.lugar.nombre}
                      estado={{
                        id: e?.estadoReserva.id,
                        descripcion: e?.estadoReserva.nombre,
                      }}
                    />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </main>
        <SelectorPaginaReserva />
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
export default AllReservas;
