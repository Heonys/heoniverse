import { Shapes, Tools } from "@/constants/drawing";
import { RoughCanvas } from "roughjs/bin/canvas";

export function drawShape(canvas: RoughCanvas, ctx: CanvasRenderingContext2D, shape: Shapes) {
  const { type, drawable } = shape;
  switch (type) {
    case Tools.Rect: {
      if (drawable) canvas.draw(drawable);
      break;
    }
  }
}
