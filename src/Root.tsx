import { MantineProvider } from "@mantine/core";
import App from "./App";
import { useThemes } from "./hooks/use-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Notifications } from "@mantine/notifications";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const Root = () => {
  const { currentTheme } = useThemes();

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={currentTheme}>
        <Notifications />
        <App />
      </MantineProvider>
    </QueryClientProvider>
  );
};

export default Root;
