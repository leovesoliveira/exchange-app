import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./components/app";
import "./i18n";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
