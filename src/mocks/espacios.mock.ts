import { delay } from "../helper/delay";
import { Espacio, RespuestaApi } from "../types";

export const ESPACIOS_MOCK: Espacio[] = [
  {
    id: "esp-01",
    nombre: "Cancha 1 — Fútbol 5",
    deporteId: "dep-futbol5",
    complejo: "Polideportivo Municipal",
    superficie: "césped sintético",
    techado: false,
    iluminacion: true,
    capacidad: 10,
    precioPorHora: 12000,
    coordenadas: { latitud: -31.8641, longitud: -59.028 },
    imagenes: ["https://api.villaguay.gob.ar/img/cancha1.jpg"],
    videoUrl: "https://api.villaguay.gob.ar/v/cancha1.mp4",
    reglas: "No se permite calzado con tapones de aluminio.",
    activo: true,
  },
  {
    id: "esp-02",
    nombre: "Cancha 2 — Fútbol 5",
    deporteId: "dep-futbol5",
    complejo: "Polideportivo Municipal",
    superficie: "césped sintético",
    techado: false,
    iluminacion: true,
    capacidad: 10,
    precioPorHora: 12000,
    coordenadas: { latitud: -31.8642, longitud: -59.0281 },
    imagenes: ["https://api.villaguay.gob.ar/img/cancha2.jpg"],
    videoUrl: "https://api.villaguay.gob.ar/v/cancha2.mp4",
    reglas: "No se permite calzado con tapones de aluminio.",
    activo: true,
  },
  {
    id: "esp-03",
    nombre: "Cancha Principal — Fútbol 11",
    deporteId: "dep-futbol11",
    complejo: "Polideportivo Municipal",
    superficie: "césped natural",
    techado: false,
    iluminacion: true,
    capacidad: 22,
    precioPorHora: 25000,
    coordenadas: { latitud: -31.8645, longitud: -59.029 },
    imagenes: ["https://api.villaguay.gob.ar/img/futbol11.jpg"],
    videoUrl: "https://api.villaguay.gob.ar/v/futbol11.mp4",
    reglas:
      "Uso obligatorio de Medias altas y 30 minutos de tolerancia para el ingreso.",
    activo: true,
  },
  {
    id: "esp-04",
    nombre: "Cancha 1 — Básquet",
    deporteId: "dep-basquet",
    complejo: "Polideportivo Municipal",
    superficie: "parquet",
    techado: true,
    iluminacion: true,
    capacidad: 10,
    precioPorHora: 10000,
    coordenadas: { latitud: -31.865, longitud: -59.0275 },
    imagenes: ["https://api.villaguay.gob.ar/img/basquet1.jpg"],
    videoUrl: "https://api.villaguay.gob.ar/v/basquet1.mp4",
    reglas: "Calzado exclusivo para superficies indoor (zapatillas limpias).",
    activo: true,
  },
  {
    id: "esp-05",
    nombre: "Cancha 2 — Básquet",
    deporteId: "dep-basquet",
    complejo: "Polideportivo Municipal",
    superficie: "cemento alisado",
    techado: false,
    iluminacion: true,
    capacidad: 10,
    precioPorHora: 8000,
    coordenadas: { latitud: -31.8652, longitud: -59.0277 },
    imagenes: ["https://api.villaguay.gob.ar/img/basquet2.jpg"],
    // Caso especial requerido por el PR: un espacio sin video
    videoUrl: null,
    reglas: "Uso libre respetando turnos de llegada.",
    activo: true,
  },
  {
    id: "esp-06",
    nombre: "Cancha 3 — Básquet",
    deporteId: "dep-basquet",
    complejo: "Polideportivo Municipal",
    superficie: "parquet",
    techado: true,
    iluminacion: true,
    capacidad: 10,
    precioPorHora: 10000,
    coordenadas: { latitud: -31.8655, longitud: -59.028 },
    imagenes: ["https://api.villaguay.gob.ar/img/basquet3.jpg"],
    videoUrl: "https://api.villaguay.gob.ar/v/basquet3.mp4",
    reglas: "Prohibido comer o beber dentro del rectángulo de juego.",
    activo: true,
  },
  {
    id: "esp-07",
    nombre: "Cancha 1 — Vóley",
    deporteId: "dep-voley",
    complejo: "Polideportivo Municipal",
    superficie: "sintético indoor",
    techado: true,
    iluminacion: true,
    capacidad: 12,
    precioPorHora: 9000,
    coordenadas: { latitud: -31.866, longitud: -59.0285 },
    imagenes: ["https://api.villaguay.gob.ar/img/voley1.jpg"],
    videoUrl: "https://api.villaguay.gob.ar/v/voley1.mp4",
    reglas: "No colgarse de la red.",
    activo: true,
  },
  {
    id: "esp-08",
    nombre: "Cancha 2 — Vóley",
    deporteId: "dep-voley",
    complejo: "Polideportivo Municipal",
    superficie: "arena",
    techado: false,
    iluminacion: false,
    capacidad: 12,
    precioPorHora: 7000,
    coordenadas: { latitud: -31.8662, longitud: -59.0288 },
    imagenes: ["https://api.villaguay.gob.ar/img/voley2.jpg"],
    videoUrl: "https://api.villaguay.gob.ar/v/voley2.mp4",
    reglas: "Uso exclusivo de arena, prohibido calzado.",
    activo: true,
  },
  {
    id: "esp-09",
    nombre: "Cancha 1 — Tenis",
    deporteId: "dep-tenis",
    complejo: "Parque Berduc",
    superficie: "polvo de ladrillo",
    techado: false,
    iluminacion: true,
    capacidad: 4,
    precioPorHora: 14000,
    coordenadas: { latitud: -31.87, longitud: -59.035 },
    imagenes: ["https://api.villaguay.gob.ar/img/tenis1.jpg"],
    videoUrl: "https://api.villaguay.gob.ar/v/tenis1.mp4",
    reglas: "Obligatorio pasar la rastra y regar al finalizar el turno.",
    activo: true,
  },
  {
    id: "esp-10",
    nombre: "Cancha 2 — Tenis",
    deporteId: "dep-tenis",
    complejo: "Parque Berduc",
    superficie: "polvo de ladrillo",
    techado: false,
    iluminacion: true,
    capacidad: 4,
    precioPorHora: 14000,
    coordenadas: { latitud: -31.8702, longitud: -59.0352 },
    imagenes: ["https://api.villaguay.gob.ar/img/tenis2.jpg"],
    videoUrl: "https://api.villaguay.gob.ar/v/tenis2.mp4",
    reglas: "Obligatorio pasar la rastra y regar al finalizar el turno.",
    activo: true,
  },
  {
    id: "esp-11",
    nombre: "Gimnasio Cerrado Multiuso",
    deporteId: "dep-gimnasio",
    complejo: "Polideportivo Municipal",
    superficie: "parquet",
    techado: true,
    iluminacion: true,
    capacidad: 50,
    precioPorHora: 30000,
    coordenadas: { latitud: -31.8648, longitud: -59.027 },
    imagenes: ["https://api.villaguay.gob.ar/img/gimnasio.jpg"],
    videoUrl: "https://api.villaguay.gob.ar/v/gimnasio.mp4",
    reglas:
      "Uso institucional y deportivo autorizado por la Dirección de Deportes.",
    activo: true,
  },
];

const CODIGO_ERROR = "ERROR INESPERADO";
const CODIGO_MENSAJE =
  "Ocurrió un error inesperado al intentar iniciar sesión.";

export const obtenerEspaciosMock = async (): Promise<
  RespuestaApi<Espacio[]>
> => {
  await delay(1000);

  try {
    return {
      datos: ESPACIOS_MOCK,
      meta: {
        total: ESPACIOS_MOCK.length,
        pagina: 1,
        porPagina: 20,
      },
    };
  } catch (err) {
    if (err instanceof Error) {
      return {
        error: {
          codigo: CODIGO_ERROR,
          mensaje: err.message || CODIGO_MENSAJE,
        },
      };
    }

    return {
      error: {
        codigo: CODIGO_ERROR,
        mensaje: CODIGO_MENSAJE,
      },
    };
  }
};

export const obtenerEspacioPorIdMock = async (id: string) => {
  delay(500);

  const espacio = ESPACIOS_MOCK.find((es) => es.id === id);

  if (!espacio) {
    return {
      error: {
        codigo: "ESPACIO_NO_ENCONTRADO",
        mensaje: "El espacio deportivo solicitado no existe.",
      },
    };
  }
  return {
    datos: espacio,
    meta: {
      total: 1,
      pagina: 1,
      porPagina: 1,
    },
  };
};
