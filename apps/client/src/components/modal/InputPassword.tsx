import { InputBox } from "@/common";
import { AppButton } from "@/common";
import { Backdrop } from "./Backdrop";

export const InputPassword = () => {
  return (
    <Backdrop>
      <div className="flex flex-col gap-3 select-none">
        <div className="flex flex-col space-y-1.5 text-left">
          <h2 className="text-lg font-semibold leading-none tracking-tight text-white">
            Input Password
          </h2>
          <p className="text-sm text-muted-foreground text-[#c2c2c2]">비밀번호를 입력해주세요</p>
        </div>
        <div className="text-white">
          <InputBox label="password" topLabel={false} />
        </div>
        <div className="flex justify-center items-center">
          <AppButton className="px-5 bg-white text-black">확인</AppButton>
        </div>
      </div>
    </Backdrop>
  );
};
