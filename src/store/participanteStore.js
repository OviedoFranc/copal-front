import axios from "axios";
// participante.js
const API_URL = "https://copal-back.onrender.com";

const agregarParticipante = async (eventoId, participante) => {
  try {
    const response = await fetch(`${API_URL}/agregar/${eventoId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(participante),
    });

    if (!response.ok) {
      throw new Error("Error al agregar participante");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en agregarParticipante: ", error);
    throw error;
  }
};

export { agregarParticipante };

export const formularioInvitacionParticipante = async (
  uuid,
  participanteDTO
) => {
  try {
    const response = await axios.post(
      `${API_URL}/participante/fomulario/${uuid}`,
      participanteDTO
    );
    return response.data;
  } catch (error) {
    console.error("Error al enviar el formulario:", error);
  }
};
