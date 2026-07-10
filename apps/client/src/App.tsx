import { lazy, Suspense } from "react";
import { isBrowser } from "react-device-detect";
import {
  HelperGroups,
  VirtualJoystick,
  GameHUD,
  MinimapFrame,
  ReconnectingScreen,
  NpcChatBar,
  NudgeToast,
  FollowIndicator,
  ScreenshotFlash,
} from "@/components";
import { EntryScreen } from "@/components/entry";
import { ComputerDialog } from "@/components/computer";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { Condition } from "@/common";
import { ModalComponent } from "@/components/modal";
import { IphoneApp } from "@/components/iphone";
import { NonDesktop } from "@/NonDesktop";
import { closeComputerDialog } from "./stores/computerSlice";

const WhiteboardDialog = lazy(() =>
  import("@/components/whiteboard/WhiteboardDialog").then((module) => ({
    default: module.WhiteboardDialog,
  })),
);

function App() {
  const dispatch = useAppDispatch();
  const reconnecting = useAppSelector((state) => state.room.reconnecting);
  const loggedIn = useAppSelector((state) => state.user.loggedIn);
  const computerDialogOpen = useAppSelector((state) => state.computer.isOpenDialog);
  const whiteboardDialogOpen = useAppSelector((state) => state.whiteboard.isOpenDialog);
  const npcTalking = useAppSelector((state) => state.ai.talking);

  return (
    <div className="absolute h-full w-full">
      <ModalComponent />
      <VirtualJoystick />

      <Condition condition={!isBrowser}>
        <NonDesktop />
      </Condition>

      <Condition condition={!computerDialogOpen && !whiteboardDialogOpen}>
        <HelperGroups />
      </Condition>

      {/* pre-join: 방·캐릭터·닉네임을 EntryScreen에서 모두 정하고, join 완료(loggedIn) 시 인게임 */}
      <Condition
        condition={reconnecting}
        fallback={
          <Condition condition={loggedIn} fallback={<EntryScreen />}>
            <IphoneApp />
            <GameHUD />
            <MinimapFrame />
            <NudgeToast />
            <FollowIndicator />
            <ScreenshotFlash />
            <Condition condition={npcTalking}>
              <NpcChatBar />
            </Condition>
          </Condition>
        }
      >
        <ReconnectingScreen />
      </Condition>

      <Condition condition={computerDialogOpen}>
        <Condition
          condition={isBrowser}
          fallback={<NonDesktop useComputer onClose={() => dispatch(closeComputerDialog())} />}
        >
          <ComputerDialog />
        </Condition>
      </Condition>

      <Condition condition={whiteboardDialogOpen}>
        <Suspense fallback={null}>
          <WhiteboardDialog />
        </Suspense>
      </Condition>
    </div>
  );
}

export default App;
