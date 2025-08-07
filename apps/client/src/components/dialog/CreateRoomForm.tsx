import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppButton, InputBox, TextareaBox, PasswordBox } from "@/common";
import { AppIcon } from "@/icons";
import { CreateFormSchema } from "@/utils";
import { useGame } from "@/hooks";

type Props = {
  onPrevious: () => void;
};

type FormType = z.infer<typeof CreateFormSchema>;

export const CreateRoomForm = ({ onPrevious }: Props) => {
  const { preloaderScene } = useGame();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(CreateFormSchema),
  });

  const onSubmit = (formdata: FormType) => {
    preloaderScene.network.createCustomRoom({ ...formdata, autoDispose: true }).then(() => {
      preloaderScene.launchGame();
    });
  };

  return (
    <form noValidate className="p-8 pb-5 flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
      <div
        className="absolute left-2 top-2 p-1 pr-3 flex items-center gap-2 rounded-md hover:bg-white/10 transition-colors duration-150 cursor-pointer"
        onClick={onPrevious}
      >
        <AppIcon iconName="chevron-left" size={18} />
        <div className="text-xs font-medium">커스텀 방 목록</div>
      </div>

      <div className="flex justify-center items-center gap-2">
        <AppIcon iconName="create" size={23} className="translate-y-0.5" />
        <div className="text-2xl font-bold leading-none tracking-tight">Create Room</div>
      </div>

      <div className="text-sm text-[#c2c2c2] flex justify-center items-center">
        새로운 커스텀 방을 생성합니다 비밀번호를 설정할 수 있습니다.
      </div>

      <div className="p-2 px-6 flex flex-col gap-1 w-[400px]">
        <InputBox label="Name" regiser={register("name")} required autoFocus />
        <div className="text-xs text-red-400 ml-1">{errors.name?.message}</div>

        <TextareaBox label="Description" regiser={register("description")} required />
        <div className="text-xs text-red-400 ml-1">{errors.description?.message}</div>

        <PasswordBox regiser={register("password")} />
      </div>
      <div className="flex justify-center items-center">
        <AppButton type="submit" className="px-4">
          생성
        </AppButton>
      </div>
    </form>
  );
};
