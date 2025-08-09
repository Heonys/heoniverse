import { useState } from "react";
import { format } from "date-fns";
import NumberFlow from "@number-flow/react";
import { twMerge } from "tailwind-merge";
import { useAppSelector, useGame, useSceneEffect } from "@/hooks";
import { AppIcon } from "@/icons";

export const GameHUD = () => {
  const { gameScene } = useGame();
  const { name } = useAppSelector((state) => state.room);
  const [frame, setFrame] = useState(0);
  const [users, setUsers] = useState(0);

  useSceneEffect(gameScene, () => {
    setFrame(gameScene.game.loop.actualFps);
    setUsers(gameScene.ohterPlayersMap.size + 1);
  }, []);

  return (
    <div className="fixed top-0.5 right-0.5 flex flex-col gap-1">
      <div
        className={twMerge(
          "py-2 rounded-2xl shadow-md select-none text-xs text-center w-44",
          "border-2 border-white bg-slate-900/90 backdrop-blur-sm text-white",
        )}
        style={{ fontFamily: "Retro" }}
      >
        <div className="absolute top-1.5 right-2.5">
          <AppIcon iconName="batterty-half" size={18} />
        </div>

        <div className="flex flex-col gap-0.5">
          <div className="text-cyan-400">{format(new Date(), "MMM do yyyy")}</div>
          <div className="text-lg text-cyan-400">{format(new Date(), "hh:mm a")}</div>
          <div className="flex gap-1 justify-center">
            <AppIcon iconName="room" size={14} />
            <div>{name}</div>
          </div>
          <div className="flex justify-center items-center gap-0.5">
            <div className="flex gap-1 items-center w-8">
              <AppIcon iconName="people" size={14} />
              <NumberFlow value={users} />
            </div>
            <div className="flex items-center gap-0.5">
              <div className="w-5">{frame.toFixed(0)}</div>
              <div className="">fps</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
