"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useIsoLayoutEffect } from "@/lib/gsap";
import { navLinks, contact } from "@/data/content";
import { useShell } from "./AppShell";
import { Button, RollText } from "./ui";
import Icon from "./Icon";

export default function Header() {
  const { ready, scrollTo, lockScroll, unlockScroll } = useShell();
  const header = useRef(null);
  const progress = useRef(null);
  const menu = useRef(null);
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);
  const menuTl = useRef(null);

  // Intro, hide-on-scroll and scroll progress
  useIsoLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(".header__bar > *", { yPercent: -140, opacity: 0 });
    }, header);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!ready) return;
    let vuTick = null;
    const ctx = gsap.context(() => {
      gsap.to(".header__bar > *", {
        yPercent: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.08,
        ease: "expo.out",
        delay: 0.5,
      });

      gsap.to(progress.current, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
      });

      let hidden = false;
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const y = self.scroll();
          header.current?.classList.toggle("is-scrolled", y > 40);
          const shouldHide = self.direction === 1 && y > 320;
          if (shouldHide !== hidden) {
            hidden = shouldHide;
            gsap.to(".header__bar", { yPercent: hidden ? -130 : 0, duration: 0.6, ease: "expo.out" });
          }
        },
      });

      // VU meter: scroll velocity drives the bars, with a gentle idle signal.
      const bars = gsap.utils.toArray(".vu__bar");
      if (bars.length && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const setters = bars.map((b) => gsap.quickTo(b, "scaleY", { duration: 0.18, ease: "power2.out" }));
        let level = 0;
        let frame = 0;
        ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => {
            level = Math.max(level, Math.min(1, Math.abs(self.getVelocity()) / 2600));
          },
        });
        const tick = () => {
          if (++frame % 3) return; // ~20 updates/s is plenty for a meter
          level *= 0.86;
          const idle = 0.12 + Math.sin(frame * 0.05) * 0.04;
          setters.forEach((set, i) => {
            const shape = 1 - Math.abs(i - (bars.length - 1) / 2) * 0.12;
            set(Math.min(1, idle + level * shape * (0.65 + Math.random() * 0.35)));
          });
        };
        gsap.ticker.add(tick);
        vuTick = tick;
      }

      ["top", ...navLinks.map((l) => l.id)].forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: "top 45%",
          end: "bottom 45%",
          onToggle: (self) => self.isActive && setActive(id),
        });
      });
    }, header);
    return () => {
      if (vuTick) gsap.ticker.remove(vuTick);
      ctx.revert();
    };
  }, [ready]);

  // Mobile menu timeline
  useIsoLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(menu.current, { clipPath: "inset(0% 0% 100% 0%)", visibility: "hidden" });
      menuTl.current = gsap
        .timeline({ paused: true })
        .set(menu.current, { visibility: "visible" })
        .to(menu.current, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "expo.inOut" })
        .from(".mobile-menu__link-inner", { yPercent: 110, duration: 0.9, stagger: 0.06, ease: "expo.out" }, "-=0.35")
        .from(".mobile-menu__foot > *", { y: 20, opacity: 0, stagger: 0.06, duration: 0.6, ease: "expo.out" }, "-=0.7");
    }, header);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!menuTl.current) return;
    if (open) {
      lockScroll();
      menuTl.current.timeScale(1).play();
      const onKey = (e) => e.key === "Escape" && setOpen(false);
      window.addEventListener("keydown", onKey);
      return () => {
        window.removeEventListener("keydown", onKey);
        unlockScroll();
      };
    }
    menuTl.current.timeScale(1.6).reverse();
  }, [open, lockScroll, unlockScroll]);

  // Close the mobile menu if the viewport grows past the breakpoint
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const go = (e, id) => {
    e.preventDefault();
    const wasOpen = open;
    setOpen(false);
    // Let the menu start closing (and scroll unlock) before navigating.
    setTimeout(() => scrollTo(`#${id}`), wasOpen ? 350 : 0);
  };

  return (
    <header className="header" ref={header}>
      <div className="header__progress" ref={progress} aria-hidden="true" />
      <div className="header__bar container">
        <a href="#top" className="logo" onClick={(e) => go(e, "top")} aria-label="Muhammad Nishan — back to top">
          <span className="logo__mark" aria-hidden="true">
            <svg viewBox="0 0 40 40" width="34" height="34">
              <rect x="0.5" y="0.5" width="39" height="39" rx="11" fill="none" stroke="currentColor" strokeOpacity="0.25" />
              <path d="M10 27V13l6 7 6-7v14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
              <circle cx="29" cy="25" r="2.6" fill="var(--accent)" />
            </svg>
          </span>
          <span className="logo__text">
            Nishan<span className="accent">.</span>
          </span>
          <span className="vu" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, i) => (
              <span className="vu__bar" key={i} />
            ))}
          </span>
        </a>

        <nav className="nav" aria-label="Primary">
          <ul className="nav__list">
            {navLinks.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  className={`nav__link ${active === l.id ? "is-active" : ""}`}
                  onClick={(e) => go(e, l.id)}
                  aria-current={active === l.id ? "true" : undefined}
                >
                  <RollText>{l.label}</RollText>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header__actions">
          <span className="status mono">
            <span className="status__dot" aria-hidden="true" />
            Available for 2026
          </span>
          <Button
            href="#contact"
            onClick={(e) => go(e, "contact")}
            variant="primary"
            className="btn--sm header__cta"
          >
            Let&apos;s talk
          </Button>
          <button
            type="button"
            className={`burger ${open ? "is-open" : ""}`}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className="mobile-menu" id="mobile-menu" ref={menu} aria-hidden={!open}>
        <nav className="mobile-menu__nav container" aria-label="Mobile">
          {[{ id: "top", label: "Home" }, ...navLinks].map((l, i) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className="mobile-menu__link"
              onClick={(e) => go(e, l.id)}
              tabIndex={open ? 0 : -1}
            >
              <span className="mobile-menu__link-inner">
                <span className="mono mobile-menu__index">0{i + 1}</span>
                {l.label}
              </span>
            </a>
          ))}
        </nav>
        <div className="mobile-menu__foot container">
          <a href={contact.emailHref} tabIndex={open ? 0 : -1}>
            <Icon name="mail" size={16} /> {contact.email}
          </a>
          <a href={contact.phoneHref} tabIndex={open ? 0 : -1}>
            <Icon name="phone" size={16} /> {contact.phone}
          </a>
          <a href={contact.whatsappHref} target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1}>
            <Icon name="whatsapp" size={16} /> WhatsApp
          </a>
        </div>
      </div>
    </header>
  );
}
