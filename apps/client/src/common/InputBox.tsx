import { Input } from "@headlessui/react";

type Props = {
  label: string;
  required?: boolean;
};

export const InputBox = ({ label, required = false }: Props) => {
  return (
    <div className="w-full mx-auto">
      <label htmlFor="pass" className="text-sm font-medium flex items-center gap-1">
        {required && <div className="text-orange-400 translate-y-0.5">*</div>}
        <div>{label}</div>
      </label>
      <div className="relative mt-1">
        <Input
          type="text"
          id="pass"
          placeholder={label}
          required={required}
          className="bg-background w-full outline-none focus-within:border-white rounded-md p-2 border-2 border-white/20"
        />
        <div className="absolute top-3 right-4 text-2xl text-gray-500 cursor-pointer"></div>
      </div>
    </div>
  );
};
