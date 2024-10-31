import { useAtom } from "jotai";
import { themeAtom } from "@/store/themeAtom";
import { themes, sortedThemeNames } from "@/utils/theme/themes";

export function useThemes() {
  const [currentThemeName, setCurrentThemeName] = useAtom(themeAtom);

  return {
    themes,
    currentThemeName,
    setCurrentThemeName,
    currentTheme: themes[currentThemeName].mantineTheme,
    sortedThemeNames,
  };
}
