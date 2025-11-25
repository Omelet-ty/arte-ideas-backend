import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ViewModeProvider } from "./contexts/ViewModeContext";

createRoot(document.getElementById("root")!).render(
  <ViewModeProvider>
    <App />
  </ViewModeProvider>
);
