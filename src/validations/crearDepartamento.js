import * as z from "zod";

const autoridadSchema = z.object({
  puesto: z
    .string()
    .min(1, { message: " Puesto es obligatorio. " })
    .refine((puesto) => puesto !== "ROL", {
      message: "Puesto no puede ser igual a 'ROL'. ",
    }),
  usuarioId: z.number({ required_error: " Usuario es obligatorio. " }),
});

export const departmentSchema = z.object({
  name: z
    .string()
    .min(1, { message: "El nombre es un campo obligatorio" })
    .max(100, { message: "El nombre no puede superar los 100 caracteres" }),
  objective: z
    .string()
    .min(1, { message: "La descripcion es un campo obligatorio" })
    .max(1000, {
      message: "La descripcion no puede superar los 1000 caracteres",
    }),
  logo: z
    .string()
    .refine(
      (logo) =>
        logo.endsWith(".jpg") || logo.endsWith(".jpeg") || logo.endsWith(".JPG") || logo.endsWith(".JPEG"),
      {
        message: "No hay un archivo jpg cargado",
      }
    ),
  autoridades: z
    .array(autoridadSchema)
    .nonempty({ message: "Debe haber al menos una autoridad" })
    .refine(
      (autoridades) => {
        const presidenteCount = autoridades.filter(
          (a) => a.puesto === "PRESIDENTE"
        ).length;
        return presidenteCount === 1;
      },
      {
        message: "Debe haber exactamente 1 presidente en las autoridades",
      }
    ),
});
