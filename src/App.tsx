import { MenuDialog, ComputerDialog } from "@/components";
import { useAppSelector } from "@/hooks";
import { Condition } from "@/common";

function App() {
  const roomJoined = useAppSelector((state) => state.room.roomJoined);
  const computerDialogOpen = useAppSelector((state) => state.computer.isOpenDialog);

  return (
    <div className="w-full h-full absolute">
      <Condition condition={!roomJoined}>
        <MenuDialog />
      </Condition>
      <Condition condition={computerDialogOpen}>
        <ComputerDialog />
      </Condition>
    </div>
  );
}

export default App;
