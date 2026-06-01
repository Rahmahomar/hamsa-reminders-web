import { useCallback, useEffect, useRef, useState } from "react";

import {
  LOGIN_SHOWCASE_AUTOPLAY_MS,
  LOGIN_SHOWCASE_SLIDES,
  LOGIN_SHOWCASE_SWIPE_THRESHOLD,
} from "../constants/login-showcase-slides";
import {
  preloadLoginSlideImage,
  useLoginSlideImages,
} from "../hooks/useLoginSlideImages";
import { LoginShowcaseSlideImage } from "./LoginShowcaseSlideImage";
import { ThemeToggle } from "./ThemeToggle";

export function LoginShowcase() {
  const slides = LOGIN_SHOWCASE_SLIDES;
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideWidth, setSlideWidth] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const shouldLoadSlideImage = useLoginSlideImages(activeIndex, slides.length);

  const activeIndexRef = useRef(0);
  const pausedRef = useRef(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const dragStartXRef = useRef<number | null>(null);
  const dragDeltaRef = useRef(0);

  activeIndexRef.current = activeIndex;

  const goToSlide = useCallback(
    (index: number) => {
      if (index < 0 || index >= slides.length) return;
      if (index === activeIndexRef.current) return;
      setActiveIndex(index);
    },
    [slides.length]
  );

  const goNext = useCallback(() => {
    goToSlide((activeIndexRef.current + 1) % slides.length);
  }, [goToSlide, slides.length]);

  const goPrev = useCallback(() => {
    goToSlide((activeIndexRef.current - 1 + slides.length) % slides.length);
  }, [goToSlide, slides.length]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const updateWidth = () => setSlideWidth(viewport.offsetWidth);
    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const next = slides[(activeIndex + 1) % slides.length];
    if (next) preloadLoginSlideImage(next.imageSrc);
  }, [activeIndex, slides]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (!pausedRef.current && !isDragging) {
        goNext();
      }
    }, LOGIN_SHOWCASE_AUTOPLAY_MS);

    return () => window.clearInterval(timer);
  }, [goNext, isDragging]);

  const finishDrag = useCallback(() => {
    const delta = dragDeltaRef.current;
    dragStartXRef.current = null;
    dragDeltaRef.current = 0;
    setIsDragging(false);
    setDragOffset(0);

    if (Math.abs(delta) >= LOGIN_SHOWCASE_SWIPE_THRESHOLD) {
      if (delta < 0) {
        goNext();
      } else {
        goPrev();
      }
    }
  }, [goNext, goPrev]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    dragStartXRef.current = event.clientX;
    dragDeltaRef.current = 0;
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartXRef.current === null) return;
    const delta = event.clientX - dragStartXRef.current;
    dragDeltaRef.current = delta;
    setDragOffset(delta);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartXRef.current === null) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    finishDrag();
  };

  const handlePointerCancel = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartXRef.current === null) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    finishDrag();
  };

  const trackOffset = slideWidth > 0 ? -activeIndex * slideWidth + dragOffset : 0;

  return (
    <aside
      className="login-showcase"
      aria-label="Product preview"
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
    >
      <div className="login-showcase__backdrop" />

      <div className="login-showcase__theme">
        <ThemeToggle className="theme-toggle--compact" />
      </div>

      {slides.length > 1 ? (
        <div className="login-showcase__dots" role="tablist" aria-label="Preview slides">
          {slides.map((item, index) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`Go to slide ${index + 1}`}
              className={`login-showcase__dot${index === activeIndex ? " login-showcase__dot--active" : ""}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      ) : null}

      <div
        ref={viewportRef}
        className={`login-showcase__viewport${isDragging ? " login-showcase__viewport--dragging" : ""}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        <div
          className={`login-showcase__track${isDragging ? " login-showcase__track--dragging" : ""}`}
          style={{ transform: `translate3d(${trackOffset}px, 0, 0)` }}
        >
          {slides.map((item, index) => (
            <article
              className="login-showcase__slide"
              key={item.id}
              aria-hidden={index !== activeIndex}
            >
              <div className="login-showcase__copy">
                <h2 className="login-showcase__title">{item.title}</h2>
                <p className="login-showcase__desc">{item.description}</p>
              </div>

              <div className="login-showcase__mockup-wrap">
                <div className="login-showcase__mockup-outer">
                  <div className="login-showcase__mockup-inner">
                    <div className="login-showcase__mockup-screen">
                      <LoginShowcaseSlideImage
                        src={item.imageSrc}
                        isActive={index === activeIndex}
                        shouldLoad={shouldLoadSlideImage(index)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </aside>
  );
}
