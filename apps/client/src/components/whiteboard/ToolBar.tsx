import { ToolButton } from "./ToolButton";
import { toolItems, Tools } from "@/constants/drawing";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { changeTool } from "@/stores/drawContextSlice";

export const ToolBar = () => {
  const dispatch = useAppDispatch();
  const currentTool = useAppSelector((state) => state.drawContext.tool);

  const onActionButton = (name: Tools) => {
    dispatch(changeTool(name));
  };

  return (
    <div className="fixed left-1/2 top-3 z-50 flex -translate-x-1/2 select-none gap-3">
      <div className="flex gap-2 rounded-xl border border-black/20 bg-white p-2 px-4 shadow-xl">
        {toolItems.map(({ name, label, iconName }) => {
          return (
            <ToolButton
              key={name}
              name={name}
              selected={currentTool}
              onClick={onActionButton}
              iconName={iconName}
              label={label}
            />
          );
        })}
      </div>
    </div>
  );
};
