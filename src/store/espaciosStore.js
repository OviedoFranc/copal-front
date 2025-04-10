import axios from "axios";

export const obtenerListaEspacios = () => {
  try {
    const response = axios.get(`https://copal-back.onrender.com/reserva/listarLugares`);
    return response;
  } catch (error) {
    console.log(error);
  }
};
