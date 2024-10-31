import { MantineProvider } from "@mantine/core";
import App from "./App";
import { useThemes } from "./hooks/use-themes";

const Root = () => {
  const { currentTheme } = useThemes();

  return (
    <MantineProvider theme={currentTheme}>
      <App />
    </MantineProvider>
  );
};

export default Root;
