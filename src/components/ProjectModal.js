"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, useIsoLayoutEffect, prefersReducedMotion } from "@/lib/gsap";
import { useShell } from "./AppShell";
import { Button } from "./ui";
import Icon from "./Icon";

export default function ProjectModal({ project, onClose }) {
  const { lockScroll, unlockScroll, scrollTo } = useShell();
  const root = useRef(null);
  const panel = useRef(null);
  const closeBtn = useRef(null);
  const ctxRef = useRef(null);
  const closing = useRef(false);
  const isMobile = useRef(false);

  useIsoLayoutEffect(() => {
    if (!project) return;
    lockScroll();
    closing.current = false;
    isMobile.current = window.matchMedia("(max-width: 767px)").matches;
    const reduced = prefersReducedMotion();
    const from = isMobile.current ? { yPercent: 100 } : { xPercent: 100 };
    const to = isMobile.current ? { yPercent: 0 } : { xPercent: 0 };

    ctxRef.current = gsap.context(() => {
      if (reduced) {
        gsap.from(root.current, { opacity: 0, duration: 0.3 });
        return;
      }
      gsap
        .timeline()
        .fromTo(".pmodal__backdrop", { opacity: 0 }, { opacity: 1, duration: 0.7, ease: "power2.out" })
        .fromTo(".pmodal__panel", from, { ...to, duration: 1.1, ease: "expo.out" }, 0)
        .fromTo(".pmodal__hero-img", { scale: 1.35 }, { scale: 1, duration: 1.8, ease: "expo.out" }, 0.05)
        .from("[data-m]", { y: 40, opacity: 0, stagger: 0.05, duration: 1, ease: "expo.out" }, 0.3);
    }, root);

    panel.current?.scrollTo(0, 0);
    closeBtn.current?.focus({ preventScroll: true });

    return () => {
      ctxRef.current?.revert();
      ctxRef.current = null;
      unlockScroll();
    };
  }, [project, lockScroll, unlockScroll]);

  const requestClose = useCallback(
    (after) => {
      if (closing.current) return;
      closing.current = true;
      const done = () => {
        onClose();
        if (typeof after === "function") after();
      };
      if (prefersReducedMotion() || !ctxRef.current) return done();
      ctxRef.current.add(() => {
        gsap
          .timeline({ onComplete: done })
          .to(".pmodal__panel", {
            ...(isMobile.current ? { yPercent: 100 } : { xPercent: 100 }),
            duration: 0.75,
            ease: "expo.in",
          })
          .to(".pmodal__backdrop", { opacity: 0, duration: 0.5, ease: "power2.in" }, 0.25);
      });
    },
    [onClose]
  );

  // Escape to close + keep focus inside the dialog
  useEffect(() => {
    if (!project) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        requestClose();
        return;
      }
      if (e.key !== "Tab" || !panel.current) return;
      const focusables = panel.current.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [project, requestClose]);

  if (!project) return null;

  const sections = [
    { n: "01", title: "Project overview", text: project.description },
    { n: "02", title: "The audio challenge", text: project.challenge },
    { n: "03", title: "Engineering solution", text: project.solution },
  ];

  return (
    <div className="pmodal" ref={root} role="dialog" aria-modal="true" aria-labelledby="pmodal-title">
      <div className="pmodal__backdrop" onClick={() => requestClose()} />
      <div className="pmodal__panel" ref={panel} data-lenis-prevent>
        <button ref={closeBtn} type="button" className="pmodal__close" onClick={() => requestClose()} aria-label="Close case study">
          <Icon name="x" size={20} strokeWidth={2} />
        </button>

        <div className="pmodal__hero">
          <div className="pmodal__hero-img">
            <Image
              src={project.image}
              alt={project.fullTitle}
              fill
              sizes="(max-width: 767px) 100vw, 880px"
              style={{ objectFit: "cover", objectPosition: "50% 35%" }}
            />
          </div>
          <div className="pmodal__hero-shade" aria-hidden="true" />
          <div className="pmodal__hero-copy">
            <span className="chip" data-m>
              {project.category}
            </span>
            <h2 id="pmodal-title" className="pmodal__title" data-m>
              {project.fullTitle}
            </h2>
            <p className="pmodal__subtitle" data-m>
              {project.subtitle}
            </p>
          </div>
        </div>

        <div className="pmodal__body">
          <dl className="pmodal__meta" data-m>
            {[
              ["Date", project.date],
              ["Role", project.role],
              ["Duration", project.duration],
              ["Location", project.location],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="mono">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>

          {sections.map((s) => (
            <section className="pmodal__section" key={s.n} data-m>
              <p className="mono pmodal__num">{s.n}</p>
              <div>
                <h3 className="pmodal__h">{s.title}</h3>
                <p className="pmodal__text">{s.text}</p>
              </div>
            </section>
          ))}

          <section className="pmodal__section" data-m>
            <p className="mono pmodal__num">04</p>
            <div>
              <h3 className="pmodal__h">Key gear &amp; systems</h3>
              <ul className="pmodal__gear">
                {project.gear.map((g) => (
                  <li key={g} className="chip chip--accent">
                    {g}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <div className="pmodal__cta" data-m>
            <Button
              as="button"
              type="button"
              onClick={() => requestClose(() => setTimeout(() => scrollTo("#contact"), 50))}
              icon="arrowRight"
            >
              Enquire about a similar production
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
