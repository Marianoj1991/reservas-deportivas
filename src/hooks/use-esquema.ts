import { useColorScheme } from "@/src/hooks/use-color-scheme";

export function useEsquema(): "light" | "dark" {
  return useColorScheme() ?? "dark";
}
