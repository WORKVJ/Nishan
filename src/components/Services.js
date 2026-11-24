"use client";

import { useRef } from "react";
import { gsap, useGsap, canHover } from "@/lib/gsap";
import { services } from "@/data/content";
import { SectionLabel } from "./ui";
import SplitHeading from "./SplitHeading";
import Icon from "./Icon";

export default function Services() {
  const root = useRef(null);

  useGsap(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".scard", {
          y: 90,
          opacity: 0,
          rotateX: -10,
          transformPerspective: 1200,
          transformOrigin: "50% 0%",
          duration: 1.4,
          stagger: 0.1,
          ease: "expo.out",
          scrollTrigger: { trigger: ".services__grid", start: "top 82%" },
        });

        // Icons are drawn stroke by stroke, like a signal trace.
        gsap.utils.toArray(".scard").forEach((card, i) => {
          gsap.from(card.querySelectorAll(".scard__icon svg > *"), {
            drawSVG: "0%",
            duration: 1.6,
            stagger: 0.08,
            ease: "power2.inOut",
            delay: 0.35 + i * 0.1,
            scrollTrigger: { trigger: ".services__grid", start: "top 82%" },
          });
        });
      });

      if (!canHover()) return;
      // 3D tilt toward the pointer
      const cleanups = gsap.utils.toArray(".scard").map((card) => {
        const rx = gsap.quickTo(card, "rotationX", { duration: 0.6, ease: "power3.out" });
        const ry = gsap.quickTo(card, "rotationY", { duration: 0.6, ease: "power3.out" });
        const lift = gsap.quickTo(card, "y", { duration: 0.6, ease: "power3.out" });
        const move = (e) => {
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          gsap.set(card, { transformPerspective: 1000 });
          ry(px * 9);
          rx(-py * 9);
          lift(-6);
        };
        const leave = () => {
          rx(0);
          ry(0);
          lift(0);
        };
        card.addEventListener("pointermove", move);
        card.addEventListener("pointerleave", leave);
        return () => {
          card.removeEventListener("pointermove", move);
          card.removeEventListener("pointerleave", leave);
        };
      });
      return () => cleanups.forEach((c) => c());
    },
    [],
    root
  );

  // Light that follows the pointer across each card's border and surface.
  const onMove = (e) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <section id="services" className="services section" ref={root}>
      <div className="container">
        <header className="section-head">
          <SectionLabel index="06">Services</SectionLabel>
          <div className="section-head__row">
            <SplitHeading as="h2" className="section-title">
              Engineering <em className="serif accent">impactful</em> live sound
            </SplitHeading>
            <p className="section-head__sub">
              End-to-end audio capability for stadium tours, music festivals, broadcast productions and high-stakes live
              performances.
            </p>
          </div>
        </header>

        <ul className="services__grid">
          {services.map((s, i) => (
            <li className="scard" key={s.title} onPointerMove={onMove}>
              <div className="scard__glow" aria-hidden="true" />
              <div className="scard__top">
                <span className="scard__icon">
                  <Icon name={s.icon} size={26} strokeWidth={1.5} />
                </span>
                <span className="mono scard__num">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="scard__title">{s.title}</h3>
              <p className="scard__text">{s.text}</p>
              <ul className="scard__tags">
                {s.tags.map((t) => (
                  <li key={t} className="chip">
                    {t}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
