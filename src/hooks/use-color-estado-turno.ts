import { Colors } from "../constants/theme";
import { EstadoTurno } from "../types";
import { useEsquema } from "./use-esquema";

export function useEstadoTurnoColor(estado: EstadoTurno) {
  const theme = useEsquema();
  return Colors[theme].estadoTurno;
}
