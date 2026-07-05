import { lazy, Suspense } from "react";
import { isBrowser } from "react-device-detect";
import {
  HelperGroups,
  VirtualJoystick,
  GameHUD,
  GameNoti,
  ReconnectingScreen,
  NpcChatBar,
} from "@/components";
import { LoginDialog, SelectMenuDialog } from "@/components/dialog";
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
  const roomJoined = useAppSelector((state) => state.room.roomJoined);
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

      <Condition
        condition={reconnecting}
        fallback={
          <Condition condition={roomJoined} fallback={<SelectMenuDialog />}>
            <Condition condition={loggedIn} fallback={<LoginDialog />}>
              <IphoneApp />
              <GameHUD />
              <GameNoti />
              <Condition condition={npcTalking}>
                <NpcChatBar />
              </Condition>
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
