import { View, type ViewProps } from "react-native";

import { useThemeColor } from "@/src/hooks/use-theme-color";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "fondoApp",
  ) as string;

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
