// src/servicios/reservas.service.ts
import {
    cancelarReservaMock,
    crearReservaMock,
    obtenerReservasPorUsuarioMock,
} from "../mocks/reservas.mock";
import { Reserva, RespuestaApi } from "../types";

export const obtenerReservasServicio = async (
  usuarioId: string,
): Promise<RespuestaApi<Reserva[]>> => {
  try {
    return await obtenerReservasPorUsuarioMock(usuarioId);
  } catch (err: any) {
    return {
      error: {
        codigo: "ERROR_INESPERADO",
        mensaje: "No se pudieron obtener las reservas.",
      },
    };
  }
};

export const crearReservaServicio = async (
  turnoId: string,
  espacioId: string,
  usuarioId: string,
  cantidadPersonas: number,
): Promise<RespuestaApi<Reserva>> => {
  try {
    const resultado = await crearReservaMock(
      turnoId,
      espacioId,
      usuarioId,
      cantidadPersonas,
    );
    return resultado;
  } catch (err: any) {
    return {
      error: {
        codigo: "ERROR_INESPERADO",
        mensaje: "No se pudo completar la reserva.",
      },
    };
  }
};

export const cancelarReservaServicio = async (
  reservaId: string,
): Promise<RespuestaApi<Reserva>> => {
  try {
    const resultado = await cancelarReservaMock(reservaId);
    return resultado;
  } catch (err: any) {
    return {
      error: {
        codigo: err?.codigo || "ERROR_INESPERADO",
        mensaje: err?.message || "No se pudo cancelar la reserva.",
      },
    };
  }
};
