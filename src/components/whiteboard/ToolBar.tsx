import { ToolButton } from "@/components/whiteboard";
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
    <div className="fixed left-1/2 top-3 -translate-x-1/2 flex gap-3 select-none z-50">
      <div className="flex gap-2 p-2 px-4 rounded-xl shadow-xl border border-black/20 bg-white">
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
