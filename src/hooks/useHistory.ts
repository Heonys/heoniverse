import { Shapes } from "@/constants/drawing";
import { useState } from "react";

export const useHistory = () => {
  const [index, setIndex] = useState(0);
  const [history, setHistory] = useState<Shapes[][]>([[]]);

  const setShapes = (
    state: Shapes[] | ((state: Shapes[]) => Shapes[]), //
    overwrite = false,
  ) => {
    const newState = typeof state === "function" ? state(history[index]) : state;
    if (overwrite) {
      const copied = [...history];
      copied[index] = newState;
      setHistory(copied);
    } else {
      const updatedState = [...history].slice(0, index + 1);
      setHistory([...updatedState, newState]);
      setIndex((prevState) => prevState + 1);
    }
  };

  const undo = () => {
    if (index > 0) setIndex((prev) => prev - 1);
  };

  const redo = () => {
    if (index < history.length - 1) setIndex((prev) => prev + 1);
  };

  return {
    shapes: history[index],
    setShapes,
    undo,
    redo,
  };
};
