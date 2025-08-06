import { useAppSelector } from "@/hooks";
import { format } from "date-fns";

export const GameHUD = () => {
  const { id, name } = useAppSelector((state) => state.room);
  return (
    <div
      className="fixed top-1 right-1 px-4 py-2 rounded-md shadow-[2px_2px_0_#444] bg-white text-black select-none text-xs text-center"
      style={{ fontFamily: "Retro" }}
    >
      <span className="">{format(new Date(), "MMM d eee a h:mm")}</span>
      <div className="">{name}</div>
    </div>
  );
};
