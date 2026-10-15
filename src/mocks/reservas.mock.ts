// src/mocks/reservas.mock.ts
import { delay } from "../helper/delay";
import { Reserva, RespuestaApi } from "../types";

export const RESERVAS_MOCK: Reserva[] = [
  {
    id: "res-1180",
    turnoId: "tur-0219-19",
    espacioId: "esp-02",
    usuarioId: "usr-207",
    cantidadPersonas: 10,
    codigoQr: "VGY-1180-0219-19",
    estado: "confirmada",
    ingresoEn: null,
    creadaEn: "2026-09-16T21:04:00-03:00",
    cancelableHasta: "2026-09-19T15:00:00-03:00",
  },
];

// Obtener las reservas de un usuario específico
export const obtenerReservasPorUsuarioMock = async (
  usuarioId: string,
): Promise<RespuestaApi<Reserva[]>> => {
  await delay(600);

  const reservasUsuario = RESERVAS_MOCK.filter(
    (r) => r.usuarioId === usuarioId,
  );

  return {
    datos: reservasUsuario,
    meta: {
      total: reservasUsuario.length,
      pagina: 1,
      porPagina: 20,
    },
  };
};

export const crearReservaMock = async (
  turnoId: string,
  espacioId: string,
  usuarioId: string,
  cantidadPersonas: number,
): Promise<RespuestaApi<Reserva>> => {
  await delay(800);

  const idGenerado = `res-${Math.floor(1000 + Math.random() * 9000)}`;
  const fechaActual = new Date().toISOString();

  const nuevaReserva: Reserva = {
    id: idGenerado,
    turnoId,
    espacioId,
    usuarioId,
    cantidadPersonas,
    codigoQr: `VGY-${idGenerado.replace("res-", "")}-${Date.now().toString().slice(-4)}`,
    estado: "confirmada",
    ingresoEn: null,
    creadaEn: fechaActual,
    cancelableHasta: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Ej: 24hs después
  };

  RESERVAS_MOCK.push(nuevaReserva);

  return {
    datos: nuevaReserva,
    meta: {
      total: 1,
      pagina: 1,
      porPagina: 1,
    },
  };
};

// Cancelar una reserva (caso feo: reserva cancelada)
export const cancelarReservaMock = async (
  reservaId: string,
): Promise<RespuestaApi<Reserva>> => {
  await delay(500);

  const reserva = RESERVAS_MOCK.find((r) => r.id === reservaId);

  if (!reserva) {
    return {
      error: {
        codigo: "RESERVA_NO_ENCONTRADA",
        mensaje: "La reserva que intentas cancelar no existe.",
      },
    };
  }

  reserva.estado = "cancelada";

  return {
    datos: reserva,
    meta: {
      total: 1,
      pagina: 1,
      porPagina: 1,
    },
  };
};
