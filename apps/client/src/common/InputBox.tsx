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
    <Field className="w-full mx-auto">
      {topLabel && (
        <Label className="text-sm font-medium flex items-center gap-1">
          {required && <div className="text-orange-400 translate-y-0.5">*</div>}
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
          className="bg-background w-full outline-none bg-[#1e1f23] focus-within:border-white/70 placeholder:text-sm rounded-sm p-2 border-1 border-transparent"
          value={value}
          onChange={(event) => {
            onChange?.(event.target.value);
          }}
          {...regiser}
        />
        <div className="absolute top-3 right-4 text-2xl text-gray-500 cursor-pointer"></div>
      </div>
    </Field>
  );
};
