import { MenuDialog, ComputerDialog, WhiteboardDialog } from "@/components";
import { useAppSelector } from "@/hooks";
import { Condition } from "@/common";

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
    </div>
  );
}

export default App;
