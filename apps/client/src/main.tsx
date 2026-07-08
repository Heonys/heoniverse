import { createRoot } from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/stores";
import { ErrorBoundary } from "./ErrorBoundary";
import App from "./App";
import { phaserGame } from "@/game";

import "./index.css";
import "react-tooltip/dist/react-tooltip.css";

// Phaser 부팅(비동기)이 끝나야 scene.keys에 씬이 등록된다. 그 전에 React가 렌더되면
// useGame이 undefined 씬을 읽고 죽는다(Chrome은 타이밍이 빨라 안 보이고 Firefox에서 터짐).
// READY 리스너는 SceneManager의 씬 등록 리스너보다 늦게 달리므로 이 시점엔 항상 안전하다.
const renderApp = () => {
  createRoot(document.getElementById("root")!).render(
    <ErrorBoundary>
      <ReduxProvider store={store}>
        <App />
      </ReduxProvider>
    </ErrorBoundary>,
  );
};

if (phaserGame.isRunning) renderApp();
else phaserGame.events.once("ready", renderApp);
