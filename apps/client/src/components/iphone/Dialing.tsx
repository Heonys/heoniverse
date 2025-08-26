import { format, differenceInSeconds } from "date-fns";
import { useAppDispatch, useAppSelector, useCurrentTime, useGame } from "@/hooks";
import { AppIcon } from "@/icons";
import { setCurrentPage, setIsConnected } from "@/stores/phoneSlice";
import { cn, formatElapsedTime } from "@/utils";
import { eventEmitter } from "@/game/events";

type Props = { remoteId: string };

export const Dialing = ({ remoteId }: Props) => {
  const time = useCurrentTime(1000);
  const { network, getOtherPlayerById } = useGame();
  const dispatch = useAppDispatch();
  const isConnected = useAppSelector((state) => state.phone.isConnected);
  const { mediaConnected, micEnabled, videoEnabled } = useAppSelector((state) => state.user);
  const player = getOtherPlayerById(remoteId)!;

  return (
    <div
      className="rounded-4xl size-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/background/iphone-wallpaper.jpg')" }}
    >
      <div className="rounded-4xl flex size-full flex-col bg-black/40 backdrop-blur-xl">
        {/* header */}
        <div className="rounded-t-4xl relative flex flex-col text-lg font-bold text-white">
          <div className="absolute left-1/2 top-2 h-[22px] w-20 -translate-x-1/2 rounded-full bg-[#040404]" />
          <div className="relative flex h-9 w-full items-center px-5 py-2 text-[13px]">
            <div className="ml-2">{format(time, "h:mm")}</div>
            <div className="flex flex-1 items-center justify-end gap-1.5">
              <AppIcon iconName="signal" size={14} />
              <AppIcon iconName="wifi" size={14} />
              <AppIcon iconName="batterty-half" size={16} />
            </div>
          </div>
          <div className="h-13"></div>
        </div>

        {/* center */}
        <div className="flex flex-1 flex-col items-center pb-20 text-white">
          <div className="flex flex-col items-center gap-0.5">
            <div className="text-sm tracking-wide text-white/50">
              {isConnected.state
                ? formatElapsedTime(differenceInSeconds(time, isConnected.startedAt))
                : "연결중..."}
            </div>
            <div className="text-2xl">{player.playerName.text}</div>
          </div>
          <div className="flex flex-1 flex-col items-center justify-end gap-5">
            <div className="flex gap-5">
              <div
                className="flex cursor-pointer flex-col items-center gap-1 text-[10px]"
                onClick={() => {
                  if (mediaConnected) eventEmitter.emit("VIDEO_ENABLED_CHANGE", videoEnabled);
                }}
              >
                <div
                  className={cn(
                    "size-13 flex cursor-pointer items-center justify-center rounded-full p-2",
                    videoEnabled ? "bg-gray-200/30 text-white/90" : "bg-white/70 text-black",
                  )}
                >
                  <AppIcon iconName={videoEnabled ? "video-on" : "video-off"} size={22} />
                </div>
                <div>카메라</div>
              </div>
              <div
                className="flex cursor-pointer flex-col items-center gap-1 text-[10px]"
                onClick={() => {
                  if (mediaConnected) eventEmitter.emit("MIC_ENABLED_CHANGE", micEnabled);
                }}
              >
                <div
                  className={cn(
                    "size-13 flex cursor-pointer items-center justify-center rounded-full p-2",
                    micEnabled ? "bg-gray-200/30 text-white/90" : "bg-white/70 text-black",
                  )}
                >
                  <AppIcon iconName={micEnabled ? "mic-on" : "mic-off"} size={22} />
                </div>
                <div>마이크</div>
              </div>
            </div>

            <div
              className="flex cursor-pointer flex-col items-center gap-1 text-[10px]"
              onClick={() => {
                network.updateIsCalling(false);
                dispatch(setCurrentPage({ page: "home" }));
                dispatch(setIsConnected({ state: false }));
              }}
            >
              <div className="size-13 flex cursor-pointer items-center justify-center rounded-full bg-[#fa4837] p-2">
                <AppIcon iconName="hang-up" size={20} />
              </div>
              <div>종료</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
