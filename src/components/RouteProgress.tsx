import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

/**
 * Thin top-bar progress indicator that animates on every route change.
 * No external dependencies — pure React + CSS transitions.
 */
export function RouteProgress() {
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clear = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    // Start on route change
    clear();
    setProgress(0);
    setVisible(true);

    // Quickly jump to 20%, then crawl to ~85%
    let current = 20;
    setProgress(current);

    intervalRef.current = setInterval(() => {
      // Slow down as we approach 90%
      const increment = current < 50 ? 8 : current < 75 ? 4 : 1;
      current = Math.min(current + increment, 90);
      setProgress(current);
      if (current >= 90) clearInterval(intervalRef.current!);
    }, 200);

    // Complete after a short delay (page has rendered by then)
    timerRef.current = setTimeout(() => {
      clear();
      setProgress(100);
      // Hide bar after transition completes
      timerRef.current = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 400);
    }, 500);

    return clear;
  }, [location.pathname]);

  if (!visible) return null;

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
      className="fixed top-0 left-0 right-0 z-[9999] h-[3px] pointer-events-none"
    >
      <div
        className="h-full bg-primary transition-all ease-out shadow-[0_0_8px_rgba(var(--primary-rgb,59,130,246),0.6)]"
        style={{
          width: `${progress}%`,
          transitionDuration: progress === 100 ? "300ms" : "200ms",
        }}
      />
    </div>
  );
}
