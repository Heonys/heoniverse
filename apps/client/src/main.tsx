import { createRoot } from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/stores";
import { ErrorBoundary } from "./ErrorBoundary";
import App from "./App";

import "@/game";
import "./index.css";
import "react-tooltip/dist/react-tooltip.css";

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <ReduxProvider store={store}>
      <App />
    </ReduxProvider>
  </ErrorBoundary>,
);
