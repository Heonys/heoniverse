import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppIcon } from "@/icons";
import { CreateFormSchema } from "@/utils";
import { EntryButton, ViewHead } from "../primitives";

type FormType = z.infer<typeof CreateFormSchema>;

type Props = {
  onBack: () => void;
  // pre-join: 여기서 방을 만들지 않고 폼 값만 보관한다 (실제 create()는 입장하기 시점)
  onSubmit: (data: FormType) => void;
};

const inputClass =
  "h-11 w-full rounded-[11px] border border-white/[0.07] bg-surface px-3.5 text-sm text-app-text outline-none transition placeholder:text-text-faint focus:border-accent focus:shadow-[0_0_0_3px_rgba(86,101,214,0.36)]";

export const CreateRoomView = ({ onBack, onSubmit }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(CreateFormSchema),
  });

  return (
    <form noValidate className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
      <ViewHead
        title="새 방 만들기"
        sub="이름·설명을 정하고, 원하면 비밀번호도 걸 수 있어요"
        onBack={onBack}
      />

      <div className="flex flex-col gap-[11px]">
        <div>
          <label className="text-text-dim mb-1.5 block text-xs font-semibold">
            방 이름 <span className="text-coral">*</span>
          </label>
          <input
            className={inputClass}
            placeholder="예: 감성 카페 (최대 20자)"
            maxLength={20}
            autoFocus
            {...register("name")}
          />
          {errors.name && <div className="text-coral mt-1 text-xs">{errors.name.message}</div>}
        </div>

        <div>
          <label className="text-text-dim mb-1.5 block text-xs font-semibold">
            방 설명 <span className="text-coral">*</span>
          </label>
          <input
            className={inputClass}
            placeholder="어떤 방인지 한 줄로 소개해요"
            {...register("description")}
          />
          {errors.description && (
            <div className="text-coral mt-1 text-xs">{errors.description.message}</div>
          )}
        </div>

        <div>
          <label className="text-text-dim mb-1.5 block text-xs font-semibold">
            비밀번호 <span className="text-text-faint font-medium">(선택)</span>
          </label>
          <div className="relative">
            <AppIcon
              iconName="lock"
              size={14}
              className="text-text-faint absolute left-3.5 top-1/2 -translate-y-1/2"
            />
            <input
              type="password"
              className={`${inputClass} pl-10`}
              placeholder="비워두면 비밀번호 없이 입장"
              {...register("password")}
            />
          </div>
        </div>

        <EntryButton type="submit" className="mt-1">
          만들기
        </EntryButton>
      </div>
    </form>
  );
};
