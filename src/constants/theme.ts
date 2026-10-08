/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

import type { EstadoTurno } from "../types";

export interface Tema {
  // Fondos y superficies
  fondoApp: string;
  fondoPagina: string;
  superficie1: string; // cards, hojas (bottom sheets)
  superficie2: string; // chips, inputs
  superficie3: string; // etiquetas sobre imagen
  borde: string;

  // Texto e íconos
  textoAlto: string; // texto principal
  textoMedio: string; // texto secundario
  textoBajo: string; // texto terciario / deshabilitado

  // Acento institucional
  verde: string; // CTA primario, chip activo
  verdeTexto: string; // texto/ícono verde sobre fondo propio del tema

  // Estados secundarios
  ambar: string;
  ambarTexto: string;
  rojo: string;
  rojoTexto: string;
  purpura: string;
  purpuraTexto: string;

  // Fijos (no cambian entre temas: texto claro sobre botón/chip sólido)
  textoSobreSolido: string;

  // Colores de los cuatro estados de un turno en la grilla.
  // Mismo shape para los dos temas; lo que cambia es el valor de texto.
  estadoTurno: Record<EstadoTurno, { fondo: string; texto: string }>;
}

export const Colors: Record<string, Tema> = {
  dark: {
    fondoApp: "#121212",
    fondoPagina: "#0a0a0a",
    superficie1: "#1a1a1a",
    superficie2: "#212121",
    superficie3: "#262626",
    borde: "#2c2c2c",

    textoAlto: "#f2f2f0",
    textoMedio: "#b7b7b4",
    textoBajo: "#7c7c79",

    verde: "#2e7d32",
    verdeTexto: "#4caf50",

    ambar: "#ffb300",
    ambarTexto: "#ffb300",
    rojo: "#e5433d",
    rojoTexto: "#ff6a63",
    purpura: "#8e3fc4",
    purpuraTexto: "#c68aef",

    textoSobreSolido: "#eafcea",

    estadoTurno: {
      libre: { fondo: "rgba(46,125,50,.16)", texto: "#4caf50" },
      reservado: { fondo: "rgba(229,67,61,.14)", texto: "#ff6a63" },
      mantenimiento: { fondo: "rgba(255,179,0,.14)", texto: "#ffb300" },
      fijo: { fondo: "rgba(142,63,196,.16)", texto: "#c68aef" },
    },
  },

  light: {
    fondoApp: "#ffffff",
    fondoPagina: "#f4f5f3",
    superficie1: "#f7f7f5",
    superficie2: "#eef0ec",
    superficie3: "#e7e9e2",
    borde: "#dcdedb",

    textoAlto: "#14171a",
    textoMedio: "#5b5e56",
    textoBajo: "#83867e",

    verde: "#2e7d32",
    verdeTexto: "#256029",

    ambar: "#ffb300",
    ambarTexto: "#b26b00",
    rojo: "#e5433d",
    rojoTexto: "#c62828",
    purpura: "#8e3fc4",
    purpuraTexto: "#7b1fa2",

    textoSobreSolido: "#eafcea",

    estadoTurno: {
      libre: { fondo: "rgba(46,125,50,.12)", texto: "#256029" },
      reservado: { fondo: "rgba(229,67,61,.12)", texto: "#c62828" },
      mantenimiento: { fondo: "rgba(255,179,0,.14)", texto: "#b26b00" },
      fijo: { fondo: "rgba(142,63,196,.12)", texto: "#7b1fa2" },
    },
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
