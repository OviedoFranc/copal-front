import * as z from "zod";

export const socioSchema = z.object({
  name: z.string().min(1, { message: "El nombre es un campo obligatorio" }),
  presidente: z
    .string()
    .min(1, { message: "El nombre es un campo obligatorio" }),
  // image: z.string(),
  phone: z.number().int().nullable(),
  mail: z.string().email({ message: "email no valido" }),
  web: z.string().nullable(),
  // dateUnion: z.string().refine((str) => {
  //     // Usar una expresión regular para comprobar si el string cumple el formato yyyy-mm-dd
  //     const regex = /^\d{4}-\d{2}-\d{2}$/;
  //     return regex.test(str);
  //   }, {message: 'no se ingreso una fecha'}),
  cuit: z
    .number({ message: "" })
    .positive()
    .refine(
      (num) => {
        const length = num.toString().length;
        return length === 11;
      },
      {
        message: "El cuil debe tener 11 numeros",
      }
    )
    .refine((val) => val !== null, {
      message: "El campo no puede ser null",
    })
    .nullable(),
  category: z.object(
    {
      id: z.number(),
      name: z.string(),
    },
    { message: "El campo categoria es obligatorio" }
  ),
  etiquetas: z.array(
    z
      .object({
        id: z.number(),
        nombre: z.string(),
      })
      .nullable()
  ),
});