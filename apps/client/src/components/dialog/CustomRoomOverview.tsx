import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { useAppSelector, useModal } from "@/hooks";
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

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "avatar",
        cell: () => (
          <div className="w-8 ml-1 flex justify-center items-center">
            <AppIcon iconName="lock" color="orange" size={17} />
          </div>
        ),
      }),
      columnHelper.accessor("metadata.name", {
        header: "Name",
        cell: (info) => (
          <div className="w-[100px] h-full truncate font-semibold" title={info.getValue()}>
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
          <div className="flex justify-center items-center">
            <AppIcon iconName="people" size={20} />
          </div>
        ),
        cell: (info) => <div className="w-10 text-center font-semibold">{info.getValue()}</div>,
      }),
      columnHelper.display({
        id: "enter",
        cell: () => (
          <div className="w-16 flex justify-center items-center">
            <AppButton
              className="bg-transparent ring-1 ring-white/50"
              onClick={() => showModal("InputPassword")}
            >
              <div className="flex items-center gap-1">
                <AppIcon iconName="exit" />
                <div>입장</div>
              </div>
            </AppButton>
          </div>
        ),
      }),
    ],
    [showModal],
  );

  const table = useReactTable({
    debugAll: false,
    data: availableRooms,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-8 pb-5 flex flex-col gap-3">
      <div
        className="absolute left-2 top-2 p-1 pr-3 flex items-center gap-2 rounded-md hover:bg-white/10 transition-colors duration-150 cursor-pointer"
        onClick={onPrevious}
      >
        <AppIcon iconName="chevron-left" size={18} />
        <div className="text-xs font-medium">메인화면</div>
      </div>

      <div className="flex justify-center items-center gap-2">
        <AppIcon iconName="people" size={23} className="translate-y-0.5" />
        <div className="text-2xl font-bold leading-none tracking-tight">Custom Room</div>
      </div>

      <div className="text-sm text-[#c2c2c2] flex justify-center items-center">
        현재 생성된 커스텀 방 목록입니다. 방에 입장하거나 생성할 수 있습니다.
      </div>

      <Condition
        condition={availableRooms.length !== 0}
        fallback={
          <div className="min-w-[700px] h-32 bg-[#09090b] rounded-md p-2 flex items-center justify-center gap-2 text-orange-200">
            <AppIcon iconName="warning" size={20} />
            <div>현재 생성된 커스텀 방이 없습니다.</div>
          </div>
        }
      >
        <div className="mt-4 min-w-[700px] max-h-[350px] overflow-y-auto">
          <table className="table-fixed border-collapse select-none bg-[#09090b] text-sm rounded-md ">
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
                    <td key={cell.id} className="p-3 truncate">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Condition>

      <div className="flex justify-center items-center">
        <AppButton className="px-3" onClick={onCreate}>
          방 만들기
        </AppButton>
      </div>
    </div>
  );
};
