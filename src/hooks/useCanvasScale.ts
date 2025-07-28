import { useState, MouseEvent, RefObject } from "react";

export const useCanvasScale = (canvasRef: RefObject<HTMLCanvasElement | null>) => {
  const [scale, setScale] = useState(1);
  const [scaleOffset, setScaleOffset] = useState({ x: 0, y: 0 });

  const getMouseCoordinates = (event: MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();

    const clientX = (event.clientX + scaleOffset.x - rect.left) / scale;
    const clientY = (event.clientY + scaleOffset.y - rect.top) / scale;
    return { clientX, clientY };
  };

  return { scale, scaleOffset, getMouseCoordinates };
};
