import * as z from "zod";

export const eventoSchema = z.object({
  nombre: z
    .string()
    .min(1, { message: "El titulo es obligatorio" })
    .max(100, { message: "El titulo no puede superar los 100 caracteres" }),
  departamento: z
    .string()
    .min(1, { message: "El departamento es obligatorio" }),
  descripcion: z
    .string()
    .min(1, { message: "La descripcion es obligatoria" })
    .max(1000, {
      message: "La descripcion no puede superar los 1000 caracteres",
    }),
  estado: z
    .string()
    .min(1, { message: "El estado es obligatorio" })
    .max(100, { message: "El estado no puede superar los 100 caracteres" }),
  modalidad: z
    .string()
    .min(1, { message: "La modalidad es obligatoria" })
    .max(100, { message: "El modalidad no puede superar los 100 caracteres" }),
  fechaInicio: z.date().refine((date) => date !== null && date !== undefined, {
    message: "fechaInicio obligatoria",
  }),
  horaInicio: z.date().refine((date) => date !== null && date !== undefined, {
    message: "horaInicio obligatoria",
  }),
  fechaFin: z.date().refine((date) => date !== null && date !== undefined, {
    message: "fechaFin obligatoria",
  }),
  horaFin: z.date().refine((date) => date !== null && date !== undefined, {
    message: "horaFin obligatoria",
  }),
});

export const validarUbicacionesEvento = (eventoAValidar) => {
  let errores = [];
  if (
    eventoAValidar.modalidad.toUpperCase() === "VIRTUAL" ||
    eventoAValidar.modalidad.toUpperCase() === "HIBRIDA"
  ) {
    if (!eventoAValidar.plataforma || eventoAValidar.plataforma === "") {
      errores.push({
        code: "custom_error",
        message: "Plataforma requerida",
        path: ["plataforma"],
      });
    }
    if (!eventoAValidar.linkReunion || eventoAValidar.linkReunion === "") {
      errores.push({
        code: "custom_error",
        message: "Link reunion requerido",
        path: ["linkReunion"],
      });
    }
  }
  if (
    eventoAValidar.modalidad.toUpperCase() === "PRESENCIAL" ||
    eventoAValidar.modalidad.toUpperCase() === "HIBRIDA"
  ) {
    const lugarAValidar = eventoAValidar.lugar;
    if (!lugarAValidar.provincia || lugarAValidar.provincia === "") {
      errores.push({
        code: "custom_error",
        message: "Provincia requerida",
        path: ["lugar", "provincia"],
      });
    }
    if (!lugarAValidar.localidad || lugarAValidar.localidad === "") {
      errores.push({
        code: "custom_error",
        message: "Localidad requerida",
        path: ["lugar", "localidad"],
      });
    }
    if (!lugarAValidar.direccion || lugarAValidar.direccion === "") {
      errores.push({
        code: "custom_error",
        message: "Direccion requerida",
        path: ["lugar", "direccion"],
      });
    }
    if (!lugarAValidar.piso || lugarAValidar.piso === "") {
      errores.push({
        code: "custom_error",
        message: "Piso requerido",
        path: ["lugar", "piso"],
      });
    }
  }
  if (errores.length > 0) throw new z.ZodError(errores);
};
