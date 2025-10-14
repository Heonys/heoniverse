import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { isBrowser } from "react-device-detect";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAppDispatch, useAppSelector, useGame, useModal } from "@/hooks";
import { AppButton, AppSlider, InputBox, TextareaBox } from "@/common";
import { spriteAvatars } from "@/constants/game";
import { grantAdmin, setLoggedIn } from "@/stores/userSlice";
import { cn, FormSchema } from "@/utils";
import { AppIcon } from "@/icons";
import { RoomType } from "@heoniverse/shared";
import { SpriteAnimation } from "@/common/SpriteAnimation";
import { createLoginMetrics } from "@/service/appwrite";

type FormType = z.infer<typeof FormSchema>;

export const LoginDialog = () => {
  const dispatch = useAppDispatch();
  const { name, description, roomType } = useAppSelector((state) => state.room);
  const { gameScene, getLocalPlayer, network } = useGame();
  const { showModal } = useModal();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(FormSchema),
  });
  const [avatarIndex, setAvatarIndex] = useState(0);

  const onSubmit = (data: FormType) => {
    const isAdmin = data.name === import.meta.env.VITE_ADMIN_ID;
    if (isAdmin) {
      dispatch(grantAdmin());
      data = { ...data, name: "admin" };
    }
    const player = getLocalPlayer();
    player.setPlayerName(data.name);
    player.setPlayerAvatar(spriteAvatars[avatarIndex].name);
    player.readyToConnect = true;
    network.readyToConnect();
    gameScene.enableKeys();
    dispatch(setLoggedIn(true));
    if (isBrowser) showModal("ControlGuide");

    if (!isAdmin && import.meta.env.PROD) {
      createLoginMetrics({
        client_id: player.playerId,
        avatar: spriteAvatars[avatarIndex].name,
        nickname: data.name,
        room_name: name,
        desktop: isBrowser,
      });
    }
  };

  return (
    <form
      noValidate
      className={cn(
        "-translate-1/2 fixed left-1/2 top-1/2 z-[9999] select-none rounded-2xl bg-[#323338] shadow-xl",
        isBrowser ? "w-[600px] p-5 px-16" : "w-[390px] py-5",
      )}
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
        <div className="flex flex-col gap-2 p-1">
          <div className="text-center text-sm font-semibold">캐릭터 선택</div>
          <AppSlider afterChange={(index) => setAvatarIndex(index)}>
            {spriteAvatars.map(({ name, sprite }) => (
              <div className="flex items-center justify-center p-10" key={name}>
                <SpriteAnimation
                  animKey="avatar"
                  src={sprite}
                  startFrame={18}
                  endFrame={23}
                  frameWidth={32}
                  frameHeight={54}
                />
              </div>
            ))}
          </AppSlider>
        </div>

        <div className="my-auto p-2">
          <div className="flex flex-col gap-1.5">
            <InputBox label="Nickname" regiser={register("name")} required autoFocus />
            <div className="ml-1 text-xs text-red-400">{errors.name?.message}</div>
            <TextareaBox label="Status Message" regiser={register("message")} />
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
