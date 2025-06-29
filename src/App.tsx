import { MenuDialog } from "@/components";
import { Condition } from "@/components/common";
import { useAppSelector } from "@/hooks";

function App() {
  const roomJoined = useAppSelector((state) => state.room.roomJoined);

  return (
    <div className="w-full h-full absolute">
      <Condition condition={!roomJoined}>
        <MenuDialog />
      </Condition>
    </div>
  );
}

export default App;
