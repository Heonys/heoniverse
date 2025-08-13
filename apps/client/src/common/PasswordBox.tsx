import { useState } from "react";
import { Input } from "@headlessui/react";
import { UseFormRegisterReturn } from "react-hook-form";
import { AppIcon } from "@/icons";

type Props = {
  required?: boolean;
  regiser?: UseFormRegisterReturn<any>;
  autoFocus?: boolean;
  value?: string;
  onChange?: (password: string) => void;
};

export const PasswordBox = ({ required, autoFocus, regiser, value, onChange }: Props) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="mx-auto w-full">
      <label htmlFor="pass" className="text-sm font-medium text-white/70">
        Password
      </label>
      <div className="relative mt-1">
        <Input
          type={isVisible ? "text" : "password"}
          autoComplete="off"
          id="pass"
          autoFocus={autoFocus}
          required={required}
          placeholder="Password"
          className="bg-background border-1 w-full rounded-sm border-transparent bg-[#1e1f23] p-2 outline-none placeholder:text-sm focus-within:border-white"
          value={value}
          onChange={(event) => {
            onChange?.(event.target.value);
          }}
          {...regiser}
        />
        <div
          className="absolute right-4 top-3 cursor-pointer text-2xl text-gray-500"
          onClick={() => setIsVisible((prev) => !prev)}
        >
          {isVisible ? (
            <AppIcon iconName="eye" size={20} />
          ) : (
            <AppIcon iconName="eye-off" size={20} />
          )}
        </div>
      </div>
    </div>
  );
};
