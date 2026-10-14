import { iniciarSesionMock } from "../mocks/auth.mock";
import { RespuestaApi, Usuario } from "../types";
import { ErrorApi } from "./errors.service";

export interface Sesion {
  token: string;
  usuario: Usuario;
}

export const iniciarSesionServicio = async (
  email: string,
  contrasenia: string,
): Promise<RespuestaApi<Sesion>> => {
  try {
    const emailNormalizado = email.trim().toLowerCase();

    const { datos, meta } = await iniciarSesionMock(
      emailNormalizado,
      contrasenia,
    );

    return {
      datos,
      meta,
    };
  } catch (error) {
    if (error instanceof ErrorApi) {
      throw error;
    }

    throw new ErrorApi(
      "SIN_CONEXION",
      "No hay conexión con el servidor. Revisá tu red e intentá de nuevo.",
    );
  }
};
