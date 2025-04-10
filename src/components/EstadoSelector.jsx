import React, { useEffect , useState } from 'react';
import PropTypes from 'prop-types';
import { FiDisc } from "react-icons/fi";
import '../styles/EstadoSelector.css';
import { actualizarEstadoEvento, obtenerEstadosEvento } from '../store/eventoStore.js'; 

const EstadoSelector = ({ idEvento, estadoActual, onChangeEvent }) => {

  const [estados, setEstados] = useState([]);
  
  const coloresEstados = {
    1: "#1BEC17", // Activo
    2: "#EDE647", // Suspendido
    3: "#908E8E", // Finalizado
    4: "#F11513", // Cancelado
  };

  const estadoIdMap = {
    Activo: 1,
    Suspendido: 2,
    Finalizado: 3,
    Cancelado: 4,
  };
  
  useEffect(() => {
    async function fetchEstadosEvento() {
      const response = await obtenerEstadosEvento();
      const estadosMapped = response.map(descripcion => ({
        id: estadoIdMap[descripcion],
        descripcion
      }));
      setEstados(estadosMapped);
    }
  
    fetchEstadosEvento();
  }, []);

  return (
    <div className="estado-selector">
      {estados.map((estado) => (
        <button
          key={estado.id}
          disabled={true}
          onClick={() =>  {
            actualizarEstadoEvento(idEvento, estado),
            onChangeEvent(estado)
          }}
          style={{
            color: estado.id === estadoActual.id ? coloresEstados[estado.id] : '#000',
            borderColor: estado.id === estadoActual.id ? coloresEstados[estado.id] : '#CCC',
          }}
          className={`estado-btn ${estado.id === estadoActual.id ? 'active' : ''}`}
        >
          <FiDisc style={{ fontSize: '18px' }} />
          {estado.descripcion}
        </button>
      ))}
    </div>
  );
};

EstadoSelector.propTypes = {
  idEvento: PropTypes.number.isRequired,
  estadoActual: PropTypes.shape({
    id: PropTypes.number,
    descripcion: PropTypes.string,
  }).isRequired,
  onChangeEvent: PropTypes.func,
};

export default EstadoSelector;