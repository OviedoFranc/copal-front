// paginationStore.js
import { create } from "zustand";
import axios from "axios";

const usePageSociosStore = create((set, get) => ({
  currentPage: 1,
  totalPages: 1,
  itemsPerPage: 9,
  socios: [], 
  filters: {
    etiqueta: null,
    aniosActivos: null,
    tipoSocio: null,
    nombre: null,
    activo: null
  },

  setFilters: (newFilters) => set({ filters: newFilters }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setTotalPages: (total) => set({ totalPages: total }),
  setItemsPerPage: (count) => set({ itemsPerPage: count }),

  fetchSocios: async (filters = {}) => {
    const filtersSinParsear = get().filters;
    const { tipoSocio, activo, ...otherFilters } = filtersSinParsear;
    const activoValue = activo === "Activo" ? 1 : (activo === "Inactivo" ? 0 : null);
    const currentFilters = {
      pagina: filters.page || 1,
      tamanio: filters.itemsPerPage || 8,
      tipoSocio: tipoSocio || null, // Puedes ajustar el valor por defecto según tus necesidades
      activo: activoValue,
      ...otherFilters,
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
    
      const response = await axios.get(`https://copal-back.onrender.com/socio/busquedaPaginada?${queryString}`);
      set({
        socios: response.data.content,
        totalPages: response.data.totalPages
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
}));

export default usePageSociosStore;
