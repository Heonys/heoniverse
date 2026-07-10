import { useState } from "react";
import { AppIcon } from "@/icons";
import { setCurrentPage } from "@/stores/phoneSlice";
import { StatusBar, BackChevron } from "./StatusBar";
import { useAppDispatch, useAppSelector, useGame } from "@/hooks";
import { AvatarIcon } from "@/components";
import { Condition } from "@/common";
import { cn } from "@/utils";

type Tabs = "contacts" | "recent";

export const Contacts = () => {
  const [tab, setTab] = useState<Tabs>("contacts");
  const dispatch = useAppDispatch();
  const { getOtherPlayerById, network } = useGame();
  const { otherPlayersName } = useAppSelector((state) => state.user);

  const users = Object.entries(otherPlayersName).map(([id, name]) => ({ id, name }));

  return (
    <div className="rounded-4xl flex size-full flex-col bg-white">
      {/* header */}
      <div className="rounded-t-4xl relative flex flex-col font-bold text-black">
        <StatusBar />
        <div className="h-13 relative flex flex-col items-center justify-center gap-1 text-black/70">
          <div className="text-sm font-medium text-black">
            {tab === "contacts" ? "연락처" : "최근 통화"}
          </div>
          <BackChevron onClick={() => dispatch(setCurrentPage({ page: "home" }))} />
        </div>
      </div>
      {/* center */}
      <div className="relative flex flex-1 flex-col border-y border-black/15 p-1">
        <Condition
          condition={users.length !== 0}
          fallback={
            <div className="flex size-full items-center justify-center text-black/50">
              연락 가능한 인원 없음
            </div>
          }
        >
          {users.map(({ id }) => {
            const player = getOtherPlayerById(id);
            return (
              player && (
                <button
                  key={id}
                  className="flex cursor-pointer items-center gap-2 border-b border-black/15 p-2 hover:bg-[#f5f5f5] disabled:cursor-not-allowed"
                  disabled={player.isCalling}
                  onClick={() => {
                    network.webRTC?.getUserMedia().then((allowed) => {
                      if (!allowed) return;
                      // 통화가 실제로 걸렸을 때만 통화 상태로 전환 (실패 시 발신자 고착 방지)
                      const placed = network.webRTC?.peerCall(id, "direct");
                      if (!placed) return;
                      network.updateIsCalling(true);
                      dispatch(
                        setCurrentPage({
                          page: "dialing",
                          props: { remoteId: player.playerId },
                        }),
                      );
                    });
                  }}
                >
                  <AvatarIcon texture={player.playerTexture} className="size-8" />
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-center gap-1 text-xs">
                      <div className="font-medium">{player.playerName.text}</div>
                      <div className="text-[10px] text-black/80">{`#${player.playerId}`}</div>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-black/60">
                      <AppIcon iconName="pick-up" />
                      <div>{player.isCalling ? "통화중" : "통화가능"}</div>
                    </div>
                  </div>
                  <AppIcon iconName="info" color="#0579fb" />
                </button>
              )
            );
          })}
        </Condition>
      </div>

      {/* bottom */}
      <div className="flex items-center justify-around gap-4 px-5 py-2 pb-4 text-[10px]">
        <div
          className={cn(
            "flex cursor-pointer flex-col items-center gap-0.5",
            tab === "contacts" ? "text-[#0579fb]" : "opacity-60",
          )}
          onClick={() => setTab("contacts")}
        >
          <AppIcon iconName="user-cirlce" size={20} />
          <div>연락처</div>
        </div>
        <div
          className={cn(
            "flex cursor-pointer flex-col items-center gap-0.5",
            tab === "recent" ? "text-[#0579fb]" : "opacity-60",
          )}
          onClick={() => setTab("recent")}
        >
          <AppIcon iconName="clock" size={20} />
          <div>최근 통화</div>
        </div>
      </div>
    </div>
  );
};
