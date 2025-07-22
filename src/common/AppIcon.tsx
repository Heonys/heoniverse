import { IconBaseProps } from "react-icons";
import { HiMiniXMark } from "react-icons/hi2";
import { FaGithub, FaApple, FaWifi } from "react-icons/fa";
import { CiFaceSmile } from "react-icons/ci";
import { MdRoom, MdOutlinePublic, MdMonitorHeart } from "react-icons/md";
import { BiJoystickAlt, BiSolidHelpCircle } from "react-icons/bi";
import { IoChatbubbleEllipsesOutline, IoBatteryCharging } from "react-icons/io5";
import { FaArrowRight } from "react-icons/fa6";
import { RiShutDownLine } from "react-icons/ri";

export type IconNames = keyof typeof IconMap;
const IconMap = {
  ["x-mark"]: HiMiniXMark,
  ["chat"]: IoChatbubbleEllipsesOutline,
  ["smile"]: CiFaceSmile,
  ["joystick"]: BiJoystickAlt,
  ["help"]: BiSolidHelpCircle,
  ["github"]: FaGithub,
  ["room"]: MdRoom,
  ["public"]: MdOutlinePublic,
  ["arrow-right"]: FaArrowRight,
  ["monitor"]: MdMonitorHeart,
  ["batterty-charging"]: IoBatteryCharging,
  ["apple-logo"]: FaApple,
  ["shut-down"]: RiShutDownLine,
  ["wifi"]: FaWifi,
};

type Props = { iconName: IconNames } & IconBaseProps;

export const AppIcon = ({ iconName, ...props }: Props) => {
  const Icon = IconMap[iconName];
  return <Icon {...props} />;
};

export const ControlCenterIcon = ({ size }: { size: number }) => {
  return (
    <svg
      viewBox="0 0 29 29"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
    >
      <path d="M7.5,13h14a5.5,5.5,0,0,0,0-11H7.5a5.5,5.5,0,0,0,0,11Zm0-9h14a3.5,3.5,0,0,1,0,7H7.5a3.5,3.5,0,0,1,0-7Zm0,6A2.5,2.5,0,1,0,5,7.5,2.5,2.5,0,0,0,7.5,10Zm14,6H7.5a5.5,5.5,0,0,0,0,11h14a5.5,5.5,0,0,0,0-11Zm1.43439,8a2.5,2.5,0,1,1,2.5-2.5A2.5,2.5,0,0,1,22.93439,24Z" />
    </svg>
  );
};
