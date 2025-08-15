import { avatarIcons } from "@/constants/game";
import { cn } from "@/utils";
import { twMerge } from "tailwind-merge";

type Status = "available" | "budy" | "dnd";
type Props = {
  texture: string;
  status: Status;
  className?: string;
};

const colorMap: Record<Status, string> = {
  available: "bg-[#01dca2]",
  budy: "bg-[#fbd359]",
  dnd: "bg-[#e25156]",
};

export const AvatarIcon = ({ texture, status, className }: Props) => {
  const avatarIcon = avatarIcons.find((it) => it.name === texture)!.icon;

  return (
    <div
      className={twMerge(
        "relative flex size-11 items-center justify-center rounded-full bg-[#1e1f23] p-1.5",
        className,
      )}
    >
      <img
        src={avatarIcon}
        alt="avatar-icon"
        className="size-full translate-x-[1px] scale-110 object-contain"
        draggable={false}
      />
      <div
        className={cn(
          "absolute bottom-0 right-0 size-2.5 rounded-full ring ring-black",
          colorMap[status],
        )}
      ></div>
    </div>
  );
};
