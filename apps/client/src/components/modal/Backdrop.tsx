import { forwardRef, PropsWithChildren } from "react";
import { motion } from "motion/react";
import { useModal } from "@/hooks";
import { AnimatePresence } from "motion/react";
import { AppIcon } from "@/icons";
import { cn } from "@/utils";

type BackdropProps = {
  onClose?: () => void;
  className?: string;
} & PropsWithChildren;

export const Backdrop = forwardRef<HTMLDivElement, BackdropProps>(
  ({ onClose, className, children }, ref) => {
    const { modalState, hideModal } = useModal();

    const handleClick = () => {
      if (onClose) onClose();
      else hideModal();
    };

    return (
      <AnimatePresence>
        {modalState.state === "open" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bottom-0 left-0 right-0 top-0 z-[99999] flex h-screen w-full flex-col items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={handleClick}
          >
            <motion.div
              ref={ref}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "w-full max-w-md rounded-xl border border-white/15 bg-white/5 p-6 backdrop-blur-3xl",
                className,
              )}
            >
              <button className="absolute right-2 top-2 cursor-pointer" onClick={hideModal}>
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
