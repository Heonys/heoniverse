import { Field, Label, Textarea } from "@headlessui/react";
import { UseFormRegisterReturn } from "react-hook-form";

type Props = {
  label: string;
  required?: boolean;
  topLabel?: boolean;
  autoFocus?: boolean;
  regiser?: UseFormRegisterReturn<any>;
};

export const TextareaBox = ({
  label,
  required = false,
  topLabel = true,
  autoFocus,
  regiser,
}: Props) => {
  return (
    <Field className="mx-auto w-full">
      {topLabel && (
        <Label className="flex items-center gap-1 text-sm font-medium">
          {required && <div className="translate-y-0.5 text-orange-400">*</div>}
          <div className="text-white/70">{label}</div>
        </Label>
      )}
      <div className="relative mt-1">
        <Textarea
          autoComplete="off"
          autoFocus={autoFocus}
          placeholder={label}
          required={required}
          className="bg-background border-1 w-full resize-none rounded-sm border-transparent bg-[#1e1f23] p-2 text-sm outline-none placeholder:text-sm focus-within:border-white/70"
          {...regiser}
        />
      </div>
    </Field>
  );
};
