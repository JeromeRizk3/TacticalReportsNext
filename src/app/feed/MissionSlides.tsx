"use client";

import React from "react";

type Slide = {
  headline: string;
  body: string;
};

const SLIDES: Slide[] = [
  {
    headline: "Strategic intelligence & analysis",
    body: "Tactical Report is a strategic intelligence and analysis platform delivering timely coverage on developments across Defense, Politics, and Energy sectors.",
  },
  {
    headline: "Fact-based reporting with context",
    body: "Our mission is to provide accurate, fact-based reporting supported by contextual analysis that helps decision-makers understand the broader geopolitical and economic landscape.",
  },
];

export function MissionSlides({ intervalMs = 5000 }: { intervalMs?: number }) {
  const [idx, setIdx] = React.useState(0);
  const [didMount, setDidMount] = React.useState(false);

  const goNext = React.useCallback(() => {
    setIdx((v) => (v + 1) % SLIDES.length);
  }, []);

  const goPrev = React.useCallback(() => {
    setIdx((v) => (v - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  React.useEffect(() => {
    if (SLIDES.length <= 1) return;
    const t = window.setInterval(() => {
      goNext();
    }, intervalMs);
    return () => window.clearInterval(t);
  }, [goNext, intervalMs]);

  React.useEffect(() => {
    // Trigger a one-time fade-in on first paint.
    const t = window.setTimeout(() => setDidMount(true), 0);
    return () => window.clearTimeout(t);
  }, []);

  const gradients = React.useMemo(
    () => [
      "var(--brand-grad-1)",
      "var(--brand-grad-2)",
    ],
    [],
  );

  return (
    <div className="heroSlider" style={{ backgroundImage: gradients[idx % gradients.length] }}>
      <div className="heroSlider__scrim" />

      <button
        type="button"
        className="heroSlider__arrow heroSlider__arrow--left"
        onClick={goPrev}
        aria-label="Previous slide"
      >
        ‹
      </button>
      <button
        type="button"
        className="heroSlider__arrow heroSlider__arrow--right"
        onClick={goNext}
        aria-label="Next slide"
      >
        ›
      </button>

      <div className={`heroSlider__content ${didMount ? "is-ready" : ""}`} aria-live="polite">
        <div className="heroSlider__eyebrow">Tactical Report</div>
        <div className="heroSlider__headline">{SLIDES[idx]?.headline}</div>
        <div className="heroSlider__body">{SLIDES[idx]?.body}</div>

        <div className="heroSlider__actions">
          <button type="button" className="heroSlider__cta">
            Discover Tactical Report
          </button>
        </div>

        <div className="heroSlider__dots" role="tablist" aria-label="About slides">
          {SLIDES.map((_, i) => {
            const active = i === idx;
            return (
              <button
                key={i}
                type="button"
                className={`heroSlider__dot ${active ? "is-active" : ""}`}
                onClick={() => setIdx(i)}
                aria-label={`Show slide ${i + 1}`}
                aria-current={active ? "true" : "false"}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

