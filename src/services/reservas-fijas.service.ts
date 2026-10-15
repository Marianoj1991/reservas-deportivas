// src/servicios/reservasFijas.service.ts
import {
    obtenerReservasFijasMock,
    obtenerReservasFijasPorEspacioMock,
} from "../mocks/reservas-fijas.mock";
import { ReservaFija, RespuestaApi } from "../types";

export const obtenerReservasFijasServicio = async (): Promise<
  RespuestaApi<ReservaFija[]>
> => {
  try {
    return await obtenerReservasFijasMock();
  } catch (err: any) {
    return {
      error: {
        codigo: err?.codigo || "ERROR_INESPERADO",
        mensaje: err?.message || "No se pudieron obtener las reservas fijas.",
      },
    };
  }
};

export const obtenerReservasFijasPorEspacioServicio = async (
  espacioId: string,
): Promise<RespuestaApi<ReservaFija[]>> => {
  try {
    return await obtenerReservasFijasPorEspacioMock(espacioId);
  } catch (err: any) {
    return {
      error: {
        codigo: err?.codigo || "ERROR_INESPERADO",
        mensaje:
          err?.message ||
          "No se pudieron obtener las reservas fijas del espacio.",
      },
    };
  }
};
