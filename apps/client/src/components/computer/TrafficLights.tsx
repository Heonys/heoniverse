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
    <div className="group absolute left-0 ml-3 mt-2 flex items-center gap-2">
      <button
        className="flex size-[13px] cursor-pointer items-center justify-center rounded-full border-[#e0443e] bg-[#ff5f56] shadow-2xl group-hover:scale-110"
        onClick={() => {
          dispatch(closeApp(id));
          onClose?.();
        }}
      >
        <AppIcon
          className="opacity-0 transition-opacity duration-150 group-hover:opacity-100"
          iconName="x-mark-bold"
          size={10}
        />
      </button>
      <button className="flex size-[13px] cursor-pointer items-center justify-center rounded-full border-[#dea123] bg-[#ffbd2e] shadow-2xl group-hover:scale-110">
        <AppIcon
          className="opacity-0 transition-opacity duration-150 group-hover:opacity-100"
          iconName="minus"
          size={10}
        />
      </button>
      <button className="flex size-[13px] cursor-pointer items-center justify-center rounded-full border-[#1aab29] bg-[#27c93f] shadow-2xl group-hover:scale-110">
        <AppIcon
          className="opacity-0 transition-opacity duration-150 group-hover:opacity-100"
          iconName="full"
          size={10}
        />
      </button>
    </div>
  );
};
