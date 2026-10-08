import { useColorScheme } from "@/src/hooks/use-color-scheme";
import { Colors } from "../constants/theme";
import { EstadoTurno } from "../types";

interface Props {
  estado: EstadoTurno;
}

export function useEstadoTurnoColor({ estado }: Props) {
  const theme = useColorScheme() ?? "light";
  return Colors[theme].estadoTurno[estado];
}
