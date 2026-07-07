import { useEffect, useState } from "react";
import { useAnimate } from "motion/react";
import { AppIcon } from "@/icons";
import { cn } from "@/utils";
import { RoomRow } from "../RoomRow";
import { EntryButton, ViewHead } from "../primitives";
import { CustomRoom } from "../types";

type Props = {
  room: CustomRoom | null;
  // 입장하기(join) 시점에 서버가 돌려준 오류 — "비밀번호가 올바르지 않습니다." 등
  serverError: string | null;
  onBack: () => void;
  onConfirm: (password: string) => void;
};

export const PasswordView = ({ room, serverError, onBack, onConfirm }: Props) => {
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [scope, animate] = useAnimate();

  const error = localError ?? serverError;

  // 오류가 나타날 때마다 입력칸을 흔들어 시선을 끈다
  useEffect(() => {
    if (!error || !scope.current) return;
    animate(scope.current, { x: [0, -6, 6, -4, 4, 0] }, { duration: 0.36 });
  }, [error, animate, scope]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!password.trim()) {
      setLocalError("비밀번호를 입력해주세요");
      // 같은 오류로 다시 제출해도 흔들리도록 리트리거
      if (scope.current) animate(scope.current, { x: [0, -6, 6, -4, 4, 0] }, { duration: 0.36 });
      return;
    }
    onConfirm(password);
  };

  return (
    <form noValidate className="flex flex-col" onSubmit={handleSubmit}>
      <ViewHead
        title="잠긴 방"
        sub="비밀번호를 알고 있다면 바로 들어갈 수 있어요"
        onBack={onBack}
      />

      {/* 어느 방에 들어가는지 보이도록 방 요약을 함께 띄운다 */}
      {room && <RoomRow room={room} className="mb-[13px]" />}

      <div className="flex flex-col gap-[11px]">
        <div ref={scope} className="relative">
          <AppIcon
            iconName="lock"
            size={14}
            className="text-text-faint absolute left-3.5 top-1/2 -translate-y-1/2"
          />
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setLocalError(null);
            }}
            placeholder="비밀번호를 입력해주세요"
            className={cn(
              "bg-surface text-app-text h-11 w-full rounded-[11px] border border-white/[0.07] pl-10 pr-3.5 text-sm outline-none transition",
              "placeholder:text-text-faint focus:border-accent focus:shadow-[0_0_0_3px_rgba(86,101,214,0.36)]",
              error && "border-coral",
            )}
          />
        </div>
        {error && <div className="text-coral text-xs">{error}</div>}
        <EntryButton type="submit" className="mt-1">
          확인하고 입장
        </EntryButton>
      </div>
    </form>
  );
};
