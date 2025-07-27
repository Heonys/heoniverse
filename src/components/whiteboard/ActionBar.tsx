import { ActionButton } from "@/components/whiteboard";

export const ActionBar = () => {
  return (
    <div className="fixed left-1/2 top-3 -translate-x-1/2 flex gap-3 select-none z-50">
      <div className="flex gap-3 p-2 px-4 rounded-xl shadow-xl border border-black/20 bg-white">
        <ActionButton iconName="hand" className="bg-blue-100" label="" />
        <ActionButton iconName="cursor" label="1" />
        <ActionButton iconName="draw" label="2" />
        <ActionButton iconName="arrow-right-thin" label="3" />
        <ActionButton iconName="line" label="4" />
        <ActionButton iconName="rect" label="5" />
        <ActionButton iconName="diamond" label="6" />
        <ActionButton iconName="ellipse" label="7" />
        <ActionButton iconName="image" label="8" />
        <ActionButton iconName="text" label="9" />
        <ActionButton iconName="eraser" label="0" />
      </div>
    </div>
  );
};
