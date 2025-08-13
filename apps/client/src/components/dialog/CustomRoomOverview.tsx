import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { useAppSelector, useGame, useModal } from "@/hooks";
import { AppIcon } from "@/icons";
import { RoomAvailable } from "colyseus.js";
import { RoomMetadata } from "@heoniverse/shared";
import { AppButton, Condition } from "@/common";

type Props = {
  onPrevious: () => void;
  onCreate: () => void;
};

const columnHelper = createColumnHelper<RoomAvailable<RoomMetadata>>();

export const CustomRoomOverview = ({ onPrevious, onCreate }: Props) => {
  const availableRooms = useAppSelector((state) => state.room.availableRooms);
  const { showModal } = useModal();
  const { preloaderScene } = useGame();

  const handleJoinButton = (roomId: string) => {
    preloaderScene.network.joinCustomRoom(roomId).then(() => {
      preloaderScene.launchGame();
    });
  };

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "avatar",
        cell: (info) => {
          const hasPassword = info.row.original.metadata?.hasPassword;
          return (
            <div className="ml-1 flex w-8 items-center justify-center">
              <Condition condition={hasPassword}>
                <AppIcon iconName="lock" color="orange" size={17} />
              </Condition>
            </div>
          );
        },
      }),
      columnHelper.accessor("metadata.name", {
        header: "Name",
        cell: (info) => (
          <div className="h-full w-[100px] truncate font-semibold" title={info.getValue()}>
            {info.getValue()}
          </div>
        ),
      }),
      columnHelper.accessor("metadata.description", {
        header: "Description",
        cell: (info) => (
          <div className="w-[300px] truncate" title={info.getValue()}>
            {info.getValue()}
          </div>
        ),
      }),
      columnHelper.accessor("roomId", {
        header: "RoomId",
        cell: (info) => <div>{info.getValue()}</div>,
      }),
      columnHelper.accessor("clients", {
        header: () => (
          <div className="flex items-center justify-center">
            <AppIcon iconName="people" size={20} />
          </div>
        ),
        cell: (info) => <div className="w-10 text-center font-semibold">{info.getValue()}</div>,
      }),
      columnHelper.display({
        id: "enter",
        cell: (info) => {
          const rowData = info.row.original;
          const hasPassword = rowData.metadata?.hasPassword;

          return (
            <div className="flex w-16 items-center justify-center">
              <AppButton
                className="bg-transparent ring-1 ring-white/35"
                onClick={() => {
                  if (hasPassword) {
                    showModal("CustomRoomPassword", { roomId: rowData.roomId });
                  } else {
                    handleJoinButton(rowData.roomId);
                  }
                }}
              >
                <div className="flex items-center gap-1">
                  <AppIcon
                    iconName={hasPassword ? "lock" : "exit"}
                    color={hasPassword ? "orange" : "white"}
                  />
                  <div>입장</div>
                </div>
              </AppButton>
            </div>
          );
        },
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [showModal],
  );

  const table = useReactTable({
    debugAll: false,
    data: availableRooms,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-col gap-3 p-8 pb-5">
      <div
        className="absolute left-2 top-2 flex cursor-pointer items-center gap-2 rounded-md p-1 pr-3 transition-colors duration-150 hover:bg-white/10"
        onClick={onPrevious}
      >
        <AppIcon iconName="chevron-left" size={18} />
        <div className="text-xs font-medium">메인화면</div>
      </div>

      <div className="flex items-center justify-center gap-2">
        <AppIcon iconName="people" size={23} className="translate-y-0.5" />
        <div className="text-2xl font-bold leading-none tracking-tight">Custom Room</div>
      </div>

      <div className="flex items-center justify-center text-sm text-[#c2c2c2]">
        현재 생성된 커스텀 방 목록입니다. 방에 입장하거나 생성할 수 있습니다.
      </div>

      <Condition
        condition={availableRooms.length !== 0}
        fallback={
          <div className="flex h-32 min-w-[700px] items-center justify-center gap-2 rounded-md bg-[#1e1f23] p-2 text-red-400">
            <AppIcon iconName="warning" size={20} />
            <div>현재 생성된 커스텀 방이 없습니다.</div>
          </div>
        }
      >
        <div className="mt-4 max-h-[350px] min-w-[700px] overflow-y-auto">
          <table className="table-fixed border-collapse select-none rounded-md bg-[#1e1f23] text-sm">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="p-3 text-left">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-t border-white/20">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="truncate p-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Condition>

      <div className="flex items-center justify-center">
        <AppButton className="px-3" onClick={onCreate}>
          방 만들기
        </AppButton>
      </div>
    </div>
  );
};
