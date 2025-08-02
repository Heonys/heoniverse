import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useAppSelector } from "@/hooks";
import { AppIcon } from "@/icons";
import { RoomAvailable } from "colyseus.js";
import { RoomMetadata } from "@heoniverse/shared";
import { AppButton } from "@/common";

type Props = {
  onPrevious: () => void;
};

const columnHelper = createColumnHelper<RoomAvailable<RoomMetadata>>();

const columns = [
  columnHelper.display({
    id: "avatar",
    cell: () => (
      <div className="w-8 ml-3 flex justify-center items-center">
        <AppIcon iconName="lock" />
      </div>
    ),
  }),
  columnHelper.accessor("name", {
    header: "Name",
    cell: (info) => (
      <div className="w-[100px] h-full truncate font-semibold">{info.getValue()}</div>
    ),
  }),
  columnHelper.accessor("metadata.description", {
    header: "Description",
    cell: (info) => <div className="w-[300px] truncate">{info.getValue()}</div>,
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
        <AppButton>
          <div className="flex items-center gap-1">
            <AppIcon iconName="lock" />
            <div>입장</div>
          </div>
        </AppButton>
      </div>
    ),
  }),
];

export const PrivateRoomOverview = ({ onPrevious }: Props) => {
  const availableRooms = useAppSelector((state) => state.room.availableRooms);

  const table = useReactTable({
    debugAll: false,
    data: [...availableRooms, ...availableRooms, ...availableRooms],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-8 flex flex-col gap-2">
      <div
        className="absolute left-2 top-2 p-1 pr-3 flex items-center gap-2 rounded-md hover:bg-white/10 transition-colors duration-150 cursor-pointer"
        onClick={onPrevious}
      >
        <AppIcon iconName="chevron-left" size={18} />
        <div className="text-xs font-medium">메인화면</div>
      </div>

      <div className="flex justify-center items-center gap-2">
        <AppIcon iconName="person-lock" size={23} />
        <div className="text-2xl font-bold ">Private Room</div>
      </div>

      <table className="mt-4 min-w-[700px] max-h-[350px] table-fixed border-collapse select-none bg-black/80 text-sm rounded-md">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="p-2 text-left">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="p-2 truncate">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center items-center">
        <AppButton>방 만들기</AppButton>
      </div>
    </div>
  );
};
