import { blue } from "./blue";
import { yellow } from "./yellow";
import { createMantineTheme } from "../create-mantine-theme";
import { red } from "./red";

export const themes = {
  blue,
  yellow,
  red,
};

export type ThemeName = keyof typeof themes;

export type Theme = {
  label: string;
  mantineTheme: ReturnType<typeof createMantineTheme>;
};

export const themeNames = Object.keys(themes).map((key) => key as ThemeName);
