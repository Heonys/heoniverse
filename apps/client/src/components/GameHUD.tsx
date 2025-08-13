import { useState } from "react";
import { format } from "date-fns";
import NumberFlow from "@number-flow/react";
import { twMerge } from "tailwind-merge";
import { motion, AnimatePresence } from "motion/react";
import { useAppSelector, useGame, useSceneEffect } from "@/hooks";
import { AppIcon } from "@/icons";
import LensIcon from "/icons/lens.png";

export const GameHUD = () => {
  const { gameScene } = useGame();
  const { name } = useAppSelector((state) => state.room);
  const { videoConnected } = useAppSelector((state) => state.user);
  const [frame, setFrame] = useState(0);
  const [users, setUsers] = useState(0);
  const [showMessage, setShowMessage] = useState(true);

  useSceneEffect(gameScene, () => {
    setFrame(gameScene.game.loop.actualFps);
    setUsers(gameScene.ohterPlayersMap.size + 1);
  }, []);

  const connectCamera = () => {};

  return (
    <div className="fixed right-1 top-0.5 flex select-none flex-col items-end gap-2">
      <div
        className={twMerge(
          "w-44 rounded-2xl py-2 text-center text-xs shadow-md",
          "border-2 border-white bg-slate-900/90 text-white backdrop-blur-sm",
        )}
        style={{ fontFamily: "Retro" }}
      >
        <div className="absolute right-2.5 top-1.5">
          <AppIcon iconName="batterty-half" size={18} />
        </div>

        <div className="flex flex-col gap-0.5">
          <div className="text-cyan-400">{format(new Date(), "MMM do yyyy")}</div>
          <div className="text-lg text-cyan-400">{format(new Date(), "hh:mm a")}</div>
          <div className="flex justify-center gap-1">
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
      </div>
      <div className="w-44 text-sm font-semibold">
        <button
          className={twMerge(
            "border-1 border-white/40 bg-gradient-to-r from-purple-600 to-blue-500 text-white",
            "flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg p-1 py-2 text-[13px] shadow-lg outline-none",
          )}
          onClick={connectCamera}
        >
          <img className="w-5" src={LensIcon} alt="lens" />
          {videoConnected ? "카메라 연결 해제하기" : "카메라 연결하기"}
        </button>
      </div>
      <AnimatePresence>
        {showMessage && (
          <motion.div
            className="text-smite relative flex w-[340px] flex-col gap-1 rounded-sm bg-black/60 p-4 text-sm backdrop-blur-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              className="absolute right-1 top-1 cursor-pointer"
              onClick={() => setShowMessage(false)}
            >
              <AppIcon iconName="x-mark" color="white" size={18} />
            </button>
            <div className="flex items-center gap-2 text-blue-300">
              <AppIcon iconName="help" size={18} />
              <div className="font-semibold leading-none tracking-tight">Access Camera</div>
            </div>
            <div className="text-[#c2c2c2]">
              카메라를 연결하면 다른 플레이어가 근처에 있을 때 카메라가 활성화되어 소통할 수
              있습니다.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
