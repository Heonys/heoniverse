import { useState } from "react";
import { ToolButton } from "@/components/whiteboard";
import { toolItems, Tools } from "@/constants/drawing";

export const ToolBar = () => {
  const [selected, setSelected] = useState<Tools>(Tools.Panning);

  const onActionButton = (name: Tools) => {
    setSelected(name);
  };

  return (
    <div className="fixed left-1/2 top-3 -translate-x-1/2 flex gap-3 select-none z-50">
      <div className="flex gap-2 p-2 px-4 rounded-xl shadow-xl border border-black/20 bg-white">
        {toolItems.map(({ name, label, iconName }) => {
          return (
            <ToolButton
              key={name}
              name={name}
              selected={selected}
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
