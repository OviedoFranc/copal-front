import axios from "axios";

export const getEtiquetas = async () => {
  try {
    const response = await axios("https://copal-back.onrender.com/etiquetas");
    return response.data;
  } catch (error) {
    console.error("Error al obtener las etiquetas posibles:", error);
    throw error;
  }
};
