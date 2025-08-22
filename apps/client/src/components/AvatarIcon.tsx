import { twMerge } from "tailwind-merge";
import { avatarIcons } from "@/constants/game";
import { Status } from "@heoniverse/shared";
import { cn } from "@/utils";

type Props = {
  texture: string;
  status?: Status;
  className?: string;
};

const colorMap: Record<Status, string> = {
  available: "bg-[#01dca2]",
  busy: "bg-[#fbd359]",
  focused: "bg-[#e25156]",
};

export const AvatarIcon = ({ texture, status, className }: Props) => {
  const avatarIcon = avatarIcons.find((it) => it.name === texture)!.icon;

  return (
    <div
      className={twMerge(
        "relative flex size-[38px] items-center justify-center rounded-full bg-[#1e1f23] p-1.5",
        className,
      )}
    >
      <img
        src={avatarIcon}
        alt="avatar-icon"
        className="size-full -translate-y-[1px] scale-[1.2] object-contain"
        draggable={false}
      />
      {status && (
        <div
          className={cn(
            "absolute bottom-0 right-0 size-2.5 rounded-full ring ring-black",
            colorMap[status],
          )}
        />
      )}
    </div>
  );
};
