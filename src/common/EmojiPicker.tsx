import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useEffect, useRef, useState } from "react";
import { AppIcon, IconButton } from "@/common";

type Props = {
  onSelect: (emoji: any) => void;
};

export const EmojiPicker = ({ onSelect }: Props) => {
  const [showEmoji, setShowEmoji] = useState(false);
  const pickerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowEmoji(false);
      }
    };

    if (showEmoji) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmoji]);

  return (
    <div className="relative flex items-center">
      <div className="absolute bottom-full mb-2 z-10" ref={pickerRef}>
        {showEmoji && (
          <Picker
            data={data}
            theme="dark"
            previewPosition="none"
            skinTonePosition="none"
            onEmojiSelect={(emoji: any) => {
              setShowEmoji(false);
              onSelect(emoji);
            }}
          />
        )}
      </div>
      <IconButton onClick={() => setShowEmoji(true)}>
        <AppIcon iconName="smile" color="white" size={24} />
      </IconButton>
    </div>
  );
};
