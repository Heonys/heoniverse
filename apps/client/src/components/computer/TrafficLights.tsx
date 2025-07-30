import { useAppDispatch } from "@/hooks";
import { AppIcon } from "@/icons";
import { closeApp } from "@/stores/desktopSlice";

type Props = {
  id: string;
  onClose?: () => void;
};

export const TrafficLights = ({ id, onClose }: Props) => {
  const dispatch = useAppDispatch();

  return (
    <div className="absolute left-0 flex gap-2 items-center ml-2 mt-2 group">
      <button
        className="size-[13px] rounded-full bg-[#ff5f56] border-[#e0443e] cursor-pointer flex justify-center items-center shadow-2xl group-hover:scale-110"
        onClick={() => {
          dispatch(closeApp(id));
          onClose?.();
        }}
      >
        <AppIcon
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-150"
          iconName="x-mark-bold"
          size={10}
        />
      </button>
      <button className="size-[13px] rounded-full bg-[#ffbd2e] border-[#dea123] cursor-pointer flex justify-center items-center shadow-2xl group-hover:scale-110">
        <AppIcon
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-150"
          iconName="minus"
          size={10}
        />
      </button>
      <button className="size-[13px] rounded-full bg-[#27c93f] border-[#1aab29] cursor-pointer flex justify-center items-center shadow-2xl group-hover:scale-110">
        <AppIcon
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-150"
          iconName="full"
          size={10}
        />
      </button>
    </div>
  );
};
