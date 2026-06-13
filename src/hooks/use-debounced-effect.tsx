import { useEffect, useRef } from "react";

/**
 * Runs `effect` after `delay` ms have elapsed since `deps` last changed.
 * Skips the very first run so it does not fire on mount, only on later changes.
 */
export const useDebouncedEffect = (
  effect: () => void,
  deps: unknown[],
  delay: number,
) => {
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    const timeout = setTimeout(effect, delay);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, delay]);
};
