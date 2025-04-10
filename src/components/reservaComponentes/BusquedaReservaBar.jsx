import React, { useEffect, useState } from 'react';
import { AutoComplete } from 'antd';
import { FiSearch } from "react-icons/fi";

const BusquedaReservaBar = ({ estilos, objEvent, onFiltred }) => {
    const [reservaFiltrado, setReservaFiltrado] = useState(objEvent);

    useEffect(() => {
       setReservaFiltrado(objEvent);
    }, [objEvent]);

    const dataOption = reservaFiltrado?.map(event => ({
        value: event.id,
    }));
    const busqueda = (value) => {
        let valor = parseInt(value)
        console.log(valor);
        let filtered = objEvent;
        if (valor) {
          filtered = objEvent.filter(
            (
              event // TODO: CAMBIAR A CODIGO DE RESERVA
            ) => event.id === valor
          );
          console.log(filtered);
        }
        if (typeof onFiltred === 'function') {
            onFiltred(filtered);
        } else {
            console.error('onFiltred is not a function', onFiltred);
        }
    }

    const seleccion = (value) => {
        console.log('Selected Value:', value);
        busqueda(value);
    }

    return (
        <AutoComplete
            options={dataOption}
            onSearch={busqueda}
            placeholder="Ingresar Codigo de Reserva..."
            style={estilos}
            onSelect={seleccion}
            bordered={false}
            suffixIcon={<FiSearch style={{ width: 20, height: 20 }} />}
        />
    );
};

export default BusquedaReservaBar;