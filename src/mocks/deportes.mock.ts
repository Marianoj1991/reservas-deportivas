// src/mocks/deportes.mock.ts
import { delay } from "../helper/delay";
import { Deporte, RespuestaApi } from "../types";

export const DEPORTES_MOCK: Deporte[] = [
  {
    id: "dep-futbol5",
    nombre: "Fútbol 5",
    icono: "football-outline",
    color: "#2E7D32",
  },
  {
    id: "dep-futbol11",
    nombre: "Fútbol 11",
    icono: "football",
    color: "#1B5E20",
  },
  {
    id: "dep-basquet",
    nombre: "Básquet",
    icono: "basketball-outline",
    color: "#E65100",
  },
  {
    id: "dep-voley",
    nombre: "Vóley",
    icono: "volleyball",
    color: "#01579B",
  },
  {
    id: "dep-tenis",
    nombre: "Tenis",
    icono: "tennisball-outline",
    color: "#F57F17",
  },
  {
    id: "dep-gimnasio",
    nombre: "Gimnasio Cerrado",
    icono: "fitness-outline",
    color: "#4A148C",
  },
];

export const obtenerDeportesMock = async (): Promise<
  RespuestaApi<Deporte[]>
> => {
  await delay(600);

  return {
    datos: DEPORTES_MOCK,
    meta: {
      total: DEPORTES_MOCK.length,
      pagina: 1,
      porPagina: 20,
    },
  };
};

export const obtenerDeportePorIdMock = async (
  id: string,
): Promise<RespuestaApi<Deporte>> => {
  await delay(400);
  const deporteEncontrado = DEPORTES_MOCK.find((d) => d.id === id);

  if (!deporteEncontrado) {
    return {
      error: {
        codigo: "DEPORTE_NO_ENCONTRADO",
        mensaje: "El deporte solicitado no existe en el sistema.",
      },
    };
  }

  return {
    datos: deporteEncontrado,
    meta: {
      total: 1,
      pagina: 1,
      porPagina: 1,
    },
  };
};
