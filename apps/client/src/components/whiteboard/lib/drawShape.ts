import { Tools, Shape } from "@/constants/drawing";
import { RoughCanvas } from "roughjs/bin/canvas";

export function drawShape(canvas: RoughCanvas, _ctx: CanvasRenderingContext2D, shape: Shape) {
  const { type, drawable } = shape;
  switch (type) {
    case Tools.Rect:
    case Tools.Line:
    case Tools.Ellipse:
    case Tools.Diamond: {
      if (drawable) canvas.draw(drawable);
      break;
    }
  }
}
