export const socioCopal = { id: 0, name: "SOCIO COPAL" };

export function setTitle(text) {
  const titleElement = document.querySelector("title");
  titleElement.textContent = `${text} - Copal`;
}

export const EventoFormat = (fechaFin, fechaInicio, horaInicio, horaFin) => {
  if (fechaInicio && fechaFin) {
    const fechaInicioReverse = fechaInicio.slice().reverse();
    // console.log(fechaInicioReverse);
    const fechaFinReverse = fechaFin.slice().reverse();
    // console.log(fechaFinReverse);

    const fecha_inicio = fechaInicioReverse.join("-");
    const fecha_Fin = fechaFinReverse.join("-");

    //formateo de hora
    const fecha_hora_inicio =
      String(horaInicio[0]).padStart(2, "0") +
      ":" +
      String(horaInicio[1]).padStart(2, "0");
    const fecha_hora_fin =
      String(horaFin[0]).padStart(2, "0") +
      ":" +
      String(horaFin[1]).padStart(2, "0");
    return { fecha_inicio, fecha_Fin, fecha_hora_inicio, fecha_hora_fin };
  }
};

export const TIPOS_PARTICIPANTES = {
  SOCIO: "ASOCIADO",
  INVITADO: "INVITADO",
};
