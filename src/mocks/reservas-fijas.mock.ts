// src/mocks/reservasFijas.mock.ts
import { ReservaFija, RespuestaApi } from "../types";

export const RESERVAS_FIJAS_MOCK: ReservaFija[] = [
  {
    id: "fij-07",
    espacioId: "esp-02",
    titular: "Grupo de los martes",
    dia: 2, // Martes
    inicio: "21:00",
    fin: "22:00",
    desde: "2026-03-01",
    hasta: null, // Sigue activa indefinidamente
    activa: true,
  },
  {
    id: "fij-08",
    espacioId: "esp-04",
    titular: "Club Atlético Villaguay - Entrenamiento Básquet",
    dia: 4, // Jueves
    inicio: "18:00",
    fin: "20:00",
    desde: "2026-02-15",
    hasta: "2026-11-30",
    activa: true,
  },
  {
    id: "fij-09",
    espacioId: "esp-11",
    titular: "Escuela Municipal de Deporte Adaptado",
    dia: 1, // Lunes
    inicio: "09:00",
    fin: "11:00",
    desde: "2026-03-01",
    hasta: null,
    activa: true,
  },
];

// Helper asíncrono para simular latencia de red
const esperar = (ms: number) =>
  new Promise<void>((resolver) => setTimeout(resolver, ms));

// Obtener todas las reservas fijas (para consulta general o panel)
export const obtenerReservasFijasMock = async (): Promise<
  RespuestaApi<ReservaFija[]>
> => {
  await esperar(500);

  return {
    datos: RESERVAS_FIJAS_MOCK,
    meta: {
      total: RESERVAS_FIJAS_MOCK.length,
      pagina: 1,
      porPagina: 20,
    },
  };
};

// Obtener las reservas fijas de un espacio específico (clave para la grilla de turnos)
export const obtenerReservasFijasPorEspacioMock = async (
  espacioId: string,
): Promise<RespuestaApi<ReservaFija[]>> => {
  await esperar(400);

  const fijasEspacio = RESERVAS_FIJAS_MOCK.filter(
    (f) => f.espacioId === espacioId && f.activa,
  );

  return {
    datos: fijasEspacio,
    meta: {
      total: fijasEspacio.length,
      pagina: 1,
      porPagina: 20,
    },
  };
};
