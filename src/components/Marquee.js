"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Infinite ticker that speeds up with scroll velocity and follows scroll direction.
 */
export default function Marquee({ items, speed = 0.035, reverse = false, variant = "", label }) {
  const root = useRef(null);
  const track = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let x = 0;
    let boost = 0;
    let dir = reverse ? 1 : -1;
    const wrap = gsap.utils.wrap(-50, 0);
    let visible = true;

    const st = ScrollTrigger.create({
      trigger: root.current,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => (visible = self.isActive),
      onUpdate: (self) => {
        const v = self.getVelocity();
        boost = Math.min(Math.abs(v) / 250, 6);
        dir = (self.direction === 1 ? -1 : 1) * (reverse ? -1 : 1);
      },
    });

    const tick = (_, delta) => {
      if (!visible || !track.current) return;
      boost *= 0.93;
      x = wrap(x + dir * (speed + boost * speed) * (delta / 16.67));
      gsap.set(track.current, { xPercent: x });
    };
    gsap.ticker.add(tick);
    return () => {
      st.kill();
      gsap.ticker.remove(tick);
    };
  }, [speed, reverse]);

  const row = (hidden) => (
    <div className="marquee__group" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <span className="marquee__item" key={i}>
          <span>{item}</span>
          <svg className="marquee__sep" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M12 0v24M0 12h24M3.5 3.5l17 17M20.5 3.5l-17 17" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </span>
      ))}
    </div>
  );

  return (
    <div className={`marquee ${variant}`} ref={root} aria-label={label} role={label ? "region" : undefined}>
      <div className="marquee__track" ref={track}>
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
