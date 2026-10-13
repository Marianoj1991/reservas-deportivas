/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { useColorScheme } from "@/src/hooks/use-color-scheme";
import { type ColorKeys, Colors } from "../constants/theme";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: ColorKeys,
): string {
  const theme = useColorScheme() ?? "dark";
  return props[theme] ?? Colors[theme][colorName];
}
