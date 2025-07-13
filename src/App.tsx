import { MenuDialog, ComputerDialog, WhiteboardDialog, Chat, HelperGroups } from "@/components";
import { useAppSelector } from "@/hooks";
import { Condition } from "@/common";
import { TestComponent } from "./TestComponent";

function App() {
  const roomJoined = useAppSelector((state) => state.room.roomJoined);
  const computerDialogOpen = useAppSelector((state) => state.computer.isOpenDialog);
  const whiteboardDialogOpen = useAppSelector((state) => state.whitebaord.isOpenDialog);

  return (
    <div className="w-full h-full absolute">
      <Condition condition={!roomJoined}>
        <MenuDialog />
      </Condition>
      <Condition condition={computerDialogOpen}>
        <ComputerDialog />
      </Condition>
      <Condition condition={whiteboardDialogOpen}>
        <WhiteboardDialog />
      </Condition>
      <Chat />
      <HelperGroups />
      <TestComponent />
    </div>
  );
}

export default App;
