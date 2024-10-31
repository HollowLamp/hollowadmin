import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "normalize.css";
import "@mantine/core/styles.css";
import Root from "./Root";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
