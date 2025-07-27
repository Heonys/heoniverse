import { ActionBar, ControlBar } from "@/components/whiteboard";

export const WhiteBoard = () => {
  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-neutral-50">
      <ActionBar />
      <ControlBar />
    </div>
  );
};
