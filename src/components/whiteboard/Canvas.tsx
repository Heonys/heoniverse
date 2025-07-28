import rough from "roughjs";
import { useLayoutEffect, useRef, MouseEvent } from "react";
import { useAppDispatch, useAppSelector, useCanvasScale, useHistory } from "@/hooks";
import { createShape, drawShape, setupCanvasSize } from "@/components/whiteboard/lib";
import { Actions, ShapeMap, Tools } from "@/constants/drawing";
import { changeAction } from "@/stores/drawContextSlice";
import { nanoid } from "@reduxjs/toolkit";

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dispatch = useAppDispatch();
  const { tool, action } = useAppSelector((state) => state.drawContext);
  const { getMouseCoordinates } = useCanvasScale(canvasRef);
  const { shapes, setShapes } = useHistory();

  useLayoutEffect(() => {
    const canvas = canvasRef.current!;
    const container = document.getElementById("white-board")!;
    setupCanvasSize(canvas, container);
  }, []);

  useLayoutEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const roughCanvas = rough.canvas(canvas);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    shapes.forEach((shape) => {
      drawShape(roughCanvas, ctx, shape);
    });
  }, [shapes, action]);

  const updateShape = (toolType: Tools, clientX: number, clientY: number) => {
    switch (toolType) {
      case Tools.Rect: {
        const lastIndex = shapes.length - 1;
        const updatedShape = createShape(toolType, {
          ...(shapes[lastIndex] as ShapeMap[Tools.Rect]),
          x2: clientX,
          y2: clientY,
        });

        const copiedShapes = [...shapes];
        copiedShapes[lastIndex] = updatedShape;
        setShapes(copiedShapes, true);
        break;
      }
    }
  };

  const handleMouseDown = (event: MouseEvent<HTMLCanvasElement>) => {
    const { clientX, clientY } = getMouseCoordinates(event);

    switch (tool) {
      case Tools.Rect: {
        const rectShape = createShape(tool, {
          id: nanoid(8),
          type: tool,
          x1: clientX,
          y1: clientY,
          x2: clientX,
          y2: clientY,
        });
        setShapes((prev) => [...prev, rectShape]);
        dispatch(changeAction(Actions.Drawing));
        break;
      }
    }
  };

  const hanldeMouseMove = (event: MouseEvent<HTMLCanvasElement>) => {
    const { clientX, clientY } = getMouseCoordinates(event);

    if (action === Actions.Drawing) {
      updateShape(tool, clientX, clientY);
    } else {
      //
    }
  };

  const hanldeMouseUp = () => {
    dispatch(changeAction(Actions.None));
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={hanldeMouseMove}
      onMouseUp={hanldeMouseUp}
    />
  );
};
