"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

// A soft follower ring that complements (never replaces) the native cursor.
export default function Cursor() {
  const ring = useRef(null);
  const [label, setLabel] = useState("");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(fine.matches && !reduced.matches);
    update();
    fine.addEventListener("change", update);
    reduced.addEventListener("change", update);
    return () => {
      fine.removeEventListener("change", update);
      reduced.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (!enabled || !ring.current) return;
    const el = ring.current;
    gsap.set(el, { xPercent: -50, yPercent: -50, opacity: 0 });
    const xTo = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" });
    let visible = false;

    const onMove = (e) => {
      if (!visible) {
        visible = true;
        gsap.set(el, { x: e.clientX, y: e.clientY });
        gsap.to(el, { opacity: 1, duration: 0.3 });
      }
      xTo(e.clientX);
      yTo(e.clientY);
    };

    let lastState = "";
    let lastLabel = "";
    const apply = (state, text) => {
      if (state === lastState && text === lastLabel) return; // nothing changed: no DOM write, no render
      lastState = state;
      lastLabel = text;
      el.dataset.state = state;
      setLabel(text);
    };
    const onOver = (e) => {
      const target = e.target.closest?.("[data-cursor], a, button, input, textarea, label");
      if (!target) return apply("", "");
      const custom = target.getAttribute("data-cursor");
      if (custom) apply("label", custom);
      else if (target.matches("input, textarea")) apply("text", "");
      else apply("link", "");
    };

    const onLeave = () => {
      visible = false;
      gsap.to(el, { opacity: 0, duration: 0.3 });
    };
    const onDown = () => el.classList.add("is-down");
    const onUp = () => el.classList.remove("is-down");

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver);
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="cursor" ref={ring} aria-hidden="true">
      <span className="cursor__label">{label}</span>
    </div>
  );
}
