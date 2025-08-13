import { UseFormRegisterReturn } from "react-hook-form";
import { Field, Input, Label } from "@headlessui/react";

type Props = {
  label: string;
  required?: boolean;
  topLabel?: boolean;
  autoFocus?: boolean;
  regiser?: UseFormRegisterReturn<any>;
  value?: string;
  onChange?: (password: string) => void;
};

export const InputBox = ({
  label,
  required = false,
  topLabel = true,
  autoFocus,
  regiser,
  value,
  onChange,
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
        <Input
          type="text"
          autoComplete="off"
          autoFocus={autoFocus}
          placeholder={label}
          required={required}
          className="bg-background border-1 w-full rounded-sm border-transparent bg-[#1e1f23] p-2 outline-none placeholder:text-sm focus-within:border-white/70"
          value={value}
          onChange={(event) => {
            onChange?.(event.target.value);
          }}
          {...regiser}
        />
        <div className="absolute right-4 top-3 cursor-pointer text-2xl text-gray-500"></div>
      </div>
    </Field>
  );
};
