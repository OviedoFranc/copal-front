import { create } from "zustand";
import axios from "axios";

const usePageReservaStore = create((set, get) => ({
  currentPage: 1,
  totalPages: 1,
  itemsPerPage: 8,
  reservasStore: [], 
  filters: {
    estado: null,
  },

  setFilters: (newFilters) => set({ filters: newFilters }) ,
  setTotalPages: (total) => set({ totalPages: total }),
  setPaginaActual: (page) => set({ currentPage: page }),
  setItemsPerPage: (count) => set({ itemsPerPage: count }),
  getTotalPaginas: () => get().totalPages,

  fetchReservas: async (filters = {}) => {

    const currentFilters = {
      pagina:  get().currentPage,
      tamanio:  get().itemsPerPage,
      estado: get().filters.estado,
    };

    try {
      const params = Object.entries(currentFilters).reduce((acc, [key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(val => {
            if (val || value === 0) { // Solo agregar valores no-null/undefined.
              if (!acc[key]) {
                acc[key] = [];
              }
              acc[key].push(val);
            }
          });
        } else if (value || value === 0) {
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
      
      const response = await axios.get(`https://copal-back.onrender.com/reserva/obtenerReservaPaginado?${queryString}`);
      console.log(response.data.content)
      set({
        reservasStore: response.data.content,
        totalPages: response.data.totalPages,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      set({
        reservasStore: [],
      });
    }
  }, 

}));

export default usePageReservaStore;
