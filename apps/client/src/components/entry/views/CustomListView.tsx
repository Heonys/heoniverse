import { useAppSelector } from "@/hooks";
import { AppIcon } from "@/icons";
import { Condition } from "@/common";
import { RoomRow } from "../RoomRow";
import { ViewHead } from "../primitives";
import { CustomRoom } from "../types";

type Props = {
  onBack: () => void;
  onPick: (room: CustomRoom) => void;
  onCreate: () => void;
};

export const CustomListView = ({ onBack, onPick, onCreate }: Props) => {
  const availableRooms = useAppSelector((state) => state.room.availableRooms);

  return (
    <div className="flex flex-col">
      <ViewHead title="비공개 방" sub="원하는 방에 들어가거나, 새로 만들어요" onBack={onBack} />

      <Condition
        condition={availableRooms.length !== 0}
        fallback={
          <div className="text-text-dim flex h-24 items-center justify-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.028] text-[12.5px]">
            <AppIcon iconName="warning" size={16} className="text-text-faint" />
            현재 생성된 비공개 방이 없습니다.
          </div>
        }
      >
        <div className="entry-scroll flex max-h-[300px] flex-col gap-[7px] overflow-y-auto pr-1.5">
          {availableRooms.map((room) => (
            <RoomRow key={room.roomId} room={room} onClick={() => onPick(room)} />
          ))}
        </div>
      </Condition>

      <button
        type="button"
        onClick={onCreate}
        className="text-text-dim hover:text-app-text mt-2.5 inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-dashed border-white/[0.16] bg-transparent p-[11px] text-[13px] font-semibold transition-colors hover:border-white/[0.28] hover:bg-white/[0.04]"
      >
        <AppIcon iconName="plus" size={13} />새 방 만들기
      </button>
    </div>
  );
};
