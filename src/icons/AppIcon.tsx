import { IconBaseProps } from "react-icons";
import { HiMiniXMark } from "react-icons/hi2";
import { FaGithub, FaApple, FaWifi } from "react-icons/fa";
import { CiFaceSmile } from "react-icons/ci";
import { MdRoom, MdOutlinePublic, MdMonitorHeart } from "react-icons/md";
import { BiJoystickAlt, BiSolidHelpCircle } from "react-icons/bi";
import { IoChatbubbleEllipsesOutline, IoBatteryCharging } from "react-icons/io5";
import { FaArrowRight } from "react-icons/fa6";
import { RiShutDownLine } from "react-icons/ri";
import { MdOutlineCloseFullscreen, MdOutlineOpenInFull, MdErrorOutline } from "react-icons/md";
import { FaXmark, FaMinus } from "react-icons/fa6";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { BsLayoutSidebar } from "react-icons/bs";
import { FaShieldAlt } from "react-icons/fa";
import { GoShare } from "react-icons/go";
import { RxCopy } from "react-icons/rx";
import { LiaEditSolid } from "react-icons/lia";
import { BsCameraVideo } from "react-icons/bs";
import { TfiInfoAlt } from "react-icons/tfi";
import { FaPlus } from "react-icons/fa6";
import { RiVoiceprintFill } from "react-icons/ri";
import { BsEmojiSmile } from "react-icons/bs";

export type IconNames = keyof typeof IconMap;
const IconMap = {
  ["x-mark"]: HiMiniXMark,
  ["x-mark-bold"]: FaXmark,
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
  ["minus"]: FaMinus,
  ["full"]: MdOutlineOpenInFull,
  ["exit-full"]: MdOutlineCloseFullscreen,
  ["search"]: HiOutlineMagnifyingGlass,
  ["chevron-left"]: IoChevronBack,
  ["chevron-right"]: IoChevronForward,
  ["sidebar"]: BsLayoutSidebar,
  ["shield"]: FaShieldAlt,
  ["shared"]: GoShare,
  ["copy"]: RxCopy,
  ["edit"]: LiaEditSolid,
  ["video"]: BsCameraVideo,
  ["info"]: TfiInfoAlt,
  ["plus"]: FaPlus,
  ["voice"]: RiVoiceprintFill,
  ["emoji"]: BsEmojiSmile,
  ["error"]: MdErrorOutline,
};

type Props = { iconName: IconNames } & IconBaseProps;

export const AppIcon = ({ iconName, ...props }: Props) => {
  const Icon = IconMap[iconName];
  return <Icon {...props} />;
};
