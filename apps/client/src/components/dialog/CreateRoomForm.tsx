import { AppButton } from "@/common";
import { InputBox } from "@/common/InputBox";
import PasswordBox from "@/common/PasswordBox";
import { AppIcon } from "@/icons";

type Props = {
  onPrevious: () => void;
};

export const CreateRoomForm = ({ onPrevious }: Props) => {
  return (
    <div className="p-8 pb-5 flex flex-col gap-3">
      <div
        className="absolute left-2 top-2 p-1 pr-3 flex items-center gap-2 rounded-md hover:bg-white/10 transition-colors duration-150 cursor-pointer"
        onClick={onPrevious}
      >
        <AppIcon iconName="chevron-left" size={18} />
        <div className="text-xs font-medium">커스텀 방 목록</div>
      </div>

      <div className="flex justify-center items-center gap-2">
        <AppIcon iconName="create" size={23} className="translate-y-0.5" />
        <div className="text-2xl font-bold ">Create Room</div>
      </div>

      <div className="text-sm text-[#c2c2c2] flex justify-center items-center">
        새로운 커스텀 방을 생성합니다 비밀번호를 설정할 수 있습니다.
      </div>

      <div className="p-2 px-5 flex flex-col gap-4 w-[400px]">
        <InputBox label="Name" required />
        <InputBox label="Description" required />
        <PasswordBox />
      </div>
      <div className="flex justify-center items-center">
        <AppButton className="font-medium px-4">생성</AppButton>
      </div>
    </div>
  );
};
