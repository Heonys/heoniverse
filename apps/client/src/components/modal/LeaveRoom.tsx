import { AppButton } from "@/common";
import { Backdrop } from "./Backdrop";

type Props = {
  onClose: () => void;
};

export const LeaveRoom = ({ onClose }: Props) => {
  return (
    <Backdrop>
      <div className="flex w-full select-none flex-col gap-3">
        <div className="flex flex-col space-y-1.5 text-left">
          <h2 className="text-lg font-semibold leading-none tracking-tight text-white">
            Leave Room
          </h2>
          <p className="text-sm text-[#c2c2c2]">현재 방을 나가시겠습니까?</p>
        </div>
        <div className="flex items-center justify-center gap-2">
          <AppButton type="submit" className="bg-white px-5 text-black" onClick={onClose}>
            확인
          </AppButton>
        </div>
      </div>
    </Backdrop>
  );
};
