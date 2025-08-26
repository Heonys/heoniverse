import { useEffect, useState } from "react";

export const useCurrentTime = (tick: number = 5000) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, tick);
    return () => clearInterval(interval);
  }, [tick]);

  return time;
};
