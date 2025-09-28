import { Joystick } from "react-joystick-component";
import { isBrowser } from "react-device-detect";
import { useAppSelector, useGame } from "@/hooks";
import { Condition } from "@/common";
import { angle2Movement, cn } from "@/utils";
import { eventEmitter } from "@/game/events";

export type MovementInput = {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
};

export type JoystickMovement = { isMoving: boolean; movement: MovementInput };

export const VirtualJoystick = () => {
  const showJoystick = useAppSelector((state) => state.user.showJoystick);
  const loggedIn = useAppSelector((state) => state.user.loggedIn);
  const { getLocalPlayer } = useGame();

  return (
    <div className={cn("bottom-22 fixed z-10 select-none", isBrowser ? "right-10" : "right-5")}>
      <Condition condition={loggedIn && (!isBrowser || showJoystick)}>
        <div
          className="size-13 -left-13 absolute -top-7 flex cursor-pointer items-center justify-center rounded-full bg-[#5c5c5c60] font-bold text-black/80"
          style={{ fontFamily: "Retro" }}
          onClick={() => eventEmitter.emit("JOYSTICK_KEY_PRESSED", "keyE")}
        >
          E
        </div>
        <div
          className="size-13 absolute -top-16 left-2.5 flex cursor-pointer items-center justify-center rounded-full bg-[#5c5c5c60] font-bold text-black/80"
          style={{ fontFamily: "Retro" }}
          onClick={() => eventEmitter.emit("JOYSTICK_KEY_PRESSED", "keyR")}
        >
          R
        </div>
        <Joystick
          size={75}
          baseColor="#5c5c5c60"
          stickColor="#5c5c5c80"
          move={(e) => {
            const rad = Math.atan2(e.y || 0, e.x || 0);
            const deg = (rad * 180) / Math.PI;
            const movement = angle2Movement(deg);
            getLocalPlayer().setJoystickMovement({ isMoving: true, movement });
          }}
          stop={() => {
            getLocalPlayer().setJoystickMovement({
              isMoving: false,
              movement: { left: false, right: false, up: false, down: false },
            });
          }}
        />
      </Condition>
    </div>
  );
};
