import * as z from "zod";

export const reservaSchema = z.object({
  lugar: z.object({
    nombre: z.string().min(1, { message: "El espacio es obligatorio" }),
  }),
  departamento: z.object({
    nombre: z.string().min(1, { message: "El departamento es obligatorio" }),
  }),
  responsable: z
    .string()
    .min(1, { message: "El responsable es obligatorio" })
    .max(100, {
      message: "El responsable no puede superar los 100 caracteres",
    }),
  email: z.string().email({ message: "El email no es valido" }),
  descripcion: z
    .string()
    .min(1, { message: "La descripcion es obligatoria" })
    .max(1000, {
      message: "La descripcion no puede superar los 1000 caracteres",
    }),
  fecha: z.date().refine((date) => !isNaN(date.getTime()), {
    message: "fecha obligatoria",
  }),
  horaInicio: z.date().refine((date) => date !== null && date !== undefined, {
    message: "horaInicio obligatoria",
  }),
  horaFin: z.date().refine((date) => date !== null && date !== undefined, {
    message: "horaFin obligatoria",
  }),
});
