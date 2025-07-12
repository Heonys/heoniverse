import { IconBaseProps } from "react-icons";
import { HiMiniXMark } from "react-icons/hi2";
import { FaGithub } from "react-icons/fa";
import { CiFaceSmile } from "react-icons/ci";
import { MdRoom } from "react-icons/md";
import { BiJoystickAlt } from "react-icons/bi";
import { BiSolidHelpCircle } from "react-icons/bi";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";

export type IconNames = keyof typeof IconMap;
const IconMap = {
  ["x-mark"]: HiMiniXMark,
  ["chat"]: IoChatbubbleEllipsesOutline,
  ["smile"]: CiFaceSmile,
  ["joystick"]: BiJoystickAlt,
  ["help"]: BiSolidHelpCircle,
  ["github"]: FaGithub,
  ["room"]: MdRoom,
};

type Props = { iconName: IconNames } & IconBaseProps;

export const AppIcon = ({ iconName, ...props }: Props) => {
  const Icon = IconMap[iconName];
  return <Icon {...props} />;
};
