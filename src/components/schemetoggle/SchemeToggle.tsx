import { ActionIcon, Tooltip, useMantineColorScheme } from "@mantine/core";
import { TbMoon, TbSun } from "react-icons/tb";

export function SchemeToggleButton() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <div className="scheme-toggle">
      <Tooltip label="切换明暗">
        <ActionIcon variant="default" onClick={toggleColorScheme}>
          {colorScheme === "light" ? <TbSun /> : <TbMoon />}
        </ActionIcon>
      </Tooltip>
    </div>
  );
}
