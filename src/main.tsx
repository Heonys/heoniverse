import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "@/stores";
import App from "./App";

import "@/game";
import "./index.css";
import "react-tooltip/dist/react-tooltip.css";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
  </Provider>,
);
