import { Field, Label, Textarea } from "@headlessui/react";
import { UseFormRegisterReturn } from "react-hook-form";
import { z } from "zod";
import { FormSchema } from "@/utils";

type Props = {
  label: string;
  required?: boolean;
  topLabel?: boolean;
  autoFocus?: boolean;
  regiser?: UseFormRegisterReturn<keyof z.infer<typeof FormSchema>>;
};

export const TextareaBox = ({
  label,
  required = false,
  topLabel = true,
  autoFocus,
  regiser,
}: Props) => {
  return (
    <Field className="w-full mx-auto">
      {topLabel && (
        <Label className="text-sm font-medium flex items-center gap-1">
          {required && <div className="text-orange-400 translate-y-0.5">*</div>}
          <div>{label}</div>
        </Label>
      )}
      <div className="relative mt-1">
        <Textarea
          autoComplete="off"
          autoFocus={autoFocus}
          placeholder={label}
          required={required}
          className="bg-background resize-none w-full outline-none focus-within:border-white/70 placeholder:text-sm rounded-md p-2 border-2 border-white/25"
          {...regiser}
        />
        <div className="absolute top-3 right-4 text-2xl text-gray-500 cursor-pointer"></div>
      </div>
    </Field>
  );
};
