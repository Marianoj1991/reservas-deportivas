export interface Coordenadas {
  latitud: number;
  longitud: number;
}

export interface Espacio {
  id: string;
  nombre: string;
  deporteId: string;
  complejo: string;
  superficie: string;
  techado: boolean;
  iluminacion: boolean;
  capacidad: number;
  precioPorHora: number;
  coordenadas: Coordenadas;
  imagenes: string[];
  videoUrl: string | null;
  reglas: string;
  activo: boolean;
}

export interface Deporte {
  id: string;
  nombre: string;
  icono: string;
  color: string;
}

export type EstadoTurno = "libre" | "reservado" | "fijo" | "mantenimiento";

export interface Turno {
  id: string;
  espacioId: string;
  fecha: string; // "AAAA-MM-DD"
  inicio: string; // "HH:MM"
  fin: string; // "HH:MM"
  estado: EstadoTurno;
  reservaId: string | null;
  motivoBloqueo: string | null;
  precio: number;
}

export type EstadoReserva = "confirmada" | "cancelada" | "cumplida" | "ausente";

export interface Reserva {
  id: string;
  turnoId: string;
  espacioId: string;
  usuarioId: string;
  cantidadPersonas: number;
  codigoQr: string;
  estado: EstadoReserva;
  ingresoEn: string | null; // cuándo escaneó el encargado
  creadaEn: string; // ISO 8601 con zona
  cancelableHasta: string; // ISO 8601 con zona
}

export interface ReservaFija {
  id: string;
  espacioId: string;
  titular: string;
  dia: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = domingo
  inicio: string;
  fin: string;
  desde: string; // "AAAA-MM-DD"
  hasta: string | null; // null si no tiene fecha de fin
  activa: boolean;
}

export type Rol = "jugador" | "encargado" | "administrador";

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  rol: Rol;
  espaciosFavoritos: string[];
  cancelacionesTardias: number;
  ausencias: number;
}

export interface RespuestaExitosa<T> {
  datos: T;
  meta: {
    total: number;
    pagina: number;
    porPagina: number;
  };
}

export interface RespuestaError {
  error: {
    codigo: string;
    mensaje: string;
  };
}

export type RespuestaApi<T> = RespuestaExitosa<T> | RespuestaError;
