import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { isBrowser } from "react-device-detect";
import { ServerError } from "colyseus.js";
import z from "zod";
import { useAppDispatch, useAppSelector, useGame, useModal } from "@/hooks";
import { grantAdmin } from "@/stores/userSlice";
import { cn, CreateFormSchema, FormSchema } from "@/utils";
import { createLoginMetrics } from "@/service/appwrite";
import { IconNames } from "@/icons";
import { MenuBackdrop } from "./MenuBackdrop";
import { RoomSelectCard } from "./RoomSelectCard";
import { CharacterSetupCard } from "./CharacterSetupCard";
import { EntryToast } from "./EntryToast";
import { Card1View, CustomRoom, RoomSelection } from "./types";

const WELCOME_KEY = "heoniverse:welcomed";

// 입장 플로우: STEP 1 방 선택 → STEP 2 캐릭터·닉네임 → 입장.
// 화면은 순차 스텝이지만 join은 마지막 "입장하기"에서만 일어난다
// (pre-join — 2단계에서 "뒤로"로 방을 다시 고를 수 있다)
export const EntryScreen = () => {
  const dispatch = useAppDispatch();
  const availableRooms = useAppSelector((state) => state.room.availableRooms);
  const { preloaderScene } = useGame();
  const { showModal } = useModal();

  const [step, setStep] = useState<1 | 2>(1);
  const [view, setView] = useState<Card1View>("select");
  const [selection, setSelection] = useState<RoomSelection>({ kind: "public" });
  // 비밀번호 뷰가 띄울 대상 방 (선택 확정 후에도 401 복귀를 위해 유지)
  const [passwordTarget, setPasswordTarget] = useState<CustomRoom | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [avatar, setAvatar] = useState("suit");
  const [nickname, setNickname] = useState("");
  const [nickError, setNickError] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);
  const [toast, setToast] = useState<ReactNode | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  const showToast = (node: ReactNode) => {
    setToast(node);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2600);
  };
  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  // 선택해 둔 커스텀 방이 로비 목록에서 사라지면(방 폭파) 방 선택 단계로 되돌린다
  useEffect(() => {
    if (selection.kind !== "custom") return;
    if (availableRooms.some((room) => room.roomId === selection.roomId)) return;
    setSelection({ kind: "public" });
    setStep(1);
    setView("custom");
    showToast("선택한 방이 사라졌어요 — 다른 방을 선택해주세요");
  }, [availableRooms, selection]);

  const roomContext = useMemo((): { name: string; description: string; icon: IconNames } => {
    switch (selection.kind) {
      case "public":
        return {
          name: "Public Room",
          description: "누구나 들어와 어울릴 수 있는 기본 광장",
          icon: "public",
        };
      case "offline":
        return {
          name: "Offline Mode",
          description: "서버 없이 UI와 인터랙션을 둘러보는 모드",
          icon: "joystick",
        };
      case "custom":
      case "create":
        return { name: selection.name, description: selection.description, icon: "wand" };
    }
  }, [selection]);

  // 방이 정해지면 STEP 2(캐릭터·닉네임)로 넘어간다 — join은 아직 하지 않는다
  const selectRoom = (next: RoomSelection) => {
    setSelection(next);
    setStep(2);
  };

  const handlePickRoom = (room: CustomRoom) => {
    if (room.metadata?.hasPassword) {
      setPasswordTarget(room);
      setPasswordError(null);
      setView("password");
      return;
    }
    selectRoom({
      kind: "custom",
      roomId: room.roomId,
      name: room.metadata?.name ?? "비공개 방",
      description: room.metadata?.description ?? "",
    });
  };

  const handlePasswordConfirm = (password: string) => {
    if (!passwordTarget) return;
    setPasswordError(null);
    selectRoom({
      kind: "custom",
      roomId: passwordTarget.roomId,
      name: passwordTarget.metadata?.name ?? "비공개 방",
      description: passwordTarget.metadata?.description ?? "",
      password,
    });
  };

  const handleCreateSubmit = (data: z.infer<typeof CreateFormSchema>) => {
    selectRoom({ kind: "create", ...data });
  };

  const handleEnter = async () => {
    // 닉네임 검증 (2~6자 · admin ID 예외)
    const parsed = FormSchema.shape.name.safeParse(nickname.trim());
    if (!parsed.success) {
      setNickError(parsed.error.issues[0].message);
      return;
    }
    setNickError(null);
    let name = parsed.data;
    const isAdmin = name === import.meta.env.VITE_ADMIN_ID;
    if (isAdmin) {
      dispatch(grantAdmin());
      name = "admin";
    }

    const network = preloaderScene.network;
    setJoining(true);
    try {
      switch (selection.kind) {
        case "public":
          await network.joinPublicRoom();
          break;
        case "offline":
          await network.joinSingleRoom();
          break;
        case "custom":
          await network.joinCustomRoom(selection.roomId, selection.password);
          break;
        case "create":
          await network.createCustomRoom({
            name: selection.name,
            description: selection.description,
            password: selection.password,
            autoDispose: true,
          });
          break;
      }
    } catch (error) {
      setJoining(false);
      if (error instanceof ServerError && error.code === 401) {
        // 비밀번호 오류 — STEP 1의 비밀번호 뷰로 되돌려 다시 입력받는다
        setPasswordError(error.message);
        setStep(1);
        setView("password");
        return;
      }
      if (selection.kind === "custom") {
        setSelection({ kind: "public" });
        setStep(1);
        setView("custom");
        showToast("방에 입장할 수 없어요 — 방이 사라졌거나 인원이 가득 찼어요");
        return;
      }
      showToast("입장에 실패했어요 — 잠시 후 다시 시도해주세요");
      console.error("입장 실패:", error);
      return;
    }

    // join 성공 → 프로필을 들고 곧장 인게임으로 (Game.applyProfile이 loggedIn까지 처리)
    preloaderScene.launchGame({ avatar, nickname: name });

    if (!isAdmin && import.meta.env.PROD) {
      createLoginMetrics({
        client_id: network.sessionId,
        avatar,
        nickname: name,
        room_name: roomContext.name,
        desktop: isBrowser,
      });
    }

    // 첫 방문 1회 환영 모달 (표시 시점에 바로 기록해 재접속·재입장 중복을 막는다)
    if (isBrowser && !localStorage.getItem(WELCOME_KEY)) {
      localStorage.setItem(WELCOME_KEY, "1");
      showModal("Welcome", { nickname: name });
    }
  };

  return (
    <div className="text-app-text fixed inset-0 z-[1111] select-none">
      <MenuBackdrop />

      <div
        className={cn(
          "relative z-10 flex h-full items-center justify-center overflow-y-auto",
          isBrowser ? "p-9" : "p-4",
        )}
      >
        {step === 1 ? (
          <RoomSelectCard
            view={view}
            onViewChange={(next) => {
              if (next === "password") setPasswordError(null);
              setView(next);
            }}
            passwordTarget={passwordTarget}
            passwordError={passwordError}
            onPublic={() => selectRoom({ kind: "public" })}
            onOffline={() => selectRoom({ kind: "offline" })}
            onPickRoom={handlePickRoom}
            onPasswordConfirm={handlePasswordConfirm}
            onCreateSubmit={handleCreateSubmit}
          />
        ) : (
          <CharacterSetupCard
            roomName={roomContext.name}
            roomDescription={roomContext.description}
            roomIcon={roomContext.icon}
            onBack={() => setStep(1)}
            avatar={avatar}
            onAvatarChange={setAvatar}
            nickname={nickname}
            onNicknameChange={(value) => {
              setNickname(value);
              setNickError(null);
            }}
            nickError={nickError}
            joining={joining}
            onEnter={handleEnter}
          />
        )}
      </div>

      <EntryToast toast={toast} />
    </div>
  );
};
