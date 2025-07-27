import { Actions } from "@/constants/drawing";
import { useLayoutEffect, useRef, useState } from "react";

const scale = 1;

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [actoin, setActoin] = useState<Actions>(Actions.None);
  const [scaleOffset, setScaleOffset] = useState({ x: 0, y: 0 });

  useLayoutEffect(() => {
    setupCanvasSize();
  }, []);

  const getMouseCoordinates = (event: MouseEvent) => {
    const clientX = (event.clientX + scaleOffset.x) / scale;
    const clientY = (event.clientY + scaleOffset.y) / scale;
    return { clientX, clientY };
  };

  const setupCanvasSize = () => {
    const canvas = canvasRef.current!;
    const container = document.getElementById("white-board")!;
    const { width, height } = container.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
  };

  return <canvas ref={canvasRef} />;
};
