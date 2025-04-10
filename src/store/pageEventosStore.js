import { create } from "zustand";
import axios from "axios";
import {
  obtenerEstadosEvento,
  obtenerModalidadesEvento,
} from "../store/eventoStore";
import { getDepartmentsName } from "../store/departmentStore";
import { getEventos } from "../store/eventoStore";

export const usePageEventosStore = create((set,get) => ({
  estados: [],
  modalidades: [],
  departamentos: [],
  filtros: {
    estado: "",
    modalidad: "",
    departamento: []
  },
  eventos: [],
  paginaActual: 1,
  eventosPorPagina: 8,
  totalEventos: 0,

  setPaginaActual: (pagina) => set({ paginaActual: pagina }),
  setEventosPorPagina: (cantidad) => set({ eventosPorPagina: cantidad }),
  setTotalEventos: (total) => set({ totalEventos: total }),
  setEventos: (eventos) => set({ eventos }),
  setEstados: (estados) => set({ estados }),
  setModalidades: (modalidades) => set({ modalidades }),
  setDepartamentos: (departamentos) => set({ departamentos }),
  setFiltros: (nuevosFiltros) => {
    set((state) => ({
      filtros: {
        ...state.filtros,
        ...nuevosFiltros
      }
    }));
  },
  
  getTotalPaginas: () => {
    const { totalEventos, eventosPorPagina } = get();
    return Math.ceil(totalEventos / eventosPorPagina);
  },

  getEventosPorPagina: () => {
    const { eventos, paginaActual, eventosPorPagina } = get();
    const startIndex = (paginaActual - 1) * eventosPorPagina;
    return eventos.slice(startIndex, startIndex + eventosPorPagina);
  },

  clearFiltros: () => {
    get().fetchEventos();
    set({ filtros: { estado: "", modalidad: "", departamento: [] }, totalEventos:  get().eventos.length  });
  },

  fetchEventos: async () => {
    const { eventos, totalEventos } = get();

  if (eventos.length === 0 || eventos.length !== totalEventos) {

    getEventos()
      .then((response) => {
        set({ eventos: response.data,
            totalEventos: response.data.length,
            });
      })
      .catch((error) => {
        console.error('Error fetching events:', error);
      });
  }},

  applyFilters: async () => {
    
    const { filtros } = get();

    try {
      const params = Object.entries(filtros).reduce((acc, [key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(val => {
            if (val) { // Solo agregar valores no-null/undefined.
              if (!acc[key]) {
                acc[key] = [];
              }
              acc[key].push(val);
            }
          });
        } else if (value) {
          // Para valores no-array, solo agregar la clave-valor.
          acc[key] = value;
        }
        return acc;
      }, {});
      
      const queryString = Object.keys(params).map(key => {
        const value = params[key];
        if (Array.isArray(value)) {
          // Para arrays, repetir la clave para cada valor.
          return value.map(v => `${key}=${encodeURIComponent(v)}`).join('&');
        } else {
          // Para valores no-array, solo agregar la clave-valor.
          return `${key}=${encodeURIComponent(value)}`;
        }
      }).join('&');

      const response = await axios.get(`https://copal-back.onrender.com/evento/filtro?${queryString}`);

      set({ eventos: response.data,
            totalEventos: response.data.length
          });
    } catch (error) {
      console.error('Error fetching filtered events:', error);
    }
  },  

  fetchEstados: async () => {
    try {
      const estados = await obtenerEstadosEvento();
      set({ estados });
    } catch (error) {
      console.error("Error al obtener los estados del evento", error);
    }
  },

  fetchModalidades: async () => {
    try {
      const modalidades = await obtenerModalidadesEvento();
      set({ modalidades });
    } catch (error) {
      console.error("Error al obtener las modalidades del evento", error);
    }
  },

  fetchDepartamentos: async () => {
    try {
      const departamentos = await getDepartmentsName();
      set({ departamentos });
    } catch (error) {
      console.error("Error al obtener los departamentos", error);
    }
  },
}));
