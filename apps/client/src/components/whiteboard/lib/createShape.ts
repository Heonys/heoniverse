import rough from "roughjs";

import { Shape, Tools } from "@/constants/drawing";

export function createShape(toolType: Tools, shape: Shape) {
  const generator = rough.generator();

  switch (toolType) {
    case Tools.Line: {
      const { x1, y1, x2, y2 } = shape;
      const drawable = generator.line(x1, y1, x2, y2);
      return { ...shape, drawable };
    }
    case Tools.Rect: {
      const { x1, y1, x2, y2 } = shape;
      const drawable = generator.rectangle(x1, y1, x2 - x1, y2 - y1);
      return { ...shape, drawable };
    }
    case Tools.Ellipse: {
      const { x1, y1, x2, y2 } = shape;
      const centerX = (x1 + x2) / 2;
      const centerY = (y1 + y2) / 2;
      const radiusX = Math.abs(x2 - x1);
      const radiusY = Math.abs(y2 - y1);
      const drawable = generator.ellipse(centerX, centerY, radiusX, radiusY);
      return { ...shape, drawable };
    }
    case Tools.Diamond: {
      const { x1, y1, x2, y2 } = shape;
      const centerX = (x1 + x2) / 2;
      const centerY = (y1 + y2) / 2;
      const width = Math.abs(x2 - x1);
      const height = Math.abs(y2 - y1);

      const drawable = generator.polygon([
        [centerX, centerY - height / 2],
        [centerX + width / 2, centerY],
        [centerX, centerY + height / 2],
        [centerX - width / 2, centerY],
      ]);
      return { ...shape, drawable };
    }
    default: {
      throw new Error(`Type not recognised: ${toolType}`);
    }
  }
}
