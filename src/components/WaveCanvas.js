"use client";

import { useEffect, useRef } from "react";

/**
 * Ambient multi-line sine field. Lines swell toward the pointer like a signal
 * passing through a meter. Pauses off-screen; renders a still frame for reduced motion.
 */
export default function WaveCanvas({ className = "", lines = 7 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let raf = 0;
    let running = false;
    let t = 0;
    const pointer = { x: 0.5, y: 0.5, energy: 0, targetEnergy: 0 };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const mid = h * 0.5;
      const step = Math.max(4, Math.round(w / 220));
      pointer.energy += (pointer.targetEnergy - pointer.energy) * 0.05;

      for (let i = 0; i < lines; i++) {
        const k = i / (lines - 1);
        const amp = h * (0.16 - k * 0.09);
        const freq = 0.0042 + k * 0.0026;
        const speed = 0.55 + k * 0.5;
        const phase = t * speed + i * 0.85;

        ctx.beginPath();
        for (let x = 0; x <= w + step; x += step) {
          const nx = x / w;
          const env = Math.sin(Math.PI * Math.min(1, Math.max(0, nx)));
          const dist = nx - pointer.x;
          const swell = 1 + pointer.energy * 1.6 * Math.exp(-(dist * dist) / 0.018);
          const y =
            mid +
            Math.sin(x * freq + phase) * amp * env * swell +
            Math.sin(x * freq * 2.3 - phase * 1.3) * amp * 0.25 * env;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        if (i === 0) {
          const g = ctx.createLinearGradient(0, 0, w, 0);
          g.addColorStop(0, "rgba(255,184,0,0)");
          g.addColorStop(0.5, "rgba(255,184,0,0.75)");
          g.addColorStop(1, "rgba(255,184,0,0)");
          ctx.strokeStyle = g;
          ctx.lineWidth = 1.4;
        } else {
          ctx.strokeStyle = `rgba(255,255,255,${0.11 - k * 0.07})`;
          ctx.lineWidth = 1;
        }
        ctx.stroke();
      }
    };

    const loop = () => {
      t += 0.012;
      draw();
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || reduced) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onPointer = (e) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = (e.clientX - rect.left) / rect.width;
      pointer.targetEnergy = e.clientY > rect.top && e.clientY < rect.bottom ? 1 : 0.2;
    };

    resize();
    draw();

    const ro = new ResizeObserver(() => {
      resize();
      draw();
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
    io.observe(canvas);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pointermove", onPointer, { passive: true });

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
    };
  }, [lines]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
