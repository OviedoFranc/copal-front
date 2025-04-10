import axios from "axios";

export const modificarRecurso = (id, recurso) => {
  try {
    const response = axios.put(
      `https://copal-back.onrender.com/recurso/actualizar/${id}`,
      recurso
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const crearRecurso = (recurso) => {
  try {
    const response = axios.post(`https://copal-back.onrender.com/recurso/crear`, recurso);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const eliminarRecurso = (id) => {
  try {
    const response = axios.delete(`https://copal-back.onrender.com/recurso/eliminar/${id}`);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const obtenerRecurso = (id) => {
  try {
    const response = axios.get(`https://copal-back.onrender.com/recurso/obtener/${id}`);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const obtenerListaRecursos = async () => {
  try {
    const response = axios.get(`https://copal-back.onrender.com/recurso/recursos`);
    return response;
  } catch (error) {
    console.log(error);
  }
};
