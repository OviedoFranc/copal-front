import * as z from "zod";
import { TIPOS_PARTICIPANTES } from "../utils/const";

export const participanteSchema = z.object({
  nombre: z
    .string()
    .min(1, { message: "El nombre es obligatorio" })
    .max(100, { message: "El nombre no puede superar los 100 caracteres" }),
  apellido: z
    .string()
    .min(1, { message: "El apellido es obligatorio" })
    .max(100, { message: "El apellido no puede superar los 100 caracteres" }),
  tipoParticipante: z
    .string()
    .min(1, { message: "El tipoParticipante es obligatorio" })
    .max(100, {
      message: "El tipoParticipante no puede superar los 100 caracteres",
    }),
});

export const validarSocioRepresentando = (participanteAValidar) => {
  let errores = [];
  if (participanteAValidar.tipoParticipante === TIPOS_PARTICIPANTES.SOCIO) {
    if (
      !participanteAValidar.socioAsociadoId ||
      participanteAValidar.socioAsociadoId === "" ||
      participanteAValidar.socioAsociadoId === 0
    ) {
      errores.push({
        code: "custom_error",
        message: "socioAsociadoId requerido",
        path: ["socioAsociadoId"],
      });
    }
  }
  if (participanteAValidar.tipoParticipante === TIPOS_PARTICIPANTES.INVITADO) {
    if (
      !participanteAValidar.socioConvocanteId ||
      participanteAValidar.socioConvocanteId === ""
    ) {
      errores.push({
        code: "custom_error",
        message: "socioConvocanteId requerida",
        path: ["socioConvocanteId"],
      });
    }
    if (
      !participanteAValidar.entidadQueRepresenta ||
      participanteAValidar.entidadQueRepresenta === ""
    ) {
      errores.push({
        code: "custom_error",
        message: "entidadQueRepresenta requerida",
        path: ["entidadQueRepresenta"],
      });
    }
  }
  if (errores.length > 0) throw new z.ZodError(errores);
};
