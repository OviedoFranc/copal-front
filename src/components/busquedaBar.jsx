import React, { useEffect, useState } from 'react';
import { AutoComplete } from 'antd';
import { FiSearch } from "react-icons/fi";

const BusquedaBar = ({ estilos, objEvent, onFiltred }) => {
    const [eventoFiltrado, setEventoFiltrado] = useState(objEvent);

    useEffect(() => {
        setEventoFiltrado(objEvent);
    }, [objEvent]);

    const dataOption = eventoFiltrado.map(event => ({
        value: event.nombre,
    }));
    const busqueda = (value) => {
        let filtered = objEvent;
        if (value) {
            filtered = objEvent.filter(event =>
                event.nombre.toLowerCase().includes(value.toLowerCase())
            );
        }
        // Check if onFiltred is a function before calling it
        if (typeof onFiltred === 'function') {
            onFiltred(filtered);
        } else {
            console.error('onFiltred is not a function', onFiltred);
        }
    }

    const seleccion = (value) => {
        busqueda(value);
    }

    return (
        <AutoComplete
            options={dataOption}
            onSearch={busqueda}
            placeholder="Buscar..."
            style={estilos}
            onSelect={seleccion}
            bordered={false}
            suffixIcon={<FiSearch style={{ width: 20, height: 20 }} />}
        />
    );
};

export default BusquedaBar;