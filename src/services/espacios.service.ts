import { obtenerDeportesMock } from "../mocks/deportes.mock";
import { obtenerEspaciosMock } from "../mocks/espacios.mock";
import type {
  Deporte,
  Espacio,
  RespuestaApi,
  RespuestaError,
  RespuestaExitosa,
} from "../types";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL?.trim().replace(/\/+$/, "");

export const catalogoDesdeApi = Boolean(API_BASE_URL);

function esRespuestaExitosa<T>(valor: unknown): valor is RespuestaExitosa<T> {
  if (typeof valor !== "object" || valor === null || !("datos" in valor)) {
    return false;
  }

  const respuesta = valor as { datos: unknown; meta?: unknown };
  if (!Array.isArray(respuesta.datos) || typeof respuesta.meta !== "object") {
    return false;
  }

  if (respuesta.meta === null) return false;

  const meta = respuesta.meta as Record<string, unknown>;
  return (
    typeof meta.total === "number" &&
    typeof meta.pagina === "number" &&
    typeof meta.porPagina === "number"
  );
}

function esRespuestaError(valor: unknown): valor is RespuestaError {
  if (typeof valor !== "object" || valor === null || !("error" in valor)) {
    return false;
  }

  const error = valor.error;
  return (
    typeof error === "object" &&
    error !== null &&
    "codigo" in error &&
    typeof error.codigo === "string" &&
    "mensaje" in error &&
    typeof error.mensaje === "string"
  );
}

async function obtenerLista<T>(
  ruta: string,
  obtenerMock: () => Promise<RespuestaApi<T[]>>,
): Promise<RespuestaApi<T[]>> {
  if (!API_BASE_URL) return obtenerMock();

  try {
    const respuesta = await fetch(`${API_BASE_URL}${ruta}`);
    const cuerpo: unknown = await respuesta.json();

    if (!respuesta.ok || !esRespuestaExitosa<T[]>(cuerpo)) {
      if (esRespuestaError(cuerpo)) return cuerpo;

      return {
        error: {
          codigo: `HTTP_${respuesta.status}`,
          mensaje: "La API devolvió una respuesta que no pudimos interpretar.",
        },
      };
    }

    return cuerpo;
  } catch (error) {
    return {
      error: {
        codigo: "SIN_CONEXION",
        mensaje:
          error instanceof Error
            ? `No se pudo conectar con la API. Revisa la dirección y que el servidor esté encendido. ${error.message}`
            : "No se pudo conectar con la API. Revisa la dirección y que el servidor esté encendido.",
      },
    };
  }
}

export function obtenerEspaciosServicio(): Promise<RespuestaApi<Espacio[]>> {
  return obtenerLista("/espacios?porPagina=100", obtenerEspaciosMock);
}

export function obtenerDeportesServicio(): Promise<RespuestaApi<Deporte[]>> {
  return obtenerLista("/deportes?porPagina=100", obtenerDeportesMock);
}
