import React, { useEffect, useRef } from "react";
import "./HexagonBackground.scss";

const HEX_RADIUS = 28;
const HOVER_RADIUS = 120;
const EASE = 0.5;

const FILL_COLOR = "#1e2c3d";
const STROKE_BASE_HEX = "#2e3f52";
const STROKE_HOVER_HEX = "#314254";

const hexToRgb = (hex: string): [number, number, number] => {
  const value = parseInt(hex.slice(1), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
};

const STROKE_BASE = hexToRgb(STROKE_BASE_HEX);
const STROKE_HOVER = hexToRgb(STROKE_HOVER_HEX);

// Idle ambient animation: when nobody has moved the mouse for a while,
// a soft diagonal highlight sweeps across the grid at random intervals.
const IDLE_TIMEOUT = 8000;
const SWEEP_MIN_GAP = 2500;
const SWEEP_MAX_GAP = 5000;
const SWEEP_MIN_DURATION = 4500;
const SWEEP_MAX_DURATION = 7000;
const MAX_CONCURRENT_SWEEPS = 3;
const SWEEP_DIRECTIONS = [
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
];

const lerpColor = (
  from: [number, number, number],
  to: [number, number, number],
  t: number
) =>
  `${from[0] + (to[0] - from[0]) * t}, ${from[1] + (to[1] - from[1]) * t}, ${
    from[2] + (to[2] - from[2]) * t
  }`;

const createSweep = (time: number): Sweep => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const diagonal = Math.sqrt(w * w + h * h);

  const [dx, dy] = SWEEP_DIRECTIONS[
    Math.floor(Math.random() * SWEEP_DIRECTIONS.length)
  ];
  const dirX = dx / Math.SQRT2;
  const dirY = dy / Math.SQRT2;
  const perpX = -dirY;
  const perpY = dirX;

  const offset = (Math.random() - 0.5) * diagonal * 0.7;
  const centerX = w / 2 + perpX * offset;
  const centerY = h / 2 + perpY * offset;
  const half = diagonal / 2 + 100;

  return {
    start: { x: centerX - dirX * half, y: centerY - dirY * half },
    end: { x: centerX + dirX * half, y: centerY + dirY * half },
    startTime: time,
    duration: SWEEP_MIN_DURATION + Math.random() * (SWEEP_MAX_DURATION - SWEEP_MIN_DURATION),
  };
};

const HexagonBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const hexWidth = HEX_RADIUS * 2;
    const hexHeight = Math.sqrt(3) * HEX_RADIUS;
    const horizDist = hexWidth * 0.75;
    const vertDist = hexHeight;

    let hexagons: Hexagon[] = [];
    let mouse: Point | null = null;
    let lastInteraction = 0;
    let nextSweepAt = IDLE_TIMEOUT;
    let sweeps: Sweep[] = [];
    let autoPoints: Point[] = [];
    let rafId = 0;
    let resizeTimer: ReturnType<typeof setTimeout>;

    const buildGrid = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cols = Math.ceil(w / horizDist) + 2;
      const rows = Math.ceil(h / vertDist) + 2;
      const next: Hexagon[] = [];

      for (let col = -1; col <= cols; col++) {
        const x = col * horizDist;
        const yOffset = Math.abs(col % 2) === 1 ? vertDist / 2 : 0;
        for (let row = -1; row <= rows; row++) {
          next.push({
            baseX: x,
            baseY: row * vertDist + yOffset,
            glow: 0,
            targetGlow: 0,
          });
        }
      }
      hexagons = next;
    };

    const drawHexagon = (cx: number, cy: number, size: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 180) * (60 * i);
        const px = cx + size * Math.cos(angle);
        const py = cy + size * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
    };

    const proximityTo = (hex: Hexagon, point: Point) => {
      const dx = hex.baseX - point.x;
      const dy = hex.baseY - point.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      return Math.max(0, 1 - dist / HOVER_RADIUS);
    };

    const updateAutoSweep = (time: number) => {
      sweeps = sweeps.filter(
        (s) => (time - s.startTime) / s.duration < 1
      );
      autoPoints = sweeps.map((s) => {
        const f = (time - s.startTime) / s.duration;
        return {
          x: s.start.x + (s.end.x - s.start.x) * f,
          y: s.start.y + (s.end.y - s.start.y) * f,
        };
      });

      const idle = time - lastInteraction >= IDLE_TIMEOUT;
      if (idle && time >= nextSweepAt && sweeps.length < MAX_CONCURRENT_SWEEPS) {
        sweeps.push(createSweep(time));
        nextSweepAt = time + SWEEP_MIN_GAP + Math.random() * (SWEEP_MAX_GAP - SWEEP_MIN_GAP);
      }
    };

    const draw = (time: number) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      updateAutoSweep(time);

      hexagons.forEach((hex) => {
        const proximity = Math.max(
          mouse ? proximityTo(hex, mouse) : 0,
          ...autoPoints.map((p) => proximityTo(hex, p))
        );
        hex.targetGlow = proximity;
        hex.glow += (hex.targetGlow - hex.glow) * EASE;
      });

      ctx.fillStyle = FILL_COLOR;
      ctx.lineWidth = 1;

      hexagons.forEach((hex) => {
        const strokeAlpha = 0.2 + hex.glow * 0.35;

        drawHexagon(hex.baseX, hex.baseY, HEX_RADIUS);
        ctx.strokeStyle = `rgba(${lerpColor(
          STROKE_BASE,
          STROKE_HOVER,
          hex.glow
        )}, ${strokeAlpha})`;
        ctx.fill();
        ctx.stroke();
      });
    };

    const loop = (time: number) => {
      draw(time);
      rafId = requestAnimationFrame(loop);
    };

    buildGrid();

    if (prefersReducedMotion) {
      draw(0);
    } else {
      rafId = requestAnimationFrame(loop);
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouse = { x: e.clientX, y: e.clientY };
      lastInteraction = performance.now();
      nextSweepAt = lastInteraction + IDLE_TIMEOUT;
      sweeps = [];
      autoPoints = [];
    };
    const handleMouseLeave = () => {
      mouse = null;
    };
    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) {
        mouse = { x: touch.clientX, y: touch.clientY };
        lastInteraction = performance.now();
        nextSweepAt = lastInteraction + IDLE_TIMEOUT;
        sweeps = [];
        autoPoints = [];
      }
    };
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(buildGrid, 150);
    };

    if (!prefersReducedMotion) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseleave", handleMouseLeave);
      window.addEventListener("touchmove", handleTouchMove, { passive: true });
      window.addEventListener("touchend", handleMouseLeave);
    }
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(resizeTimer);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="hexagon-background" aria-hidden="true" />
  );
};

export default HexagonBackground;
