import { useEffect, useRef } from "react";

interface UseTimerProps {
  onClose: () => void;
}

function useTimer({ onClose }: UseTimerProps) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      onClose();
    }, 1000);
  };

  const stopTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, []);

  return { startTimer, stopTimer };
}

export default useTimer;
