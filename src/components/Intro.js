"use client";

import { Fragment, useRef } from "react";
import Image from "next/image";
import { gsap, useGsap } from "@/lib/gsap";
import { stats } from "@/data/content";
import { SectionLabel } from "./ui";

const manifesto = [
  { t: "Sound is the invisible architecture of" },
  { t: "live emotion.", em: true },
  { t: "From stadium line arrays to intimate monitor mixes, I engineer" },
  { t: "precision, clarity", em: true },
  { t: "and visceral energy for every performance." },
];

const reelPanels = [
  {
    pos: "side",
    src: "/img/nishan_techcraft.jpeg",
    alt: "Muhammad Nishan behind a DiGiCo Quantum console in a festival tent",
    focus: "40% 50%",
  },
  {
    pos: "center",
    src: "/img/nishan_digico_arena.jpeg",
    alt: "Muhammad Nishan at a DiGiCo console in front of a lit concert stage",
    focus: "50% 40%",
  },
  {
    pos: "side",
    src: "/img/nishan_blooming_green.jpeg",
    alt: "Muhammad Nishan mixing outdoors at the Blooming Green festival",
    focus: "65% 50%",
  },
];

export default function Intro() {
  const root = useRef(null);

  useGsap(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Words light up as they cross the viewport, like a fader coming up.
        gsap.fromTo(
          ".manifesto .word",
          { opacity: 0.1, yPercent: 18 },
          {
            opacity: 1,
            yPercent: 0,
            ease: "none",
            stagger: 0.1,
            scrollTrigger: { trigger: ".manifesto", start: "top 80%", end: "bottom 45%", scrub: 0.6 },
          }
        );

        // Stat counters
        gsap.utils.toArray(".stat").forEach((el, i) => {
          const num = el.querySelector(".stat__num");
          const target = Number(num.dataset.value);
          const obj = { v: 0 };
          const tl = gsap.timeline({
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
            delay: i * 0.08,
          });
          tl.from(el.querySelector(".stat__rule"), { scaleX: 0, duration: 1.2, ease: "expo.inOut" })
            .from(el.querySelectorAll(".stat__num, .stat__label"), { y: 30, opacity: 0, stagger: 0.08, duration: 1 }, 0.2)
            .to(obj, {
              v: target,
              duration: 1.8,
              ease: "power3.out",
              onUpdate: () => (num.textContent = Math.round(obj.v)),
            }, 0.2);
        });

      });

      // Triptych: the centre frame opens up and the side frames rise into place.
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: ".reel", start: "top top", end: "+=110%", pin: true, scrub: 0.8, anticipatePin: 1 },
        });
        // Transform/opacity only — everything stays on the GPU while pinned.
        tl.fromTo(".reel__panel--center", { scale: 0.72 }, { scale: 1, duration: 1 })
          .fromTo(".reel__panel--center .reel__img", { scale: 1.45 }, { scale: 1.02, duration: 1 }, 0)
          .fromTo(
            ".reel__panel--side",
            {
              xPercent: (i) => (i === 0 ? 60 : -60),
              yPercent: (i) => (i === 0 ? 30 : -30),
              rotation: (i) => (i === 0 ? -8 : 8),
              opacity: 0,
              scale: 0.7,
            },
            { xPercent: 0, yPercent: 0, rotation: 0, opacity: 1, scale: 1, duration: 0.9 },
            0.1
          )
          .fromTo(".reel__panel--side .reel__img", { scale: 1.5 }, { scale: 1.05, duration: 1 }, 0)
          .fromTo(".reel__shade", { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.6)
          .fromTo(".reel__caption > *", { y: 60, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 0.4 }, 0.65);
      });

      mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".reel__panel",
          { scale: 0.86 },
          {
            scale: 1,
            ease: "none",
            stagger: 0.05,
            scrollTrigger: { trigger: ".reel", start: "top 95%", end: "top 15%", scrub: true },
          }
        );
        gsap.fromTo(
          ".reel__img",
          { scale: 1.3 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: ".reel", start: "top bottom", end: "bottom top", scrub: true },
          }
        );
        gsap.from(".reel__caption > *", {
          y: 50,
          opacity: 0,
          stagger: 0.1,
          duration: 1.2,
          scrollTrigger: { trigger: ".reel__caption", start: "top 90%" },
        });
      });
    },
    [],
    root
  );

  let wordIndex = 0;

  return (
    <section id="intro" className="intro" ref={root}>
      <div className="container">
        <SectionLabel index="01">Philosophy</SectionLabel>

        <p className="manifesto">
          {manifesto.map((seg, si) => {
            const words = seg.t.split(" ");
            const content = words.map((w, wi) => (
              <Fragment key={`${si}-${wi}-${wordIndex++}`}>
                <span className="word">{w}</span>
                {wi < words.length - 1 ? " " : ""}
              </Fragment>
            ));
            return (
              <span key={si} className={seg.em ? "serif accent manifesto__em" : undefined}>
                {content}{" "}
              </span>
            );
          })}
        </p>

        <ul className="stats">
          {stats.map((s) => (
            <li className="stat" key={s.label}>
              <span className="stat__rule" aria-hidden="true" />
              <p className="stat__value" aria-label={`${s.value}${s.suffix} ${s.label}`}>
                <span className="stat__num" data-value={s.value}>
                  {s.value}
                </span>
                <span className="stat__suffix accent">{s.suffix}</span>
              </p>
              <p className="stat__label mono">{s.label}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="reel">
        <div className="reel__stage">
          {reelPanels.map((p) => (
            <div className={`reel__panel reel__panel--${p.pos}`} key={p.src}>
              <div className="reel__img">
                <Image
                  src={p.src}
                  alt={p.alt}
                  fill
                  sizes="(max-width: 767px) 100vw, 34vw"
                  style={{ objectFit: "cover", objectPosition: p.focus }}
                />
              </div>
            </div>
          ))}
          <div className="reel__shade" aria-hidden="true" />
          <div className="reel__caption container">
            <p className="mono">Front of house · Live in concert</p>
            <h2 className="reel__title">
              Every seat, <em className="serif accent">every word</em> — heard exactly as intended.
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}
