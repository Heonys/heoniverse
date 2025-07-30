import { Joystick } from "react-joystick-component";
import { useAppSelector } from "@/hooks";
import { Condition } from "@/common";
import { phaserGame } from "@/game";
import { Game } from "@/game/scenes";

export type JoystickMovement =
  | {
      isMoving: false;
    }
  | {
      isMoving: true;
      direction: {
        left: boolean;
        right: boolean;
        top: boolean;
        bottom: boolean;
      };
    };

export const VirtualJoystick = () => {
  // const { innerWidth } = useWindowSize();
  const showJoystick = useAppSelector((state) => state.user.showJoystick);
  const game = phaserGame.scene.keys.game as Game;

  return (
    <div className="fixed right-10 bottom-20">
      <Condition condition={showJoystick}>
        <Joystick
          size={75}
          baseColor="#5c5c5c60"
          stickColor="#5c5c5c80"
          move={(e) => {
            console.log(e.x, e.y);

            // const rad = Math.atan2(e.y || 0, e.x || 0);
            // const deg = (rad * 180) / Math.PI;
            // console.log(deg);
          }}
          stop={() => {
            game.localPlayer.setJoystickMovement({ isMoving: false });
          }}
        />
      </Condition>
    </div>
  );
};
