import { Models } from "appwrite";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { AppIcon } from "@/icons";
import { useAppFetch } from "@/hooks";
import { getUserMetrics, Metrics } from "@/service/appwrite";
import { AvatarIcon } from "@/components";
import { Backdrop } from "./Backdrop";
import { Condition } from "@/common";

const columnHelper = createColumnHelper<Metrics & Models.DefaultRow>();

const columns = [
  columnHelper.accessor("client_id", {
    header: "ID",
    cell: (info) => <div className="w-[80px] text-xs">{info.getValue()}</div>,
  }),
  columnHelper.accessor("avatar", {
    header: () => <div className="text-center">아바타</div>,
    cell: (info) => <AvatarIcon texture={info.getValue()} />,
  }),
  columnHelper.accessor("nickname", {
    header: "닉네임",
    cell: (info) => <div className="w-[100px] font-semibold">{info.getValue()}</div>,
  }),
  columnHelper.accessor("room_name", {
    header: "방 이름",
    cell: (info) => <div className="w-[90px] truncate text-xs">{info.getValue()}</div>,
  }),
  columnHelper.accessor("desktop", {
    header: "플랫폼",
    cell: (info) => (
      <div className="ml-2 w-[40px]">
        <AppIcon iconName={info.getValue() ? "desktop" : "desktop"} size={22} />
      </div>
    ),
  }),
  columnHelper.accessor("$createdAt", {
    header: "생성시간",
    cell: (info) => (
      <div className="w-[160px] text-xs">
        {format(info.getValue(), "yyyy-MM-dd (eee) a h:mm", { locale: ko })}
      </div>
    ),
  }),
];

export const UserMetrics = () => {
  const { data } = useAppFetch({ fn: getUserMetrics });

  const table = useReactTable({
    debugAll: false,
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Backdrop className="max-w-3xl">
      <div className="flex w-full select-none flex-col items-center gap-5">
        <div className="flex w-full flex-col space-y-1.5 text-left">
          <div className="flex items-center gap-1">
            <AppIcon iconName="admin" className="text-[#fd366d]" size={20} />
            <h2 className="text-lg font-semibold leading-none tracking-tight text-white">
              User Metics
            </h2>
          </div>
          <p className="text-sm text-[#c2c2c2]">사용자 지표 및 통계</p>
        </div>
        <div className="max-h-[400px] w-full overflow-y-auto">
          <Condition condition={data}>
            <table className="mx-auto table-fixed border-collapse select-none rounded-md bg-[#1e1f23] text-sm text-white">
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
                      <td key={cell.id} className="truncate p-2.5">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Condition>
        </div>
      </div>
    </Backdrop>
  );
};
