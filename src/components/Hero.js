"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, SplitText, useIsoLayoutEffect, canHover } from "@/lib/gsap";
import { contact } from "@/data/content";
import { useShell } from "./AppShell";
import { Button } from "./ui";
import WaveCanvas from "./WaveCanvas";

const METER_BARS = 28;

export default function Hero() {
  const { ready, scrollTo } = useShell();
  const root = useRef(null);

  // Hidden starting state, applied before first paint (the preloader covers it).
  useIsoLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(".hero__title .line__inner", { yPercent: 115, rotate: 3 });
      gsap.set("[data-hero-fade]", { y: 28, opacity: 0 });
      gsap.set(".hero__frame", { clipPath: "inset(100% 0% 0% 0% round 28px)" });
      gsap.set(".hero__img", { scale: 1.35 });
      gsap.set(".hero__bg", { opacity: 0 });
    }, root);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!ready) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.to(".hero__frame", { clipPath: "inset(0% 0% 0% 0% round 28px)", duration: 1.7, ease: "expo.inOut" }, 0.1)
        .to(".hero__img", { scale: 1, duration: 2.2, ease: "expo.out" }, 0.4)
        .to(".hero__title .line__inner", { yPercent: 0, rotate: 0, duration: 1.5, stagger: 0.11 }, 0.35)
        .to("[data-hero-fade]", { y: 0, opacity: 1, duration: 1.2, stagger: 0.07 }, 0.85)
        .to(".hero__bg", { opacity: 1, duration: 2, ease: "power2.out" }, 0.6)
        .to(
          ".hero__kicker-text",
          {
            scrambleText: { text: "{original}", chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", speed: 0.7, revealDelay: 0.2 },
            duration: 1.4,
            ease: "none",
          },
          0.8
        );

      // Scroll-out depth: copy drifts up faster than the photo.
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const st = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
        gsap.to(".hero__copy", { yPercent: -18, opacity: 0.2, ease: "none", scrollTrigger: st });
        gsap.to(".hero__media", { yPercent: 10, ease: "none", scrollTrigger: st });
        gsap.to(".hero__img-wrap", { scale: 1.12, ease: "none", scrollTrigger: st });
        gsap.to(".hero__waves", { opacity: 0, yPercent: 30, ease: "none", scrollTrigger: st });
        // Headline lines drift apart as the hero leaves.
        gsap.to(".hero__title .line:nth-child(2)", { xPercent: -8, ease: "none", scrollTrigger: st });
        gsap.to(".hero__title .line:nth-child(3)", { xPercent: 10, ease: "none", scrollTrigger: st });
        gsap.to(".hero__title .line:nth-child(4)", { xPercent: -6, ease: "none", scrollTrigger: st });
      });

      if (!canHover()) return;

      // 3D tilt: the photo card leans toward the pointer; HUD and tag float above it.
      const frame = root.current.querySelector(".hero__frame");
      const media = root.current.querySelector(".hero__media");
      gsap.set(frame, { transformPerspective: 1100 });
      const rx = gsap.quickTo(frame, "rotationX", { duration: 0.8, ease: "power3.out" });
      const ry = gsap.quickTo(frame, "rotationY", { duration: 0.8, ease: "power3.out" });
      const hudX = gsap.quickTo([".hero__hud", ".hero__tag"], "x", { duration: 0.8, ease: "power3.out" });
      const hudY = gsap.quickTo([".hero__hud", ".hero__tag"], "y", { duration: 0.8, ease: "power3.out" });

      // Variable-weight headline: letters near the pointer get heavier.
      const split = SplitText.create(".hero__sans", { type: "chars", charsClass: "hero__char" });
      const chars = split.chars;
      const weightTo = chars.map((c) => gsap.quickTo(c, "--w", { duration: 0.5, ease: "power3.out" }));
      let centers = [];
      const measure = () => {
        centers = chars.map((c) => {
          const r = c.getBoundingClientRect();
          return [r.left + r.width / 2, r.top + r.height / 2 + window.scrollY];
        });
      };
      // Positions are (re)measured lazily: after the intro settles, on resize and on re-entry.
      let dirty = true;
      const invalidate = () => (dirty = true);
      tl.eventCallback("onComplete", invalidate);
      window.addEventListener("resize", invalidate);
      root.current.addEventListener("pointerenter", invalidate);

      const onMove = (e) => {
        const r = media.getBoundingClientRect();
        const nx = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
        const ny = (e.clientY - (r.top + r.height / 2)) / window.innerHeight;
        ry(gsap.utils.clamp(-10, 10, nx * 18));
        rx(gsap.utils.clamp(-10, 10, -ny * 18));
        hudX(nx * 22);
        hudY(ny * 22);

        if (dirty && !tl.isActive()) {
          measure();
          dirty = false;
        }
        const py = e.clientY + window.scrollY;
        centers.forEach(([cx, cy], i) => {
          const d = Math.hypot(e.clientX - cx, py - cy);
          const f = Math.max(0, 1 - d / 260);
          weightTo[i](500 + f * f * 360);
        });
      };
      const onLeave = () => {
        rx(0);
        ry(0);
        hudX(0);
        hudY(0);
        weightTo.forEach((w) => w(500));
      };
      root.current.addEventListener("pointermove", onMove);
      root.current.addEventListener("pointerleave", onLeave);
      const el = root.current;
      return () => {
        window.removeEventListener("resize", invalidate);
        el.removeEventListener("pointerenter", invalidate);
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
      };
    }, root);
    return () => ctx.revert();
  }, [ready]);

  return (
    <section id="top" className="hero" ref={root}>
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__glow" />
        <div className="hero__grid-lines" />
        <WaveCanvas className="hero__waves" />
      </div>

      <div className="container hero__inner">
        <div className="hero__copy">
          <p className="hero__kicker mono" data-hero-fade>
            <span className="status__dot" aria-hidden="true" />
            <span className="hero__kicker-text">Muhammad Nishan K N — Sound Engineer</span>
          </p>

          <h1 className="hero__title">
            <span className="sr-only">Muhammad Nishan K N, live sound engineer. </span>
            <span className="line">
              <span className="line__inner hero__sans">Precision</span>
            </span>
            <span className="line">
              <span className="line__inner">
                <em className="serif accent">live sound</em>
              </span>
            </span>
            <span className="line">
              <span className="line__inner hero__sans">for big stages.</span>
            </span>
          </h1>

          <div className="hero__lower">
            <p className="hero__lead" data-hero-fade>
              7+ years at the console — FOH and monitor mixing, system design and RF coordination for stadiums,
              festivals and touring artists across India and the UAE.
            </p>
            <div className="hero__ctas" data-hero-fade>
              <Button
                href="#work"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo("#work");
                }}
                icon="arrowDown"
              >
                View selected work
              </Button>
              <Button href={contact.cv} download="Muhammad_Nishan_KN_CV.pdf" variant="ghost" icon="download">
                Download CV
              </Button>
            </div>
          </div>
        </div>

        <figure className="hero__media">
          <div className="hero__frame">
            <div className="hero__img-wrap">
              <div className="hero__img">
                <Image
                  src="/img/nishan_hero_s6l.jpeg"
                  alt="Muhammad Nishan mixing on an AVID Venue S6L console"
                  fill
                  preload
                  sizes="(max-width: 1023px) 92vw, 38vw"
                  style={{ objectFit: "cover", objectPosition: "60% 40%" }}
                />
              </div>
            </div>
            <div className="hero__frame-shade" aria-hidden="true" />
          </div>

          <span className="hero__tag mono" data-hero-fade>
            <span className="rec-dot" aria-hidden="true" /> Live · 96 kHz
          </span>

          <figcaption className="hero__hud" data-hero-fade>
            <div className="hero__hud-row">
              <span className="mono">CH 01 · Lead vox</span>
              <span className="mono accent">−6.0 dB</span>
            </div>
            <div className="meter" aria-hidden="true">
              {Array.from({ length: METER_BARS }).map((_, i) => (
                <span
                  key={i}
                  style={{
                    animationDelay: `${((i * 37) % 11) * -0.13}s`,
                    animationDuration: `${0.9 + ((i * 53) % 7) * 0.12}s`,
                  }}
                />
              ))}
            </div>
            <div className="hero__hud-row hero__hud-row--muted">
              <span className="mono">AVID Venue S6L</span>
              <span className="mono">FOH</span>
            </div>
          </figcaption>
        </figure>
      </div>

      <div className="container hero__meta">
        <dl className="hero__facts">
          <div data-hero-fade>
            <dt className="mono">Based in</dt>
            <dd>Wayanad, Kerala</dd>
          </div>
          <div data-hero-fade>
            <dt className="mono">Working across</dt>
            <dd>India · UAE · Tours</dd>
          </div>
          <div data-hero-fade>
            <dt className="mono">Specialism</dt>
            <dd>FOH · Monitors · Systems</dd>
          </div>
        </dl>
        <a
          href="#intro"
          className="scroll-cue mono"
          data-hero-fade
          onClick={(e) => {
            e.preventDefault();
            scrollTo("#intro");
          }}
        >
          <span className="scroll-cue__line" aria-hidden="true" />
          Scroll
        </a>
      </div>
    </section>
  );
}
