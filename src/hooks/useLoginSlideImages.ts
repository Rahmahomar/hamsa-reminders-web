import { useEffect, useMemo, useState } from "react";

function wrapIndex(index: number, length: number): number {
  if (length <= 0) return 0;
  return (index + length) % length;
}

/** Load the active slide plus neighbors so swipe transitions stay smooth. */
export function useLoginSlideImages(activeIndex: number, slideCount: number) {
  const [loadedIndices, setLoadedIndices] = useState(() => new Set([0]));

  useEffect(() => {
    if (slideCount <= 0) return;

    setLoadedIndices((prev) => {
      const next = new Set(prev);
      next.add(activeIndex);
      next.add(wrapIndex(activeIndex - 1, slideCount));
      next.add(wrapIndex(activeIndex + 1, slideCount));
      return next;
    });
  }, [activeIndex, slideCount]);

  const shouldLoad = useMemo(
    () => (index: number) => loadedIndices.has(index),
    [loadedIndices]
  );

  return shouldLoad;
}

export function preloadLoginSlideImage(src: string): void {
  const img = new Image();
  img.src = src;
}
