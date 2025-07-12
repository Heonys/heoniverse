import { useState } from "react";
import { Button } from "@headlessui/react";

export const TooltipButton = ({ text, children }: { text: string; children: React.ReactNode }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative">
      <Button
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="size-11 cursor-pointer flex justify-center items-center bg-white rounded-full shadow-xl"
      >
        {children}
      </Button>

      {showTooltip && (
        <div
          className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2
                     bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap
                     shadow-lg z-10 select-none"
          role="tooltip"
        >
          {text}
        </div>
      )}
    </div>
  );
};
