import { TrafficLights } from "@/components/computer";

export const VSCode = () => {
  return (
    <div className="h-full w-full overflow-hidden rounded-2xl bg-[#1e1e1e]">
      <div className="draggable-area relative top-0 h-7 w-full cursor-move text-center">
        <TrafficLights id="vscode" />
      </div>
      <iframe
        className="size-full"
        src="https://stackblitz.com/github/Heonys/heoniverse?embed=1&file=README.md&hideNavigation=1&theme=dark&view=editor"
        title="VS Code for macOS Web"
      ></iframe>
    </div>
  );
};
