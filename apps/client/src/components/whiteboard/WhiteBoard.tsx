import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
// import { ToolBar, ControlBar, Canvas } from "@/components/whiteboard";

export const WhiteBoard = () => {
  return (
    <div
      id="white-board"
      className="relative h-full w-full overflow-hidden rounded-2xl bg-neutral-50"
    >
      {/* <ToolBar />
      <ControlBar />
      <Canvas /> */}
      <Excalidraw langCode="ko-KR" />
    </div>
  );
};
