import { useState } from "react";
import { AppIcon } from "@/icons";
import { Input } from "@headlessui/react";

const PasswordBox = () => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="w-full mx-auto">
      <label htmlFor="pass" className="text-sm font-medium">
        Password
      </label>
      <div className="relative mt-1">
        <Input
          type={isVisible ? "text" : "password"}
          id="pass"
          placeholder="Password"
          className="bg-background w-full outline-none focus-within:border-white rounded-md p-2 border-2 border-white/20"
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

export default PasswordBox;
