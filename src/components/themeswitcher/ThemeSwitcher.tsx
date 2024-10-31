import { Select, Group } from "@mantine/core";
import { useThemes } from "@/hooks/use-themes";
import { ThemeName } from "@/utils/theme/themes";
import { SchemeToggleButton } from "../schemetoggle/SchemeToggle";
import style from "./style.module.css";

const ThemeSwitcher = () => {
  const { currentThemeName, setCurrentThemeName, sortedThemeNames, themes } =
    useThemes();

  return (
    <div className={style.theme}>
      <SchemeToggleButton />
      <Group align="center">
        <Select
          value={currentThemeName}
          onChange={(value) => {
            if (value && sortedThemeNames.includes(value as ThemeName)) {
              setCurrentThemeName(value as ThemeName);
            }
          }}
          data={sortedThemeNames.map((themeName) => ({
            value: themeName,
            label: themes[themeName].label,
          }))}
          styles={{ input: { width: 100 } }}
        />
      </Group>
    </div>
  );
};

export default ThemeSwitcher;