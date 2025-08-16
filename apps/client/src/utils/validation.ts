import { z } from "zod";

export const FormSchema = z.object({
  name: z
    .string()
    .min(2, "최소 2글자 이상 입력해야 합니다.")
    .max(5, "최대 5글자까지 입력가능 합니다."),

  message: z.string().optional(),
});

export const CreateFormSchema = z.object({
  name: z
    .string() //
    .min(1, "방 이름을 입력해주세요.")
    .max(20, "최대 20글자까지 입력가능 합니다."),
  description: z.string().min(1, "방 설명을 입력해주세요."),
  password: z
    .string()
    .transform((v) => (v === "" ? undefined : v))
    .optional(),
});
