import { forwardRef, PropsWithChildren } from "react";
import { motion } from "motion/react";
import { useModal } from "@/hooks";
import { AnimatePresence } from "motion/react";
import { AppIcon } from "@/icons";

type BackdropProps = {
  onClose?: () => void;
  disabled?: boolean;
} & PropsWithChildren;

export const Backdrop = forwardRef<HTMLDivElement, BackdropProps>(
  ({ onClose, disabled, children }, ref) => {
    const { modalState, hideModal } = useModal();

    const handleClick = () => {
      if (!disabled) {
        if (onClose) onClose();
        else hideModal();
      }
    };

    return (
      <AnimatePresence>
        {modalState.state === "open" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] top-0 left-0 right-0 bottom-0 flex flex-col items-center w-full h-screen justify-center bg-black/60 backdrop-blur-sm"
            onClick={handleClick}
          >
            <motion.div
              ref={ref}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              onClick={(e) => e.stopPropagation()}
              className=" w-full max-w-md rounded-xl bg-white/5 backdrop-blur-3xl p-6 border border-white/15"
            >
              <button className="absolute top-2 right-2 cursor-pointer" onClick={hideModal}>
                <AppIcon iconName="x-mark" color="white" size={20} />
              </button>
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  },
);
