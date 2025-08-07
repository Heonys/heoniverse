import { useEffect, useState } from "react";
import { format } from "date-fns";
import NumberFlow, { Format } from "@number-flow/react";
import { useAppSelector, useGame, useSceneEffect } from "@/hooks";
import { AppIcon } from "@/icons";
import { twMerge } from "tailwind-merge";

const fpsFormat: Format = {
  notation: "standard",
  maximumFractionDigits: 0,
};

export const GameHUD = () => {
  const { gameScene } = useGame();
  const { name, clients } = useAppSelector((state) => state.room);
  const [frame, setFrame] = useState(0);
  const [currentTime, setCurrentTime] = useState(Date.now());

  useSceneEffect(gameScene, () => {
    setFrame(gameScene.game.loop.actualFps);
  }, []);

  useEffect(() => {
    const tick = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(tick);
  }, []);

  return (
    <div>
      <div
        className={twMerge(
          "fixed top-0.5 right-0.5 py-1 rounded-2xl shadow-md select-none text-xs text-center w-44",
          "border-2 border-white bg-slate-900/90 backdrop-blur-sm text-white",
        )}
        style={{ fontFamily: "Retro" }}
      >
        <div className="absolute top-1 right-2.5">
          <AppIcon iconName="batterty-half" size={18} />
        </div>

        <div className="flex flex-col gap-0.5">
          <div className="text-cyan-400">{format(new Date(), "MMM do yyyy")}</div>
          <div className="text-lg text-cyan-400">{format(currentTime, "h:mm a")}</div>
          <div className="flex gap-1 justify-center">
            <AppIcon iconName="room" size={14} />
            <div>{name}</div>
          </div>
          <div className="flex gap-2 justify-center">
            <div className="flex gap-1 items-center w-7">
              <AppIcon iconName="people" size={14} />
              <NumberFlow value={clients} />
            </div>
            <div className="flex gap-1.5 items-center w-14">
              <NumberFlow value={frame} format={fpsFormat} />
              <div className="">fps</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
