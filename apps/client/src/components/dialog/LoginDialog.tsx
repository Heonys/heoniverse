import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@headlessui/react";

import { useAppDispatch, useAppSelector } from "@/hooks";
import { AppButton, AppSlider } from "@/common";
import { avatars } from "@/constants/game";
import { phaserGame } from "@/game";
import { Game } from "@/game/scenes";
import { setLoggedIn } from "@/stores/userSlice";
import { FormSchema } from "@/utils";
import { AppIcon } from "@/icons";

type FormType = z.infer<typeof FormSchema>;

export const LoginDialog = () => {
  const dispatch = useAppDispatch();
  const roomName = useAppSelector((state) => state.room.name);
  const roomDescription = useAppSelector((state) => state.room.description);
  const game = phaserGame.scene.keys.game as Game;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(FormSchema),
  });
  const [avatarIndex, setAvatarIndex] = useState(0);

  const onSubmit = (data: FormType) => {
    game.localPlayer.setPlayerName(data.name);
    game.localPlayer.setPlayerAvatar(avatars[avatarIndex].name);
    game.localPlayer.readyToConnect = true;
    game.network.readyToConnect();
    game.enableKeys();
    dispatch(setLoggedIn(true));
  };

  return (
    <form
      className="fixed top-1/2 left-1/2 -translate-1/2 z-[9999] bg-slate-800 p-6 px-16 rounded-2xl shadow-xl w-[600px] max-w-none"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-4 text-[#eee] ">
        <div className="flex justify-center items-center gap-2">
          <AppIcon iconName="public" size={23} className="translate-y-0.5" />
          <div className="text-2xl font-bold ">{roomName}</div>
        </div>
        <div className="text-sm text-[#c2c2c2] flex justify-center items-center gap-2">
          <AppIcon iconName="arrow-right" />
          {roomDescription}
        </div>
      </div>
      <div className="grid grid-cols-2 text-[#eee] my-6 gap-4">
        <div className="flex flex-col gap-2">
          <div className="text-center font-semibold">캐릭터 선택</div>
          <AppSlider afterChange={(index) => setAvatarIndex(index)}>
            {avatars.map(({ name, img }) => (
              <img key={name} src={img} alt={name} />
            ))}
          </AppSlider>
        </div>

        <div className="p-2">
          <div className="flex flex-col gap-1.5">
            <Input
              type="text"
              autoFocus
              autoComplete="off"
              placeholder="Player Name"
              className="w-full outline-0 placeholder-gray-400 placeholder:font-bold text-white border p-2 rounded-sm"
              {...register("name")}
            />
            <div className="text-xs text-red-400 ml-1">{errors.name?.message}</div>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <AppButton className="font-bold px-4">입장</AppButton>
      </div>
    </form>
  );
};
