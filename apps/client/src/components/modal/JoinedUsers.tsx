import { useAppSelector, useGame } from "@/hooks";
import { Backdrop } from "./Backdrop";

export const JoinedUsers = () => {
  const { getLocalPlayer } = useGame();
  const { otherPlayersName } = useAppSelector((state) => state.user);
  const users = [...otherPlayersName.entries()].map(([id, name]) => ({ id, name }));

  return (
    <Backdrop>
      <div className="flex w-full select-none flex-col rounded-lg">
        <div className="flex w-full flex-col space-y-1.5 text-left">
          <h2 className="text-lg font-semibold leading-none tracking-tight text-white">
            Joined Users
          </h2>
          <p className="text-sm text-[#c2c2c2]">{`현재 방에 접속한 인원 총 ${users.length + 1}명`}</p>
        </div>
        <div className="mt-2 flex flex-col gap-1 text-white">
          <div className="border-b border-white/10 p-1">
            <UserListRow id={getLocalPlayer().playerId} name={getLocalPlayer().playerName.text} />
          </div>
          <div className="grid grid-cols-2 p-1">
            {users.map(({ id, name }) => (
              <UserListRow key={id} id={id} name={name} />
            ))}
          </div>
        </div>
      </div>
    </Backdrop>
  );
};

function UserListRow({ id, name }: { id: string; name: string }) {
  return (
    <div>
      <span className="text-base font-medium text-blue-400">{name}</span>
      <span className="ml-1 text-xs text-[#888]">{`#${id}`}</span>
    </div>
  );
}
