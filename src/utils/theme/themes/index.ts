import { blue } from "./blue";
import { forest } from "./forest";
import { createMantineTheme } from "../create-mantine-theme";

export const themes = {
  blue,
  forest,
};

export type ThemeName = keyof typeof themes;

export type Theme = {
  label: string;
  mantineTheme: ReturnType<typeof createMantineTheme>;
};

export const sortedThemeNames = Object.keys(themes)
  .map((key) => key as ThemeName)
  .sort();
