import { IconBaseProps } from "react-icons";
import { FaGithub, FaApple, FaWifi, FaShieldAlt } from "react-icons/fa";
import { CiFaceSmile } from "react-icons/ci";
import { BiSolidHelpCircle } from "react-icons/bi";
import { FaArrowRight, FaXmark, FaMinus, FaPlus } from "react-icons/fa6";
import { RiShutDownLine } from "react-icons/ri";
import { HiMiniXMark, HiOutlineMagnifyingGlass, HiOutlinePencil } from "react-icons/hi2";
import { BsLayoutSidebar, BsCameraVideo, BsEmojiSmile } from "react-icons/bs";
import { GoShare } from "react-icons/go";
import { RxCopy, RxBorderWidth } from "react-icons/rx";
import { LiaEditSolid } from "react-icons/lia";
import { TfiInfoAlt, TfiLayoutLineSolid } from "react-icons/tfi";
import { RiVoiceprintFill, RiCursorFill } from "react-icons/ri";
import { LuEraser, LuUndo2, LuRedo2 } from "react-icons/lu";
import { IoMdRefresh } from "react-icons/io";
import { IoText } from "react-icons/io5";
import {
  MdRoom,
  MdOutlinePublic,
  MdMonitorHeart,
  MdExitToApp,
  MdOutlineCloseFullscreen,
  MdOutlineOpenInFull,
  MdErrorOutline,
} from "react-icons/md";
import {
  IoChevronBack,
  IoChevronForward,
  IoChevronUp,
  IoEllipseOutline,
  IoSquareOutline,
  IoChatbubbleEllipsesSharp,
  IoBatteryCharging,
} from "react-icons/io5";

import { GoDiamond } from "react-icons/go";
import { HiMiniArrowLongRight } from "react-icons/hi2";
import { IoHandRightOutline } from "react-icons/io5";
import { PiMinus, PiPlus } from "react-icons/pi";
import { FaGamepad } from "react-icons/fa";
import { BsPersonLock } from "react-icons/bs";
import { FaLock, FaLockOpen } from "react-icons/fa";
import { FaUserFriends } from "react-icons/fa";
import { IoCreateOutline } from "react-icons/io5";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { RiErrorWarningLine } from "react-icons/ri";
import { FaDoorOpen } from "react-icons/fa6";
import { SlMagicWand } from "react-icons/sl";
import { MdMonitor } from "react-icons/md";
import { IoBatteryHalf } from "react-icons/io5";
import { BsChatFill } from "react-icons/bs";
import { IoBatteryFullOutline } from "react-icons/io5";
import { FaSignal } from "react-icons/fa";
import { HiMapPin } from "react-icons/hi2";
import { IoNotificationsSharp } from "react-icons/io5";
import { FaVideo, FaVideoSlash } from "react-icons/fa6";
import { IoMdMic, IoMdMicOff } from "react-icons/io";
import { HiOutlineSwitchHorizontal } from "react-icons/hi";

export type IconNames = keyof typeof IconMap;
const IconMap = {
  ["x-mark"]: HiMiniXMark,
  ["x-mark-bold"]: FaXmark,
  ["chat"]: IoChatbubbleEllipsesSharp,
  ["chat-fill"]: BsChatFill,
  ["smile"]: CiFaceSmile,
  ["joystick"]: FaGamepad,
  ["help"]: BiSolidHelpCircle,
  ["github"]: FaGithub,
  ["room"]: MdRoom,
  ["public"]: MdOutlinePublic,
  ["arrow-right"]: FaArrowRight,
  ["monitor"]: MdMonitorHeart,
  ["batterty-charging"]: IoBatteryCharging,
  ["batterty-half"]: IoBatteryHalf,
  ["batterty-full"]: IoBatteryFullOutline,
  ["apple-logo"]: FaApple,
  ["shut-down"]: RiShutDownLine,
  ["wifi"]: FaWifi,
  ["minus"]: FaMinus,
  ["full"]: MdOutlineOpenInFull,
  ["exit-full"]: MdOutlineCloseFullscreen,
  ["search"]: HiOutlineMagnifyingGlass,
  ["chevron-left"]: IoChevronBack,
  ["chevron-right"]: IoChevronForward,
  ["chevron-up"]: IoChevronUp,
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
  ["draw"]: HiOutlinePencil,
  ["line"]: TfiLayoutLineSolid,
  ["ellipse"]: IoEllipseOutline,
  ["rect"]: IoSquareOutline,
  ["cursor"]: RiCursorFill,
  ["eraser"]: LuEraser,
  ["undo"]: LuUndo2,
  ["redo"]: LuRedo2,
  ["stroke"]: RxBorderWidth,
  ["refresh"]: IoMdRefresh,
  ["exit"]: MdExitToApp,
  ["diamond"]: GoDiamond,
  ["arrow-right-thin"]: HiMiniArrowLongRight,
  ["text"]: IoText,
  ["hand"]: IoHandRightOutline,
  ["plus-thin"]: PiPlus,
  ["minus-thin"]: PiMinus,
  ["person-lock"]: BsPersonLock,
  ["people"]: FaUserFriends,
  ["lock"]: FaLock,
  ["un-lock"]: FaLockOpen,
  ["create"]: IoCreateOutline,
  ["eye"]: IoEye,
  ["eye-off"]: IoEyeOff,
  ["warning"]: RiErrorWarningLine,
  ["door"]: FaDoorOpen,
  ["wand"]: SlMagicWand,
  ["display"]: MdMonitor,
  ["signal"]: FaSignal,
  ["map"]: HiMapPin,
  ["mic-on"]: IoMdMic,
  ["mic-off"]: IoMdMicOff,
  ["video-on"]: FaVideo,
  ["video-off"]: FaVideoSlash,
  ["bell"]: IoNotificationsSharp,
  ["switch"]: HiOutlineSwitchHorizontal,
};

type Props = { iconName: IconNames } & IconBaseProps;

export const AppIcon = ({ iconName, ...props }: Props) => {
  const Icon = IconMap[iconName];
  return <Icon {...props} />;
};
