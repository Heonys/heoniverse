import { lazy, Suspense } from "react";
import { TrafficLights } from "@/components/computer";

const CodeEditor = lazy(() => import("./CodeEditor"));

export const VSCode = () => {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl bg-[#1e1e1e]">
      <div className="draggable-area relative flex h-7 w-full flex-none cursor-move items-center justify-center">
        <TrafficLights id="vscode" />
        <span className="text-[12px] text-white/50">VSCode</span>
      </div>
      <div className="min-h-0 flex-1">
        <Suspense
          fallback={
            <div className="flex h-full items-center justify-center text-sm text-white/40">
              에디터를 불러오는 중…
            </div>
          }
        >
          <CodeEditor />
        </Suspense>
      </div>
    </div>
  );
};
