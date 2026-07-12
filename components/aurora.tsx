"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

type Orientation = "horizontal" | "vertical";
type Direction = "forward" | "reverse";

interface ScanConfig {
  id: number;
  orientation: Orientation;
  direction: Direction;
  lineIndex: number;
  duration: number;
  length: "short" | "long";
}

interface GridLightSweepProps {
  /** Must match the pixel size of your existing blueprint grid cells. */
  gridSize?: number;
  /** Hard cap on simultaneous scans across the whole page. */
  maxConcurrentScans?: number;
}

let scanIdCounter = 0;

/**
 * GridLightSweep
 * ----------------
 * A single global instance (mounted once in layout.tsx) that renders
 * 0–2 thin illuminated "data pulses" traveling along random lines of
 * your site-wide blueprint grid, scoped to the full viewport.
 *
 * - `position: fixed` so it stays viewport-anchored regardless of
 *   page scroll or which section is currently in view.
 * - Grid line count is derived from actual viewport size (updated only
 *   on resize, not per-frame) so pulses always land on real grid lines
 *   no matter the page's height/width.
 * - All travel motion is pure CSS. The only JS is a `setTimeout` chain
 *   deciding when/where the next scan spawns — never a frame loop.
 * - Meant to sit at the very bottom of the stacking order for the
 *   entire app; see usage notes for z-index / background requirements.
 */

const GRID_LIGHT_SWEEP_STYLES = `
.grid-light-sweep {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  z-index: -1;
  pointer-events: none;
  contain: layout paint style;
}

.grid-scan {
  position: absolute;
  opacity: 0;
  will-change: background-position, opacity;
  background-image: linear-gradient(
    90deg,
    transparent 0%,
    transparent 38%,
    rgba(37, 99, 235, 0.35) 44%,
    rgba(96, 165, 250, 0.9) 49%,
    rgba(147, 197, 253, 1) 50%,
    rgba(96, 165, 250, 0.9) 51%,
    rgba(37, 99, 235, 0.35) 56%,
    transparent 62%,
    transparent 100%
  );
}

.grid-scan--horizontal {
  top: calc(var(--grid-size) * var(--line-index));
  left: 0;
  width: 100%;
  height: 2px;
  background-size: 340% 100%;
  background-position: -120% 0;
}

.grid-scan--vertical {
  left: calc(var(--grid-size) * var(--line-index));
  top: 0;
  width: 2px;
  height: 100%;
  background-image: linear-gradient(
    180deg,
    transparent 0%,
    transparent 38%,
    rgba(37, 99, 235, 0.35) 44%,
    rgba(96, 165, 250, 0.9) 49%,
    rgba(147, 197, 253, 1) 50%,
    rgba(96, 165, 250, 0.9) 51%,
    rgba(37, 99, 235, 0.35) 56%,
    transparent 62%,
    transparent 100%
  );
  background-size: 100% 340%;
  background-position: 0 -120%;
}

.grid-scan--horizontal.grid-scan--long { background-size: 240% 100%; }
.grid-scan--vertical.grid-scan--long { background-size: 100% 240%; }

.grid-scan--horizontal.grid-scan--forward { animation: sweep-h-forward var(--scan-duration) linear forwards; }
.grid-scan--horizontal.grid-scan--reverse { animation: sweep-h-reverse var(--scan-duration) linear forwards; }
.grid-scan--vertical.grid-scan--forward { animation: sweep-v-forward var(--scan-duration) linear forwards; }
.grid-scan--vertical.grid-scan--reverse { animation: sweep-v-reverse var(--scan-duration) linear forwards; }

@keyframes sweep-h-forward {
  0%   { opacity: 0; background-position: -120% 0; }
  12%  { opacity: 1; }
  80%  { opacity: 1; }
  100% { opacity: 0; background-position: 220% 0; }
}
@keyframes sweep-h-reverse {
  0%   { opacity: 0; background-position: 220% 0; }
  12%  { opacity: 1; }
  80%  { opacity: 1; }
  100% { opacity: 0; background-position: -120% 0; }
}
@keyframes sweep-v-forward {
  0%   { opacity: 0; background-position: 0 -120%; }
  12%  { opacity: 1; }
  80%  { opacity: 1; }
  100% { opacity: 0; background-position: 0 220%; }
}
@keyframes sweep-v-reverse {
  0%   { opacity: 0; background-position: 0 220%; }
  12%  { opacity: 1; }
  80%  { opacity: 1; }
  100% { opacity: 0; background-position: 0 -120%; }
}

@media (prefers-reduced-motion: reduce) {
  .grid-scan {
    animation: none !important;
    opacity: 0 !important;
  }
}
`;

const GridLightSweep: React.FC<GridLightSweepProps> = ({
  gridSize = 48,
  maxConcurrentScans = 2,
}) => {
  const [scans, setScans] = useState<ScanConfig[]>([]);
  const [gridDims, setGridDims] = useState({ cols: 30, rows: 16 });

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resizeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reducedMotionRef = useRef(false);
  const scanCountRef = useRef(0);

  // Recompute how many grid lines exist based on actual viewport size.
  // Only runs on mount + debounced resize — never per-frame.
  useEffect(() => {
    const updateDims = () => {
      setGridDims({
        cols: Math.ceil(window.innerWidth / gridSize) + 1,
        rows: Math.ceil(window.innerHeight / gridSize) + 1,
      });
    };

    updateDims();

    const handleResize = () => {
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
      resizeTimeoutRef.current = setTimeout(updateDims, 200);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
    };
  }, [gridSize]);

  const spawnScan = useCallback(() => {
    const orientation: Orientation = Math.random() < 0.5 ? "horizontal" : "vertical";
    const direction: Direction = Math.random() < 0.5 ? "forward" : "reverse";
    const lineIndex = Math.floor(
      Math.random() * (orientation === "horizontal" ? gridDims.rows : gridDims.cols)
    );
    const duration = 4 + Math.random() * 3.5; // 4s–7.5s
    const length: "short" | "long" = Math.random() < 0.5 ? "short" : "long";

    const config: ScanConfig = {
      id: ++scanIdCounter,
      orientation,
      direction,
      lineIndex,
      duration,
      length,
    };

    setScans((prev) => {
      if (prev.length >= maxConcurrentScans) return prev;
      return [...prev, config];
    });
  }, [gridDims, maxConcurrentScans]);

  const scheduleNext = useCallback(() => {
    if (reducedMotionRef.current) return;

    const pause = 3000 + Math.random() * 6500; // 3s–9.5s, independent each time
    timeoutRef.current = setTimeout(() => {
      if (scanCountRef.current < maxConcurrentScans) {
        spawnScan();
      }
      scheduleNext();
    }, pause);
  }, [spawnScan, maxConcurrentScans]);

  useEffect(() => {
    scanCountRef.current = scans.length;
  }, [scans.length]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = mediaQuery.matches;

    const handleChange = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches;
      if (e.matches && timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        setScans([]);
      } else if (!e.matches) {
        scheduleNext();
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    if (!reducedMotionRef.current) scheduleNext();

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAnimationEnd = (id: number) => {
    setScans((prev) => prev.filter((scan) => scan.id !== id));
  };

  return (
    <>
      <style>{GRID_LIGHT_SWEEP_STYLES}</style>
      <div
        className="grid-light-sweep"
        style={{ "--grid-size": `${gridSize}px` } as React.CSSProperties}
        aria-hidden="true"
      >
        {scans.map((scan) => (
          <div
            key={scan.id}
            className={[
              "grid-scan",
              `grid-scan--${scan.orientation}`,
              `grid-scan--${scan.direction}`,
              `grid-scan--${scan.length}`,
            ].join(" ")}
            style={
              {
                "--line-index": scan.lineIndex,
                "--scan-duration": `${scan.duration}s`,
              } as React.CSSProperties
            }
            onAnimationEnd={() => handleAnimationEnd(scan.id)}
          />
        ))}
      </div>
    </>
  );
};

export default GridLightSweep;