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
    <div className="w-full mx-auto">
      <label htmlFor="pass" className="text-sm font-medium">
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
          className="bg-background w-full outline-none focus-within:border-white placeholder:text-sm rounded-md p-2 border-2 border-white/20"
          value={value}
          onChange={(event) => {
            onChange?.(event.target.value);
          }}
          {...regiser}
        />
        <div
          className="absolute top-3 right-4 text-2xl text-gray-500 cursor-pointer"
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
