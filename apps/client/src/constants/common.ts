import { Status } from "@heoniverse/shared";

export const statusColorMap: Record<Status, string> = {
  available: "bg-[#01dca2]",
  busy: "bg-[#fbd359]",
  focused: "bg-[#e25156]",
};

export const statusLabelMap: Record<Status, string> = {
  available: "온라인",
  busy: "바쁨",
  focused: "집중",
};
