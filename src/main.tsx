import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { LocaleProvider } from "./context/LocaleContext";
import { ThemeProvider } from "./context/ThemeContext";
import { applyLocale, loadLocale } from "./utils/locale";
import { applyTheme, loadTheme } from "./utils/theme";
import "./index.css";

applyTheme(loadTheme());
applyLocale(loadLocale());

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LocaleProvider>
      <ThemeProvider>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </ThemeProvider>
    </LocaleProvider>
  </React.StrictMode>
);