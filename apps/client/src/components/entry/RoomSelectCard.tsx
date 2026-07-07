import { useLayoutEffect, useRef } from "react";
import z from "zod";
import { CreateFormSchema } from "@/utils";
import { Panel } from "./primitives";
import { SelectView } from "./views/SelectView";
import { CustomListView } from "./views/CustomListView";
import { CreateRoomView } from "./views/CreateRoomView";
import { PasswordView } from "./views/PasswordView";
import { HelpView } from "./views/HelpView";
import { Card1View, CustomRoom } from "./types";

type Props = {
  view: Card1View;
  onViewChange: (view: Card1View) => void;
  passwordTarget: CustomRoom | null;
  passwordError: string | null;
  onPublic: () => void;
  onOffline: () => void;
  onPickRoom: (room: CustomRoom) => void;
  onPasswordConfirm: (password: string) => void;
  onCreateSubmit: (data: z.infer<typeof CreateFormSchema>) => void;
};

// 카드1: 방 선택. 뷰마다 자연 높이를 갖고, 전환 시 카드 높이를 FLIP으로 부드럽게 잇는다.
export const RoomSelectCard = ({
  view,
  onViewChange,
  passwordTarget,
  passwordError,
  onPublic,
  onOffline,
  onPickRoom,
  onPasswordConfirm,
  onCreateSubmit,
}: Props) => {
  const panelRef = useRef<HTMLDivElement>(null);
  // 직전 뷰의 자연 높이 — 전환 시 여기서 새 높이로 애니메이션한다
  const lastHeight = useRef<number | null>(null);

  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const next = panel.offsetHeight;
    const prev = lastHeight.current;
    lastHeight.current = next;
    if (prev === null || prev === next) return;

    panel.style.transition = "none";
    panel.style.height = `${prev}px`;
    panel.style.overflow = "hidden";
    void panel.offsetHeight;
    panel.style.transition = "height 0.32s cubic-bezier(0.16, 1, 0.3, 1)";
    panel.style.height = `${next}px`;
    const onEnd = (event: TransitionEvent) => {
      if (event.propertyName !== "height") return;
      panel.style.height = "";
      panel.style.transition = "";
      panel.style.overflow = "";
      panel.removeEventListener("transitionend", onEnd);
    };
    panel.addEventListener("transitionend", onEnd);
  }, [view]);

  return (
    <Panel ref={panelRef} className="flex w-[400px] flex-col px-[26px] pb-[22px] pt-[26px]">
      {/* key로 뷰 전환마다 vfade 재생 */}
      <div key={view} className="animate-vfade">
        {view === "select" && (
          <SelectView
            onPublic={onPublic}
            onCustom={() => onViewChange("custom")}
            onOffline={onOffline}
            onHelp={() => onViewChange("help")}
          />
        )}
        {view === "custom" && (
          <CustomListView
            onBack={() => onViewChange("select")}
            onPick={onPickRoom}
            onCreate={() => onViewChange("create")}
          />
        )}
        {view === "create" && (
          <CreateRoomView onBack={() => onViewChange("custom")} onSubmit={onCreateSubmit} />
        )}
        {view === "password" && (
          <PasswordView
            room={passwordTarget}
            serverError={passwordError}
            onBack={() => onViewChange("custom")}
            onConfirm={onPasswordConfirm}
          />
        )}
        {view === "help" && <HelpView onBack={() => onViewChange("select")} />}
      </div>
    </Panel>
  );
};
