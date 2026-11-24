"use client";

import { useRef, useState } from "react";
import { gsap, useIsoLayoutEffect, prefersReducedMotion } from "@/lib/gsap";

const BAR_COUNT = 56;

export default function Preloader({ onComplete }) {
  const root = useRef(null);
  const countRef = useRef(null);
  const [done, setDone] = useState(false);

  useIsoLayoutEffect(() => {
    let alive = true;
    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      const bars = gsap.utils.toArray(".preloader__bar");
      const counter = { v: 0 };
      const render = () => {
        if (countRef.current) countRef.current.textContent = String(Math.round(counter.v)).padStart(3, "0");
      };

      gsap.from(".preloader__meta > *", { y: 16, opacity: 0, stagger: 0.08, duration: 0.9, ease: "expo.out" });
      gsap.from(".preloader__count-inner", { yPercent: 100, duration: 1, ease: "expo.out" });

      const meter = reduced
        ? null
        : gsap.to(bars, {
            scaleY: () => gsap.utils.random(0.12, 1),
            duration: 0.3,
            ease: "sine.inOut",
            stagger: { each: 0.01, from: "center", repeat: -1, yoyo: true, repeatRefresh: true },
          });

      const fill = gsap.to(counter, {
        v: 86,
        duration: reduced ? 0.2 : 1.7,
        ease: "power2.inOut",
        onUpdate: render,
      });

      const pageLoaded = new Promise((res) => {
        if (document.readyState === "complete") res();
        else window.addEventListener("load", res, { once: true });
      });
      const fontsLoaded = document.fonts ? document.fonts.ready : Promise.resolve();
      const minTime = new Promise((res) => setTimeout(res, reduced ? 150 : 1800));
      const maxTime = new Promise((res) => setTimeout(res, 4500));

      Promise.race([Promise.all([pageLoaded, fontsLoaded, minTime]), maxTime]).then(() => {
        if (!alive) return;
        ctx.add(() => {
          fill.kill();
          meter?.kill();
          const tl = gsap.timeline({ onComplete: () => setDone(true) });
          tl.to(counter, { v: 100, duration: 0.45, ease: "power2.out", onUpdate: render })
            .to(bars, { scaleY: 0.03, duration: 0.55, ease: "expo.inOut", stagger: { each: 0.004, from: "edges" } }, "<")
            .to(".preloader__count-inner", { yPercent: -110, duration: 0.7, ease: "expo.in" }, "+=0.05")
            .to(".preloader__meta > *", { y: -16, opacity: 0, stagger: 0.04, duration: 0.45, ease: "power2.in" }, "<")
            .to(".preloader__bars", { scaleX: 0, duration: 0.7, ease: "expo.inOut" }, "<")
            .add(() => onComplete?.())
            .to(".preloader__panel", { clipPath: "inset(0% 0% 100% 0%)", duration: 1.05, ease: "expo.inOut" })
            .to(".preloader__accent", { clipPath: "inset(0% 0% 100% 0%)", duration: 1.05, ease: "expo.inOut" }, "<0.12");
        });
      });
    }, root);

    return () => {
      alive = false;
      ctx.revert();
    };
  }, [onComplete]);

  if (done) return null;

  return (
    <div className="preloader" ref={root} role="status" aria-label="Loading">
      <div className="preloader__accent" />
      <div className="preloader__panel">
        <div className="preloader__meta preloader__meta--top">
          <span className="mono">Muhammad Nishan K N</span>
          <span className="mono">Line check — 1 · 2 · 1 · 2</span>
        </div>

        <div className="preloader__bars" aria-hidden="true">
          {Array.from({ length: BAR_COUNT }).map((_, i) => (
            <span className="preloader__bar" key={i} />
          ))}
        </div>

        <div className="preloader__bottom">
          <div className="preloader__meta">
            <span className="mono">Sound engineer</span>
            <span className="mono muted">FOH · Monitors · Systems</span>
          </div>
          <div className="preloader__count" aria-hidden="true">
            <span className="preloader__count-inner">
              <span ref={countRef}>000</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
