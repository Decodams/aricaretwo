import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const SWIPE_THRESHOLD = 70;

export default function TestimonialCarousel({ items }) {
  const count = items.length;
  const extended = count > 1 ? [items[count - 1], ...items, items[0]] : items;
  const [position, setPosition] = useState(count > 1 ? 1 : 0);
  const [dragging, setDragging] = useState(false);
  const [delta, setDelta] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const startX = useRef(0);
  const viewportRef = useRef(null);

  const realIndex = count > 1 ? (position - 1 + count) % count : 0;

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener?.("change", update);
    return () => query.removeEventListener?.("change", update);
  }, []);

  const next = useCallback(() => setPosition((p) => p + 1), []);
  const prev = useCallback(() => setPosition((p) => p - 1), []);

  useEffect(() => {
    if (count < 2 || paused || reduced || dragging) return undefined;
    const timer = setInterval(next, 7000);
    return () => clearInterval(timer);
  }, [count, paused, reduced, dragging, next]);

  function jump(to) {
    setAnimate(false);
    setPosition(to);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => setAnimate(true)),
    );
  }

  function onTransitionEnd() {
    if (position === 0) jump(count);
    else if (position === count + 1) jump(1);
  }

  function onPointerDown(event) {
    if (count < 2) return;
    setDragging(true);
    setAnimate(false);
    setDelta(0);
    startX.current = event.clientX;
    try {
      viewportRef.current?.setPointerCapture?.(event.pointerId);
    } catch {
      // Synthetic or already-released pointer: swipe still works without capture.
    }
  }

  function onPointerMove(event) {
    if (!dragging) return;
    setDelta(event.clientX - startX.current);
  }

  function onPointerUp(event) {
    if (!dragging) return;
    const width = viewportRef.current?.clientWidth || 1;
    const limit = Math.min(SWIPE_THRESHOLD, width * 0.18);
    if (delta < -limit) next();
    else if (delta > limit) prev();
    setDragging(false);
    setDelta(0);
    setAnimate(true);
    try {
      viewportRef.current?.releasePointerCapture?.(event.pointerId);
    } catch {
      // Capture may already be gone.
    }
  }

  function onKeyDown(event) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      next();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      prev();
    }
  }

  const offset = `calc(-${position * 100}% + ${delta}px)`;

  return (
    <section
      className="testimonial-carousel"
      aria-label="What families say"
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={onKeyDown}
    >
      <div
        className="tc-viewport"
        ref={viewportRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div
          className="tc-track"
          style={{
            transform: `translate3d(${offset}, 0, 0)`,
            transition: animate && !reduced ? "transform .6s cubic-bezier(.22,.61,.36,1)" : "none",
          }}
          onTransitionEnd={onTransitionEnd}
        >
          {extended.map((item, index) => (
            <div
              className="tc-slide"
              key={index}
              aria-hidden={count > 1 && index !== position}
            >
              <figure className="tc-card">
                <span className="tc-quote-mark" aria-hidden="true">
                  “
                </span>
                <blockquote>{item.quote}</blockquote>
                <figcaption>
                  <strong>{item.firstName}</strong>
                  <span>
                    {item.relationship}
                    {item.program ? ` · ${item.program}` : ""}
                  </span>
                </figcaption>
              </figure>
            </div>
          ))}
        </div>
      </div>

      {count > 1 && (
        <div className="tc-controls">
          <button
            className="tc-arrow"
            type="button"
            onClick={prev}
            aria-label="Previous testimonial"
          >
            <ArrowLeft size={19} aria-hidden="true" />
          </button>
          <div className="tc-dots" role="tablist" aria-label="Choose a testimonial">
            {items.map((item, index) => (
              <button
                key={item.firstName + index}
                className={`tc-dot${index === realIndex ? " active" : ""}`}
                type="button"
                role="tab"
                aria-selected={index === realIndex}
                aria-label={`Testimonial ${index + 1} of ${count}: ${item.firstName}`}
                onClick={() => jump(index + 1)}
              />
            ))}
          </div>
          <span className="tc-count" aria-live="polite">
            {realIndex + 1} / {count}
          </span>
          <button
            className="tc-arrow"
            type="button"
            onClick={next}
            aria-label="Next testimonial"
          >
            <ArrowRight size={19} aria-hidden="true" />
          </button>
        </div>
      )}
    </section>
  );
}
