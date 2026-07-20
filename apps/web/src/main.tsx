import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles.css";
import { initializeAnalytics } from "@/lib/analytics";

initializeAnalytics();

const root = document.getElementById("root");
if (!root) throw new Error("Root element was not found");
const routerBase = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

createRoot(root).render(
  <StrictMode>
    <BrowserRouter basename={routerBase}>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
