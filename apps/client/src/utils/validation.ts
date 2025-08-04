import { z } from "zod";

export const FormSchema = z.object({
  name: z
    .string()
    .min(2, "최소 2글자 이상 입력해야 합니다.")
    .max(6, "최대 6글자까지 입력가능 합니다."),

  message: z.string().optional(),
});
