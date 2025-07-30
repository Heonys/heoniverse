import { AppIcon } from "@/icons";

export const ControlBar = () => {
  return (
    <div className="fixed bottom-12 left-12 z-50 flex gap-3 select-none">
      <div className="flex justify-between items-center gap-2 w-40 border bg-gray-100 border-gray-500/20 rounded-md p-2 px-4 shadow-md">
        <AppIcon iconName="minus-thin" size={16} />
        <div>100%</div>
        <AppIcon iconName="plus-thin" size={16} />
      </div>
      <div className="flex items-center gap-4 border bg-gray-100 border-gray-500/20 rounded-md p-2 px-4 shadow-md">
        <AppIcon iconName="undo" size={16} />
        <AppIcon iconName="redo" size={16} />
      </div>
    </div>
  );
};
