import axios from "axios";

export const ObtenerProvinciaApi = async () => {
  try {
    const response = await axios.get(`https://copal-back.onrender.com/api/provincia/provinciasNombre`);
    return await response.data;
  } catch (error) {
    console.log(error);
  }
};

export const ObtenerLocalidadApi = async (provincia) => {
  try {
    const response = await axios.get(`https://copal-back.onrender.com/api/provincia/nombresLocalidades?nombreProvincia=${provincia}`);
    return await [...new Set(response.data.sort())];
  } catch (error) {
    console.log(error);
  }
};