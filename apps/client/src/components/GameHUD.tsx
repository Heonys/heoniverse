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
    <div className="fixed top-0.5 right-1 flex flex-col items-end gap-2 select-none">
      <div
        className={twMerge(
          "py-2 rounded-2xl shadow-md text-xs text-center w-44",
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
      <div className="text-sm font-semibold w-44">
        <button
          className={twMerge(
            "bg-gradient-to-r from-purple-600 to-blue-500 text-white border-2 border-white/40",
            "w-full cursor-pointer rounded-lg p-1 py-2 justify-center items-center shadow-lg flex gap-1.5 outline-none",
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
            className="relative w-[340px] bg-black/60 backdrop-blur-lg rounded-sm text-white p-4 text-sm flex flex-col gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              className="absolute top-1 right-1 cursor-pointer"
              onClick={() => setShowMessage(false)}
            >
              <AppIcon iconName="x-mark" color="white" size={18} />
            </button>
            <div className="flex gap-2 text-blue-300 items-center">
              <AppIcon iconName="help" size={18} />
              <div className="leading-none tracking-tight font-semibold">Access Camera</div>
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
