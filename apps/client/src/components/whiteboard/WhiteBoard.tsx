import { useEffect, useRef, useState } from "react";
import { isBrowser } from "react-device-detect";
import { useDebounce } from "ahooks";
import { Excalidraw } from "@excalidraw/excalidraw";
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import { OrderedExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import { useAppSelector, useGame } from "@/hooks";
import { eventEmitter } from "@/game/events";
import { cn } from "@/utils";

import "@excalidraw/excalidraw/index.css";

export const WhiteBoard = () => {
  const isRemoteRef = useRef(false);
  const { network } = useGame();
  const whiteboardId = useAppSelector((state) => state.whiteboard.whiteboardId);
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null);
  const [elements, setElements] = useState<readonly OrderedExcalidrawElement[]>([]);
  const debouncedElements = useDebounce(elements, { wait: 500 });

  useEffect(() => {
    // 빈 배열은 마운트 초기값뿐 — 보내면 서버 스냅샷을 지운다 (전체 삭제는 isDeleted 톰스톤이라 비어있지 않음)
    if (!whiteboardId || debouncedElements.length === 0) return;
    if (!isRemoteRef.current) {
      network.updateWhiteboard(whiteboardId, debouncedElements);
    }
  }, [network, whiteboardId, debouncedElements]);

  // 초기 반영은 Network 캐시에서 — 스냅샷이 excalidrawAPI 준비(비동기)나 lazy 청크 로딩보다
  // 먼저 도착해도 유실되지 않는다
  useEffect(() => {
    if (!excalidrawAPI || !whiteboardId) return;
    const snapshot = network.getWhiteboardElements(whiteboardId);
    if (snapshot?.length) {
      isRemoteRef.current = true;
      excalidrawAPI.updateScene({ elements: snapshot as readonly OrderedExcalidrawElement[] });
    }
  }, [network, excalidrawAPI, whiteboardId]);

  useEffect(() => {
    const handler = (payload: { id: string; elements: readonly any[] }) => {
      if (payload.id !== whiteboardId || !excalidrawAPI) return;
      isRemoteRef.current = true;
      excalidrawAPI.updateScene({ elements: payload.elements });
    };

    eventEmitter.on("UPDATED_ELEMENTS", handler);
    return () => eventEmitter.off("UPDATED_ELEMENTS", handler);
  }, [excalidrawAPI, whiteboardId]);

  return (
    <div
      id="white-board"
      className={cn(
        "relative h-full w-full overflow-hidden bg-neutral-50",
        isBrowser && "rounded-2xl",
      )}
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
