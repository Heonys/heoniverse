import { HelperGroups, VirtualJoystick, GameHUD, GameNoti } from "@/components";
import { LoginDialog, SelectMenuDialog } from "@/components/dialog";
import { ComputerDialog } from "@/components/computer";
import { useAppSelector } from "@/hooks";
import { Condition } from "@/common";
import { WhiteboardDialog } from "@/components/whiteboard";
import { ModalComponent } from "@/components/modal";
import { Iphone } from "@/components/iphone";

function App() {
  const roomJoined = useAppSelector((state) => state.room.roomJoined);
  const loggedIn = useAppSelector((state) => state.user.loggedIn);
  const computerDialogOpen = useAppSelector((state) => state.computer.isOpenDialog);
  const whiteboardDialogOpen = useAppSelector((state) => state.whitebaord.isOpenDialog);

  return (
    <div className="absolute h-full w-full">
      <ModalComponent />
      <VirtualJoystick />

      <Condition condition={!computerDialogOpen && !whiteboardDialogOpen}>
        <HelperGroups />
      </Condition>

      <Condition condition={roomJoined} fallback={<SelectMenuDialog />}>
        <Condition condition={loggedIn} fallback={<LoginDialog />}>
          <Iphone />
          <GameHUD />
          <GameNoti />
        </Condition>
      </Condition>

      <Condition condition={computerDialogOpen}>
        <ComputerDialog />
      </Condition>

      <Condition condition={whiteboardDialogOpen}>
        <WhiteboardDialog />
      </Condition>
    </div>
  );
}

export default App;
