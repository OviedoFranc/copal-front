import axios from "axios";

const reservaAReservaDTO = (reserva) => {
  const HoraInicio = new Date(reserva.horaInicio);
  const horaInicioFormateada = HoraInicio.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const HoraFin = new Date(reserva.horaFin);
  const horaFinFormateada = HoraFin.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return {
    lugar: reserva.lugar,
    departamento: reserva.departamento,
    nombre: reserva.responsable,
    email: reserva.email,
    descripcion: reserva.descripcion,
    fecha: reserva.fecha,
    horaInicio: horaInicioFormateada,
    horaFin: horaFinFormateada,
    recursos: reserva.recursos,
  };
};

export const crearReserva = (reserva) => {
  try {
    const reservaAEnviar = reservaAReservaDTO(reserva);

    const response = axios.post(
      `https://copal-back.onrender.com/reserva/altaReserva`,
      reservaAEnviar
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const eliminarReserva = (id) => {
  try {
    const response = axios.delete(
      `https://copal-back.onrender.com/reserva/eliminarReserva/${id}`
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const modificarReserva = async (id, reserva) => {
  console.log(reserva)
  try {
    const response = await axios.put(
      `https://copal-back.onrender.com/reserva/editarReserva/${id}`,
      reserva
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const obtenerReserva = (id) => {
  try {
    const response = axios.get(
      `https://copal-back.onrender.com/reserva/obtenerReserva/${id}`
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const obtenerReservaPorNombre = (nombre) => {
  try {
    const response = axios.get(
      `https://copal-back.onrender.com/reserva/obtenerReservaPorNombre/${nombre}`
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const obtenerListaReservas = () => {
  try {
    const response = axios.get(`https://copal-back.onrender.com/reserva/listar`);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const obtenerListaReposnsables = (reservaId) => {
  try {
    const response = axios.get(
      `https://copal-back.onrender.com/reserva/${reservaId}/responsables`
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const agregarReposnsable = (reservaId, usuarioId) => {
  try {
    const response = axios.post(
      `https://copal-back.onrender.com/reserva/${reservaId}/responsables/${usuarioId}`
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const quitarReposnsable = (reservaId, usuarioId) => {
  try {
    const response = axios.delete(
      `https://copal-back.onrender.com/reserva/${reservaId}/responsables/${usuarioId}`
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getReserva = async () => {
  const respose = await axios.get(`https://copal-back.onrender.com/reserva/listar`);
  return respose.data
}
export const getReservaById = async (id) => {
  const respose = await axios.get(
    `https://copal-back.onrender.com/reserva/obtenerReserva/${id}`
  );
  return respose.data;
};

export const listarEstadosReserva = async () => {
    const response = await axios.get(
      `https://copal-back.onrender.com/reserva/listarEstados`
    );
    return response.data;
};
