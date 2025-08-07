import { Joystick } from "react-joystick-component";
import { useAppSelector, useGame } from "@/hooks";
import { Condition } from "@/common";
import { angle2Movement } from "@/utils";

export type MovementInput = {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
};

export type JoystickMovement = { isMoving: boolean; movement: MovementInput };

export const VirtualJoystick = () => {
  const showJoystick = useAppSelector((state) => state.user.showJoystick);
  const { localPlayer } = useGame();

  return (
    <div className="fixed right-10 bottom-20 z-50">
      <Condition condition={showJoystick}>
        <Joystick
          size={75}
          baseColor="#5c5c5c60"
          stickColor="#5c5c5c80"
          move={(e) => {
            const rad = Math.atan2(e.y || 0, e.x || 0);
            const deg = (rad * 180) / Math.PI;
            const movement = angle2Movement(deg);
            localPlayer.setJoystickMovement({ isMoving: true, movement });
          }}
          stop={() => {
            localPlayer.setJoystickMovement({
              isMoving: false,
              movement: { left: false, right: false, up: false, down: false },
            });
          }}
        />
      </Condition>
    </div>
  );
};
