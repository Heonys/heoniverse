import { useState } from "react";
import { createPortal } from "react-dom";
import { Condition } from "@/common";
import { VideoContainer } from "./VideoContainer";

export const WebcamView = () => {
  const [isShow, setIsShow] = useState(true);

  return (
    <Condition condition={isShow}>
      {createPortal(<VideoContainer />, document.getElementById("webcam-container")!)}
    </Condition>
  );
};
