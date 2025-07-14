import { useAppDispatch } from "@/hooks";
import { AppButton, AppIcon } from "@/common";
import { closeComputerDialog } from "@/stores/computerSlice";

export const ComputerDialog = () => {
  const dispatch = useAppDispatch();

  return (
    <div className="fixed top-0 left-0 w-full h-full p-10 backdrop-blur-xs">
      <div className="relative bg-slate-900 w-full h-full rounded-2xl">
        <AppButton
          className="absolute top-0 right-0 p-3 cursor-pointer opacity-90 transition-transform hover:scale-110 hover:opacity-100"
          onClick={() => {
            dispatch(closeComputerDialog());
          }}
        >
          <AppIcon iconName="x-mark" color="white" size={25} />
        </AppButton>
      </div>
    </div>
  );
};
