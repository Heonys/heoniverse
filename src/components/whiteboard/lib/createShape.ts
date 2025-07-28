import rough from "roughjs";
import { Tools, ShapeMap } from "@/constants/drawing";

export function createShape<T extends keyof ShapeMap>(toolType: T, shape: ShapeMap[T]) {
  const generator = rough.generator();

  switch (toolType) {
    case Tools.Line: {
      const line = shape as ShapeMap[Tools.Line];
      const { x1, x2, y1, y2 } = line;
      const drawable = generator.line(x1, x2, y1, y2);
      return { ...line, drawable } as ShapeMap[T];
    }
    case Tools.Rect: {
      const rect = shape as ShapeMap[Tools.Rect];
      const { x1, y1, x2, y2 } = rect;
      const drawable = generator.rectangle(x1, y1, x2 - x1, y2 - y1);
      return { ...rect, drawable } as ShapeMap[T];
    }
    case Tools.Ellipse: {
      const ellipse = shape as ShapeMap[Tools.Ellipse];
      const { c1, c2, width, height } = ellipse;
      const drawable = generator.ellipse(c1, c2, width, height);
      return { ...ellipse, drawable } as ShapeMap[T];
    }
    case Tools.Diamond: {
      const diamond = shape as ShapeMap[Tools.Diamond];
      const { c1, c2, width, height } = diamond;
      const drawable = generator.polygon([
        [c1, c2 - height / 2],
        [c1 + width / 2, c2],
        [c1, c2 + height / 2],
        [c1 - width / 2, c2],
      ]);
      return { ...diamond, drawable } as ShapeMap[T];
    }
    default: {
      throw new Error(`Type not recognised: ${toolType}`);
    }
  }
}
