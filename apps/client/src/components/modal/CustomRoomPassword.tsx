import { useState } from "react";
import { ServerError } from "colyseus.js";
import { AppButton, PasswordBox } from "@/common";
import { Backdrop } from "./Backdrop";
import { useAnimate } from "motion/react";
import { useGame, useModal } from "@/hooks";

type Props = {
  roomId: string;
};

export const CustomRoomPassword = ({ roomId }: Props) => {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [scope, animate] = useAnimate();
  const { hideModal } = useModal();
  const { preloaderScene } = useGame();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    preloaderScene.network
      .joinCustomRoom(roomId, password)
      .then(() => {
        preloaderScene.launchGame();
        hideModal();
      })
      .catch((error) => {
        if (error instanceof ServerError) {
          setMessage(error.message);
          animate(scope.current, { x: [0, -5, 5, -3, 3, -1, 1, 0] }, { duration: 0.4 });
        }
      });
  };

  return (
    <Backdrop ref={scope}>
      <form noValidate className="flex flex-col gap-3 select-none" onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-1.5 text-left">
          <h2 className="text-lg font-semibold leading-none tracking-tight text-white">
            Input Password
          </h2>
          <p className="text-sm text-muted-foreground text-[#c2c2c2]">비밀번호를 입력해주세요</p>
        </div>
        <div className="text-white flex flex-col gap-1.5">
          <PasswordBox value={password} onChange={setPassword} required autoFocus />
          <div className="text-xs text-red-400 ml-1 min-h-4">{message}</div>
        </div>
        <div className="flex justify-center items-center">
          <AppButton type="submit" className="px-5 bg-white text-black font-medium">
            확인
          </AppButton>
        </div>
      </form>
    </Backdrop>
  );
};
