import { AppIcon } from "@/icons";

export const ControlBar = () => {
  return (
    <div className="fixed bottom-12 left-12 z-50 flex select-none gap-3">
      <div className="flex w-40 items-center justify-between gap-2 rounded-md border border-gray-500/20 bg-gray-100 p-2 px-4 shadow-md">
        <AppIcon iconName="minus-thin" size={16} />
        <div>100%</div>
        <AppIcon iconName="plus-thin" size={16} />
      </div>
      <div className="flex items-center gap-4 rounded-md border border-gray-500/20 bg-gray-100 p-2 px-4 shadow-md">
        <AppIcon iconName="undo" size={16} />
        <AppIcon iconName="redo" size={16} />
      </div>
    </div>
  );
};
