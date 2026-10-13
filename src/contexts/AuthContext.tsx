import * as SecureStore from "expo-secure-store";
import Storage from "expo-sqlite/kv-store";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { authServicio } from "../servicios/auth";
import type { Usuario } from "../types";

const CLAVE_TOKEN = "sesion.token";
const CLAVE_USUARIO = "sesion.usuario";

export interface AuthContextValue {
  usuario: Usuario | null;
  /** true mientras se lee la sesión guardada al abrir la app. */
  restaurando: boolean;
  esStaff: boolean;
  iniciarSesionJugador: (telefono: string, codigo: string) => Promise<void>;
  iniciarSesionStaff: (
    nombreUsuario: string,
    contrasena: string,
  ) => Promise<void>;
  cerrarSesion: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

function leerUsuarioGuardado(texto: string | null): Usuario | null {
  if (!texto) return null;
  try {
    return JSON.parse(texto) as Usuario;
  } catch {
    return null;
  }
}

async function borrarSesionGuardada() {
  // Las dos operaciones arrancan siempre, aunque una falle.
  await Promise.all([
    SecureStore.deleteItemAsync(CLAVE_TOKEN),
    Storage.removeItem(CLAVE_USUARIO),
  ]);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [restaurando, setRestaurando] = useState(true);

  // Al abrir la app: recuperar la sesión guardada, sin pedir red.
  useEffect(() => {
    let cancelado = false;

    async function restaurar() {
      try {
        const token = await SecureStore.getItemAsync(CLAVE_TOKEN);
        const guardado = leerUsuarioGuardado(
          await Storage.getItem(CLAVE_USUARIO),
        );

        if (token && guardado) {
          if (!cancelado) setUsuario(guardado);
        } else if (token || guardado) {
          // Sesión a medias (falta una de las dos piezas): se descarta.
          await borrarSesionGuardada();
        }
      } catch {
        // Si no se puede leer el almacenamiento, se arranca sin sesión.
      } finally {
        if (!cancelado) setRestaurando(false);
      }
    }

    restaurar();
    return () => {
      cancelado = true;
    };
  }, []);

  // Parte compartida de los dos logins.
  const abrirSesion = useCallback(async (token: string, nuevo: Usuario) => {
    await SecureStore.setItemAsync(CLAVE_TOKEN, token);
    await Storage.setItem(CLAVE_USUARIO, JSON.stringify(nuevo));
    setUsuario(nuevo);
  }, []);

  const iniciarSesionJugador = useCallback(
    async (telefono: string, codigo: string) => {
      const { token, usuario: nuevo } = await authServicio.loginJugador(
        telefono,
        codigo,
      );
      await abrirSesion(token, nuevo);
    },
    [abrirSesion],
  );

  const iniciarSesionStaff = useCallback(
    async (nombreUsuario: string, contrasena: string) => {
      const { token, usuario: nuevo } = await authServicio.loginStaff(
        nombreUsuario,
        contrasena,
      );
      await abrirSesion(token, nuevo);
    },
    [abrirSesion],
  );

  const cerrarSesion = useCallback(async () => {
    try {
      await borrarSesionGuardada();
      // Pendiente: borrar acá también las reservas guardadas en SQLite para
      // verlas sin señal. Son del usuario que sale, no de quien use el
      // teléfono después.
    } finally {
      // La pantalla queda deslogueada aunque el borrado haya fallado.
      setUsuario(null);
    }
  }, []);

  // Encargado y administrador hacen lo mismo por ahora. Si los permisos se
  // separan, este es el único lugar que cambia.
  const esStaff =
    usuario?.rol === "encargado" || usuario?.rol === "administrador";

  const value = useMemo<AuthContextValue>(
    () => ({
      usuario,
      restaurando,
      esStaff,
      iniciarSesionJugador,
      iniciarSesionStaff,
      cerrarSesion,
    }),
    [
      usuario,
      restaurando,
      esStaff,
      iniciarSesionJugador,
      iniciarSesionStaff,
      cerrarSesion,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
