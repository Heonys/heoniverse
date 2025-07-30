import { useEffect, useState } from "react";

function getWindowSize() {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState(() => getWindowSize());

  useEffect(() => {
    function onResize() {
      setWindowSize(getWindowSize());
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return { innerWidth: windowSize.width, innerHeight: windowSize.height };
};
