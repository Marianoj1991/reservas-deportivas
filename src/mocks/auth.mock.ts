import type { Usuario } from "../types";

// Solo para pruebas porque contrasenia y token no forman parte de Usuario
interface UsuarioMock extends Usuario {
  contrasenia: string;
  token: string;
}

export const EMAIL_QUE_SIMULA_SIN_RED = "sinred@test.com";

export const USUARIOSMOCK: UsuarioMock[] = [
  {
    id: "2345",
    nombre: "Esteban",
    email: "esteban@gmail.com",
    telefono: "2617894565",
    rol: "jugador",
    espaciosFavoritos: [],
    cancelacionesTardias: 0,
    ausencias: 0,
    contrasenia: "123456789",
    token: "jugadortoken",
  },
  {
    id: "1234",
    nombre: "Mariano",
    email: "mariano@gmail.com",
    telefono: "2615488987",
    rol: "encargado",
    espaciosFavoritos: [],
    cancelacionesTardias: 0,
    ausencias: 0,
    contrasenia: "123456789",
    token: "encargadotoken",
  },
  {
    id: "3456",
    nombre: "Laura Gómez",
    email: "laura@gmail.com",
    telefono: "2614123456",
    rol: "administrador",
    espaciosFavoritos: [],
    cancelacionesTardias: 0,
    ausencias: 0,
    contrasenia: "123456789",
    token: "admintoken",
  },
];

const esperar = (ms: number) =>
  new Promise<void>((resolver) => setTimeout(resolver, ms));

export const iniciarSesionMock = async (email: string, contrasenia: string) => {
  try {
    await esperar(1000);

    if (email === EMAIL_QUE_SIMULA_SIN_RED) {
      return {
        error: {
          codigo: "SIN_CONEXION",
          mensaje: "No hay conexión. Revisá tu señal e intenta de nuevo",
        },
      };
    }

    const usuarioEncontrado = USUARIOSMOCK.find((u) => u.email === email);

    if (!usuarioEncontrado || usuarioEncontrado.contrasenia !== contrasenia) {
      return {
        error: {
          codigo: "CREDENCIALES_INVALIDAS",
          mensaje: "Email o contraseña incorrectos.",
        },
      };
    }

    const { contrasenia: _contrasenia, token, ...usuario } = usuarioEncontrado;

    return {
      datos: { token, usuario },
      meta: { total: 1, pagina: 1, porPagina: 1 },
    };
  } catch (err) {
    if (err instanceof Error) {
      return {
        error: {
          codigo: "ERROR_INESPERADO",
          mensaje:
            err.message ||
            "Ocurrió un error inesperado al intentar iniciar sesión.",
        },
      };
    }

    return {
      error: {
        codigo: "ERROR_INESPERADO",
        mensaje: "Ocurrió un error inesperado al intentar iniciar sesión.",
      },
    };
  }
};
