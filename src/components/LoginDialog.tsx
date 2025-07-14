import { useState } from "react";
import { Input } from "@headlessui/react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { AppButton, AppIcon, AppSlider } from "@/common";
import { avatars } from "@/constants";
import { phaserGame } from "@/game";
import { Game } from "@/game/scenes";
import { setLoggedIn } from "@/stores/userSlice";

export const LoginDialog = () => {
  const dispatch = useAppDispatch();
  const roomName = useAppSelector((state) => state.room.name);
  const roomDescription = useAppSelector((state) => state.room.description);
  const game = phaserGame.scene.keys.game as Game;

  const [name, setName] = useState("");
  const [avatarIndex, setAvatarIndex] = useState(0);

  const handleJoin = () => {
    game.localPlayer.setPlayerName(name);
    game.localPlayer.setPlayerAvatar(avatars[avatarIndex].name);
    game.enableKeys();
    dispatch(setLoggedIn(true));
  };

  return (
    <div className="fixed top-1/2 left-1/2 -translate-1/2 z-[9999] bg-slate-900 p-6 px-16 rounded-2xl shadow-xl w-[600px] max-w-none">
      <div className="flex flex-col gap-4 text-[#eee] ">
        <div className="flex justify-center items-center gap-2">
          <AppIcon iconName="public" size={23} />
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
          <Input
            type="text"
            value={name}
            autoFocus
            onChange={(e) => setName(e.target.value)}
            autoComplete="off"
            placeholder="Player Name"
            className="w-full outline-0 placeholder-gray-400 placeholder:font-bold text-white border p-2 rounded-sm"
          />
        </div>
      </div>
      <div className="flex justify-center items-center">
        <AppButton className="font-bold" onClick={handleJoin} disabled={!name.trim()}>
          입장
        </AppButton>
      </div>
    </div>
  );
};
