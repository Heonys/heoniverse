import { isBrowser } from "react-device-detect";
import { HelperGroups, VirtualJoystick, GameHUD, GameNoti } from "@/components";
import { LoginDialog, SelectMenuDialog } from "@/components/dialog";
import { ComputerDialog } from "@/components/computer";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { Condition } from "@/common";
import { WhiteboardDialog } from "@/components/whiteboard";
import { ModalComponent } from "@/components/modal";
import { IphoneApp } from "@/components/iphone";
import { NonDesktop } from "@/NonDesktop";
import { closeComputerDialog } from "./stores/computerSlice";

function App() {
  const dispatch = useAppDispatch();
  const roomJoined = useAppSelector((state) => state.room.roomJoined);
  const loggedIn = useAppSelector((state) => state.user.loggedIn);
  const computerDialogOpen = useAppSelector((state) => state.computer.isOpenDialog);
  const whiteboardDialogOpen = useAppSelector((state) => state.whitebaord.isOpenDialog);

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

      <Condition condition={roomJoined} fallback={<SelectMenuDialog />}>
        <Condition condition={loggedIn} fallback={<LoginDialog />}>
          <IphoneApp />
          <GameHUD />
          <GameNoti />
        </Condition>
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
        <WhiteboardDialog />
      </Condition>
    </div>
  );
}

export default App;
