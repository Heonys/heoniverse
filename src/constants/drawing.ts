import type { Drawable } from "roughjs/bin/core";
import { IconNames } from "@/icons";

export enum Actions {
  None = "None",
  Drawing = "Drawing",
  Moving = "Moving",
  Panning = "Panning",
  Resizing = "Resizing",
  Writing = "Writing",
}

export enum Tools {
  Panning = "Panning",
  Selector = "Selector",
  Draw = "Draw",
  Line = "Line",
  Rect = "Rect",
  Diamond = "Diamond",
  Ellipse = "Ellipse",
  Text = "Text",
}

export type Shape = {
  id: string;
  type: Tools;
  drawable?: Drawable;
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  points?: { x: number; y: number }[];
};

type ToolItems = {
  name: Tools;
  iconName: IconNames;
  label?: string;
};
export const toolItems: ToolItems[] = [
  { name: Tools.Panning, iconName: "hand" },
  { name: Tools.Selector, iconName: "cursor", label: "1" },
  { name: Tools.Draw, iconName: "draw", label: "2" },
  { name: Tools.Line, iconName: "line", label: "3" },
  { name: Tools.Rect, iconName: "rect", label: "4" },
  { name: Tools.Diamond, iconName: "diamond", label: "5" },
  { name: Tools.Ellipse, iconName: "ellipse", label: "6" },
  { name: Tools.Text, iconName: "text", label: "7" },
  // { name: Tools.Arrow, iconName: "arrow-right-thin", label: "3" },
  // { name: Tools.Eraser, iconName: "eraser", label: "9" },
];
