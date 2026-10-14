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

import { iniciarSesionServicio } from "../services/auth.service";
import type { Usuario } from "../types";

const CLAVE_TOKEN = "sesion.token";
const CLAVE_USUARIO = "sesion.usuario";

export interface AuthContextValue {
  usuario: Usuario | null;
  /** true mientras se lee la sesión guardada al abrir la app. */
  restaurando: boolean;
  esStaff: boolean;
  iniciarSesion: (email: string, contrasenia: string) => Promise<void>;
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
  // Borramos las dos cosas aunque falle solo una
  await Promise.all([
    SecureStore.deleteItemAsync(CLAVE_TOKEN),
    Storage.removeItem(CLAVE_USUARIO),
  ]);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [restaurando, setRestaurando] = useState(true);

  // Esto pasa apenas abrimos la app, es para ver si hay un usuario guardado
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
          // Sesión a medias es decir falta una de las piezas, se descarta
          await borrarSesionGuardada();
        }
      } catch {
        // Si alguna de los dos falla arrancamos sin sesión
      } finally {
        if (!cancelado) setRestaurando(false);
      }
    }

    restaurar();
    return () => {
      cancelado = true;
    };
  }, []);

  const iniciarSesion = useCallback(
    async (email: string, contrasenia: string) => {
      const { usuario, token } = await iniciarSesionServicio(
        email,
        contrasenia,
      );

      await SecureStore.setItem(CLAVE_TOKEN, token);
      await Storage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
      setUsuario(usuario);
    },
    [],
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
      iniciarSesion,
      cerrarSesion,
    }),
    [usuario, restaurando, esStaff, iniciarSesion, cerrarSesion],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
