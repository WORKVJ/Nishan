"use client";

import { useRef } from "react";
import { gsap, useGsap, canHover } from "@/lib/gsap";
import { contact, navLinks } from "@/data/content";
import { useShell } from "./AppShell";
import { RollText, useMagnetic } from "./ui";
import Marquee from "./Marquee";
import Icon from "./Icon";

export default function Footer() {
  const root = useRef(null);
  const { scrollTo } = useShell();
  const topBtn = useMagnetic(0.4);

  useGsap(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Letters flip up out of the floor, scrubbed to the final stretch of the page.
        gsap.fromTo(
          ".footer__word span",
          { yPercent: 105, rotationX: -80, transformPerspective: 800, transformOrigin: "50% 100%" },
          {
            yPercent: 0,
            rotationX: 0,
            stagger: 0.08,
            ease: "none",
            scrollTrigger: { trigger: ".footer__word", start: "top bottom", end: "bottom bottom", scrub: 0.6 },
          }
        );
        if (canHover()) {
          gsap.utils.toArray(".footer__word span").forEach((letter) => {
            const inner = letter.querySelector("i");
            letter.addEventListener("pointerenter", () =>
              gsap.to(inner, { yPercent: -14, duration: 0.5, ease: "power3.out", overwrite: true })
            );
            letter.addEventListener("pointerleave", () =>
              gsap.to(inner, { yPercent: 0, duration: 1, ease: "elastic.out(1, 0.4)", overwrite: true })
            );
          });
        }
        gsap.from(".footer__cols > *", {
          y: 30,
          opacity: 0,
          duration: 1,
          stagger: 0.08,
          ease: "expo.out",
          scrollTrigger: { trigger: ".footer__cols", start: "top 92%" },
        });
      });
    },
    [],
    root
  );

  const go = (e, id) => {
    e.preventDefault();
    scrollTo(`#${id}`);
  };

  return (
    <footer className="footer" ref={root}>
      <Marquee
        items={["Book a soundcheck", "Let's mix live", "FOH · Monitors · Systems", "Available worldwide"]}
        variant="marquee--outline"
        speed={0.04}
        reverse
      />

      <div className="container">
        <div className="footer__cols">
          <div className="footer__col">
            <p className="mono muted">Say hello</p>
            <a className="footer__big-link" href={contact.emailHref}>
              <RollText>{contact.email}</RollText>
            </a>
            <a className="footer__big-link" href={contact.phoneHref}>
              <RollText>{contact.phone}</RollText>
            </a>
          </div>

          <nav className="footer__col" aria-label="Footer">
            <p className="mono muted">Sitemap</p>
            <ul>
              {navLinks.map((l) => (
                <li key={l.id}>
                  <a href={`#${l.id}`} onClick={(e) => go(e, l.id)}>
                    <RollText>{l.label}</RollText>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer__col">
            <p className="mono muted">Elsewhere</p>
            <ul>
              <li>
                <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">
                  <RollText>LinkedIn</RollText>
                </a>
              </li>
              <li>
                <a href={contact.whatsappHref} target="_blank" rel="noopener noreferrer">
                  <RollText>WhatsApp</RollText>
                </a>
              </li>
              <li>
                <a href={contact.cv} download="Muhammad_Nishan_KN_CV.pdf">
                  <RollText>Résumé (PDF)</RollText>
                </a>
              </li>
            </ul>
          </div>

          <div className="footer__col footer__col--end">
            <button type="button" className="to-top" ref={topBtn} onClick={(e) => go(e, "top")} aria-label="Back to top">
              <Icon name="arrowUp" size={22} strokeWidth={1.8} />
            </button>
          </div>
        </div>

        <p className="footer__word" aria-hidden="true">
          {"NISHAN".split("").map((c, i) => (
            <span key={i}>
              <i>{c}</i>
            </span>
          ))}
        </p>

        <div className="footer__bottom mono">
          <span>© {new Date().getFullYear()} Muhammad Nishan K N</span>
          <span>Sound Engineer · AVID Venue S6L Specialist</span>
          <span>Wayanad, Kerala — Worldwide</span>
        </div>
      </div>
    </footer>
  );
}
