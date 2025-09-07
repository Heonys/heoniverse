import { useEffect, useRef, useState } from "react";
import { useDebounce } from "ahooks";
import { Excalidraw } from "@excalidraw/excalidraw";
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import { OrderedExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import { useGame } from "@/hooks";
import { eventEmitter } from "@/game/events";

import "@excalidraw/excalidraw/index.css";

export const WhiteBoard = () => {
  const isRemoteRef = useRef(false);
  const { network } = useGame();
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null);
  const [elements, setElements] = useState<readonly OrderedExcalidrawElement[]>([]);
  const debouncedElements = useDebounce(elements, { wait: 500 });

  useEffect(() => {
    if (!isRemoteRef.current) {
      network.updateWhiteboard(debouncedElements);
    }
  }, [network, debouncedElements]);

  useEffect(() => {
    const handler = (elements: readonly OrderedExcalidrawElement[]) => {
      isRemoteRef.current = true;
      excalidrawAPI?.updateScene({ elements });
    };

    eventEmitter.on("UPDATED_ELEMENTS", handler);
    return () => eventEmitter.off("UPDATED_ELEMENTS", handler);
  }, [excalidrawAPI]);

  return (
    <div
      id="white-board"
      className="relative h-full w-full overflow-hidden rounded-2xl bg-neutral-50"
    >
      <Excalidraw
        excalidrawAPI={setExcalidrawAPI}
        langCode="ko-KR"
        onChange={(elements) => {
          if (isRemoteRef.current) {
            isRemoteRef.current = false;
          } else {
            setElements(elements);
          }
        }}
      />
    </div>
  );
};
