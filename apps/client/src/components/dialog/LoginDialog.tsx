import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAppDispatch, useAppSelector, useGame } from "@/hooks";
import { AppButton, AppSlider, InputBox } from "@/common";
import { avatars } from "@/constants/game";
import { setLoggedIn } from "@/stores/userSlice";
import { FormSchema } from "@/utils";
import { AppIcon } from "@/icons";
import { RoomType } from "@heoniverse/shared";

type FormType = z.infer<typeof FormSchema>;

export const LoginDialog = () => {
  const dispatch = useAppDispatch();
  const { name, description, roomType } = useAppSelector((state) => state.room);
  const { gameScene, getLocalPlayer, network } = useGame();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(FormSchema),
  });
  const [avatarIndex, setAvatarIndex] = useState(0);

  const onSubmit = (data: FormType) => {
    const player = getLocalPlayer();
    player.setPlayerName(data.name);
    player.setPlayerAvatar(avatars[avatarIndex].name);
    player.readyToConnect = true;
    network.readyToConnect();
    gameScene.enableKeys();
    dispatch(setLoggedIn(true));
  };

  return (
    <form
      noValidate
      className="-translate-1/2 fixed left-1/2 top-1/2 z-[9999] w-[600px] max-w-none select-none rounded-2xl bg-[#323338] p-6 px-16 shadow-xl"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-4 text-[#eee]">
        <div className="flex items-center justify-center gap-2">
          <AppIcon iconName={roomType === RoomType.PUBLIC ? "public" : "wand"} size={23} />
          <div className="text-2xl font-bold leading-none tracking-tight">{name}</div>
        </div>
        <div className="flex items-center justify-center text-sm text-[#c2c2c2]">{description}</div>
      </div>
      <div className="my-6 grid grid-cols-2 gap-4 text-[#eee]">
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
            <InputBox label="Nickname" regiser={register("name")} required autoFocus />
            <div className="ml-1 text-xs text-red-400">{errors.name?.message}</div>
            {/* <TextareaBox label="Status Message" regiser={register("message")} /> */}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <AppButton type="submit" className="px-4 font-medium">
          입장
        </AppButton>
      </div>
    </form>
  );
};
