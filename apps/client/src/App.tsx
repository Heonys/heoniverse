import { Chat, HelperGroups, VirtualJoystick, GameHUD } from "@/components";
import { LoginDialog, SelectMenuDialog } from "@/components/dialog";
import { ComputerDialog } from "@/components/computer";
import { useAppSelector } from "@/hooks";
import { Condition } from "@/common";
import { WhiteboardDialog } from "@/components/whiteboard";
import { ModalComponent } from "@/components/modal";

function App() {
  const roomJoined = useAppSelector((state) => state.room.roomJoined);
  const loggedIn = useAppSelector((state) => state.user.loggedIn);
  const computerDialogOpen = useAppSelector((state) => state.computer.isOpenDialog);
  const whiteboardDialogOpen = useAppSelector((state) => state.whitebaord.isOpenDialog);

  return (
    <div className="w-full h-full absolute">
      <ModalComponent />
      <VirtualJoystick />
      <GameHUD />

      <Condition condition={roomJoined} fallback={<SelectMenuDialog />}>
        <Condition condition={loggedIn} fallback={<LoginDialog />}>
          <Chat />
          <HelperGroups />
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
