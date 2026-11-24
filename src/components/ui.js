"use client";

import { useEffect, useRef } from "react";
import { gsap, useGsap, prefersReducedMotion } from "@/lib/gsap";
import Icon from "./Icon";

/** Gently pulls an element toward the pointer on fine-pointer devices. */
export function useMagnetic(strength = 0.35) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mq = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    if (!mq.matches) return;
    const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1, 0.45)" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1, 0.45)" });
    const move = (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => {
      xTo(0);
      yTo(0);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [strength]);
  return ref;
}

/** Text that rolls to a duplicate of itself on hover. */
export function RollText({ children }) {
  return (
    <span className="roll" data-text={children}>
      <span className="roll__inner">{children}</span>
    </span>
  );
}

/** Pill button with rolling label, optional trailing icon and magnetic pull. */
export function Button({
  as = "a",
  variant = "primary",
  icon = "arrowUpRight",
  children,
  className = "",
  magnetic = true,
  ...props
}) {
  const ref = useMagnetic(0.25);
  const Tag = as;
  return (
    <span className="magnetic" ref={magnetic ? ref : undefined}>
      <Tag className={`btn btn--${variant} ${className}`} {...props}>
        <RollText>{children}</RollText>
        {icon && (
          <span className="btn__icon">
            <Icon name={icon} size={16} strokeWidth={2} />
          </span>
        )}
      </Tag>
    </span>
  );
}

/** Small mono section label, e.g. "(02) — Work". Decodes like a console readout on enter. */
export function SectionLabel({ index, children, className = "" }) {
  const ref = useRef(null);
  useGsap(
    () => {
      if (prefersReducedMotion() || !ref.current) return;
      const text = ref.current.querySelector(".section-label__text");
      const final = text.textContent;
      gsap
        .timeline({ scrollTrigger: { trigger: ref.current, start: "top 92%", once: true } })
        .from(".section-label__rule", { scaleX: 0, transformOrigin: "0% 50%", duration: 1.1, ease: "expo.inOut" })
        .from(".section-label__index", { opacity: 0, x: -12, duration: 0.7, ease: "expo.out" }, 0)
        .to(
          text,
          {
            scrambleText: { text: final, chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/#_", speed: 0.6, revealDelay: 0.15 },
            duration: 1.2,
            ease: "none",
          },
          0.15
        );
    },
    [],
    ref
  );
  return (
    <p className={`section-label mono ${className}`} ref={ref}>
      <span className="section-label__index">({index})</span>
      <span className="section-label__rule" aria-hidden="true" />
      <span className="section-label__text">{children}</span>
    </p>
  );
}
