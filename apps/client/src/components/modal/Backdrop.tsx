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

    const handleClose = () => {
      if (onClose) onClose();
      hideModal();
    };

    return (
      <AnimatePresence>
        {modalState.state === "open" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bottom-0 left-0 right-0 top-0 z-[99999] flex h-screen w-full flex-col items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          >
            <motion.div
              ref={ref}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "from-panel-top to-panel-bot w-full max-w-md rounded-[20px] border border-white/10 bg-gradient-to-b p-6",
                "shadow-[0_30px_70px_-20px_rgba(10,20,40,0.75),inset_0_1px_0_rgba(255,255,255,0.06)]",
                className,
              )}
            >
              <button className="absolute right-2 top-2 cursor-pointer" onClick={handleClose}>
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
