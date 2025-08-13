import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AppIcon } from "@/icons";

export function Bootstrap() {
  const [hidden, setHidden] = useState(false);

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black text-white"
        >
          <AppIcon iconName="apple-logo" size={100} />
          <div className="mt-4 h-1 w-56 overflow-hidden rounded bg-neutral-700" role="progressbar">
            <motion.div
              className="h-full bg-white"
              initial={{ transform: "translateX(-100%)" }}
              animate={{ transform: "translateX(0%)" }}
              transition={{ duration: 1.25 }}
              onAnimationComplete={() => setHidden(true)}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
