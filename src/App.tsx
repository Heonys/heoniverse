import { SelectMenuDialog, Chat, HelperGroups, LoginDialog } from "@/components";
import { useAppSelector } from "@/hooks";
import { Condition } from "@/common";
import { ComputerDialog } from "@/components/computer";
import { WhiteboardDialog } from "@/components/whiteboard";

function App() {
  const roomJoined = useAppSelector((state) => state.room.roomJoined);
  const loggedIn = useAppSelector((state) => state.user.loggedIn);
  const computerDialogOpen = useAppSelector((state) => state.computer.isOpenDialog);
  const whiteboardDialogOpen = useAppSelector((state) => state.whitebaord.isOpenDialog);

  return (
    <div className="w-full h-full absolute">
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
