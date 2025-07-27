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
  Cursor = "Cursor",
  Draw = "Draw",
  Arrow = "Arrow",
  Line = "Line",
  Rect = "Rect",
  Diamond = "Diamond",
  Ellipse = "Ellipse",
  Text = "Text",
  Eraser = "Eraser",
}

type ToolItems = {
  name: Tools;
  iconName: IconNames;
  label?: string;
};

export const toolItems: ToolItems[] = [
  { name: Tools.Panning, iconName: "hand" },
  { name: Tools.Cursor, iconName: "cursor", label: "1" },
  { name: Tools.Draw, iconName: "draw", label: "2" },
  { name: Tools.Arrow, iconName: "arrow-right-thin", label: "3" },
  { name: Tools.Line, iconName: "line", label: "4" },
  { name: Tools.Rect, iconName: "rect", label: "5" },
  { name: Tools.Diamond, iconName: "diamond", label: "6" },
  { name: Tools.Ellipse, iconName: "ellipse", label: "7" },
  { name: Tools.Text, iconName: "text", label: "8" },
  { name: Tools.Eraser, iconName: "eraser", label: "9" },
];
