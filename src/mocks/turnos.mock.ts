// src/mocks/turnos.mock.ts
import { delay } from "../helper/delay";
import { EstadoTurno, RespuestaApi, Turno } from "../types";

// Extendemos el tipo Turno localmente para incluir la propiedad 'precio' que devuelve la API
export interface TurnoMock extends Turno {
  precio: number;
}

export const TURNOS_MOCK: TurnoMock[] = [];

// Helper para formatear números a dos dígitos (ej: 8 -> "08")
const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

// Generador automático de los próximos 7 días a partir de hoy (simulado o fecha actual)
const generarFechasProximas = (cantidadDias: number = 7): string[] => {
  const fechas: string[] = [];
  const hoy = new Date();

  for (let i = 0; i < cantidadDias; i++) {
    const fechaActual = new Date(hoy);
    fechaActual.setDate(hoy.getDate() + i);
    const anio = fechaActual.getFullYear();
    const mes = pad(fechaActual.getMonth() + 1);
    const dia = pad(fechaActual.getDate());
    fechas.push(`${anio}-${mes}-${dia}`);
  }

  return fechas;
};

// IDs de espacios que ya conocemos de nuestro mock de espacios
const ESPACIOS_IDS = [
  "esp-01",
  "esp-02",
  "esp-03",
  "esp-04",
  "esp-05",
  "esp-06",
  "esp-07",
  "esp-08",
  "esp-09",
  "esp-10",
  "esp-11",
  "esp-12",
];

const fechasProximas = generarFechasProximas(7);

// Rellenamos la grilla de turnos de 8:00 a 24:00 para los espacios y los 7 días
ESPACIOS_IDS.forEach((espacioId, indexEspacio) => {
  fechasProximas.forEach((fecha, indexFecha) => {
    // CASO ESPECIAL REQUERIDO POR EL PR: Un día entero bloqueado por lluvia / mantenimiento (ej: el segundo día en el espacio esp-01)
    const esDiaLluviaO1Mantenimiento = indexEspacio === 0 && indexFecha === 1;

    for (let hora = 8; hora < 24; hora++) {
      const horaInicio = `${pad(hora)}:00`;
      const horaFin = `${pad(hora + 1)}:00`;
      const idTurno = `tur-${espacioId.replace("esp-", "")}-${fecha.replace(/-/g, "")}-${pad(hora)}`;

      let estado: EstadoTurno = "libre";
      let reservaId: string | null = null;
      let motivoBloqueo: string | null = null;

      if (esDiaLluviaO1Mantenimiento) {
        estado = "mantenimiento";
        motivoBloqueo =
          "Complejo cerrado por condiciones climáticas adversas (lluvia/anegamiento).";
      } else {
        // CASO ESPECIAL REQUERIDO POR EL PR: Reservas fijas todos los martes a las 21:00
        const esMartes = new Date(fecha).getDay() === 2; // 2 suele ser martes según UTC/local
        const esHora21 = hora === 21;

        if (esMartes && esHora21) {
          estado = "fijo";
          reservaId = "res-fija-club";
          motivoBloqueo =
            "Reserva fija institucional (Entrenamientos semanales).";
        } else if ((indexEspacio + indexFecha + hora) % 5 === 0) {
          // Algunos turnos aleatorios reservados para que la grilla no esté vacía
          estado = "reservado";
          reservaId = `res-${indexEspacio}-${hora}`;
        } else if ((indexEspacio + hora) % 7 === 0) {
          // Algunos turnos bloqueados puntuales
          estado = "mantenimiento";
          motivoBloqueo = "Reparación de red / iluminación.";
        }
      }

      TURNOS_MOCK.push({
        id: idTurno,
        espacioId,
        fecha,
        inicio: horaInicio,
        fin: horaFin,
        estado,
        reservaId,
        motivoBloqueo,
        precio: 12000, // Precio base por hora
      });
    }
  });
});

// Servicio mock para obtener los turnos filtrados por espacio y fecha
export const obtenerTurnosPorEspacioYFechaMock = async (
  espacioId: string,
  fecha: string,
): Promise<RespuestaApi<TurnoMock[]>> => {
  await delay(500);

  const turnosFiltrados = TURNOS_MOCK.filter(
    (t) => t.espacioId === espacioId && t.fecha === fecha,
  );

  return {
    datos: turnosFiltrados,
    meta: {
      total: turnosFiltrados.length,
      pagina: 1,
      porPagina: 50,
    },
  };
};

// Servicio mock para simular la creación de una reserva (escritura)
export const reservarTurnoMock = async (
  turnoId: string,
): Promise<RespuestaApi<TurnoMock>> => {
  await delay(800);

  const turno = TURNOS_MOCK.find((t) => t.id === turnoId);

  if (!turno) {
    return {
      error: {
        codigo: "TURNO_NO_ENCONTRADO",
        mensaje: "El turno seleccionado no existe.",
      },
    };
  }

  // CASO FEO: Validar si ya está ocupado (Turno ocupado)
  if (turno.estado !== "libre") {
    return {
      error: {
        codigo: "TURNO_OCUPADO",
        mensaje: "Ese turno ya fue reservado o se encuentra bloqueado.",
      },
    };
  }

  // Simulamos el éxito de la reserva
  turno.estado = "reservado";
  turno.reservaId = `res-nuevo-${Date.now()}`;

  return {
    datos: turno,
    meta: {
      total: 1,
      pagina: 1,
      porPagina: 1,
    },
  };
};
