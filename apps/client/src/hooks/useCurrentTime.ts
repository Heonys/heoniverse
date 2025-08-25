import { useEffect, useState } from "react";

export const useCurrentTime = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return time;
};
