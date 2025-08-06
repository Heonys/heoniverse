import { AppButton } from "@/common";
import { Backdrop } from "./Backdrop";

type Props = {
  onClose: () => void;
};

export const LeaveRoom = ({ onClose }: Props) => {
  return (
    <Backdrop>
      <div className="flex flex-col gap-3 select-none">
        <div className="flex flex-col space-y-1.5 text-left">
          <h2 className="text-lg font-semibold leading-none tracking-tight text-white">
            Leave Room
          </h2>
          <p className="text-sm text-muted-foreground text-[#c2c2c2]">현재 방을 나가시겠습니까?</p>
        </div>
        <div className="flex justify-center items-center gap-2">
          <AppButton type="submit" className="px-5 bg-white text-black" onClick={onClose}>
            확인
          </AppButton>
        </div>
      </div>
    </Backdrop>
  );
};
