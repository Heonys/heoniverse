import { useAppDispatch } from "@/hooks";
import { AppButton, AppIcon } from "@/common";
import { closeWhiteboardDialog } from "@/stores/whiteboardSlice";

export const WhiteboardDialog = () => {
  const dispatch = useAppDispatch();

  return (
    <div className="fixed top-0 left-0 w-full h-full p-5 backdrop-blur-xs z-[9999]">
      <div className="relative bg-slate-900 w-full h-full rounded-2xl">
        <AppButton
          className="absolute top-0 right-0 bg-transparent"
          onClick={() => {
            dispatch(closeWhiteboardDialog());
          }}
        >
          <AppIcon iconName="x-mark" color="white" size={25} />
        </AppButton>
      </div>
    </div>
  );
};
