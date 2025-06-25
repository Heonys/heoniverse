import { useRef } from "react";
import { PhaserGame, type PhaserRef } from "@/game/PhaserGame";

function App() {
  const phaserRef = useRef<PhaserRef | null>(null);

  return (
    <div>
      <PhaserGame ref={phaserRef} />
    </div>
  );
}

export default App;
