// src/servicios/turnos.service.ts
import {
    obtenerTurnosPorEspacioYFechaMock,
    TurnoMock,
} from "../mocks/turnos.mock";
import { RespuestaApi } from "../types";

export const obtenerTurnosServicio = async (
  espacioId: string,
  fecha: string,
): Promise<RespuestaApi<TurnoMock[]>> => {
  try {
    const resultado = await obtenerTurnosPorEspacioYFechaMock(espacioId, fecha);
    return resultado;
  } catch (err: any) {
    return {
      error: {
        codigo: err?.codigo || "ERROR_INESPERADO",
        mensaje:
          err?.message || "No se pudieron cargar los turnos de la grilla.",
      },
    };
  }
};
