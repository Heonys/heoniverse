import { useState } from "react";
import NumberFlow from "@number-flow/react";
import { AppIcon } from "@/icons";
import { AvatarIcon } from "./AvatarIcon";
import { useAppDispatch, useAppSelector, useGame, useSceneEffect } from "@/hooks";
import { cn } from "@/utils";
import { setMicConnected, setViedeoConnected } from "@/stores/userSlice";

export const GameHUD = () => {
  const { gameScene } = useGame();
  const dispatch = useAppDispatch();
  const { name } = useAppSelector((state) => state.room);
  const { micConnected, videoConnected, status, userName, texture } = useAppSelector(
    (state) => state.user,
  );
  const [frame, setFrame] = useState(0);
  const [users, setUsers] = useState(0);

  useSceneEffect(gameScene, () => {
    setFrame(gameScene.game.loop.actualFps);
    setUsers(gameScene.ohterPlayersMap.size + 1);
  }, []);

  return (
    <div className="fixed bottom-2 left-1/2 flex w-[400px] -translate-x-1/2 select-none items-center gap-2 rounded-full border-2 border-white/50 bg-slate-800 px-3 py-2">
      {/* left */}
      <div className="flex gap-3">
        <AvatarIcon texture={texture} status={status} />
        <div className="flex w-20 flex-col gap-0.5 text-xs text-white">
          <div className="text-sm font-medium">{userName}</div>
          <div
            className="flex cursor-pointer items-center gap-1 text-[#c2c2c2]"
            onClick={() => {
              gameScene.localPlayer.togglePlayerStatus();
            }}
          >
            <div className="capitalize">{status}</div>
            <AppIcon iconName="chevron-right" size={13} />
          </div>
        </div>
      </div>
      {/*  center */}
      <div className="flex flex-col gap-0.5 text-xs text-white" style={{ fontFamily: "Retro" }}>
        <div className="flex items-center justify-center gap-1">
          <AppIcon iconName="room" size={14} />
          <div>{name}</div>
        </div>
        <div className="flex items-center justify-center gap-0.5">
          <div className="flex w-8 items-center gap-1">
            <AppIcon iconName="people" size={14} />
            <NumberFlow value={users} />
          </div>
          <div className="flex items-center gap-0.5">
            <div className="w-5">{frame.toFixed(0)}</div>
            <div className="">fps</div>
          </div>
        </div>
      </div>
      {/* right */}
      <div className="flex flex-1 items-center justify-end gap-2 px-1 text-white">
        <div
          className={cn(
            "cursor-pointer rounded-full p-2 transition-all",
            micConnected ? "bg-slate-600/70 text-white" : "bg-white/90 text-black",
          )}
          onClick={() => dispatch(setMicConnected(!micConnected))}
        >
          <AppIcon iconName={micConnected ? "mic-on" : "mic-off"} size={20} />
        </div>
        <div
          className={cn(
            "cursor-pointer rounded-full p-2 transition-all",
            videoConnected ? "bg-slate-600/70 text-white" : "bg-white/90 text-black",
          )}
          onClick={() => dispatch(setViedeoConnected(!videoConnected))}
        >
          <AppIcon iconName={videoConnected ? "video-on" : "video-off"} size={20} />
        </div>
      </div>
    </div>
  );
};
