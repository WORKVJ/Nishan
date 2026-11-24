"use client";

import { useRef } from "react";
import { gsap, useGsap } from "@/lib/gsap";
import { artistsWorkedWith, artistsMixedFor } from "@/data/content";
import { SectionLabel } from "./ui";
import SplitHeading from "./SplitHeading";
import Icon from "./Icon";

function ArtistList({ title, note, items, icon }) {
  return (
    <div className="artists__col">
      <div className="artists__col-head">
        <h3 className="mono">{title}</h3>
        <span className="mono muted">{note}</span>
      </div>
      <ul className="artists__list">
        {items.map((name, i) => (
          <li className="artist" key={name}>
            <span className="artist__rule" aria-hidden="true" />
            <span className="artist__row">
              <span className="mono artist__num">{String(i + 1).padStart(2, "0")}</span>
              <span className="artist__name">{name}</span>
              <span className="artist__icon" aria-hidden="true">
                <Icon name={icon} size={18} />
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Artists() {
  const root = useRef(null);

  useGsap(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray(".artists__list").forEach((list) => {
          const tl = gsap.timeline({ scrollTrigger: { trigger: list, start: "top 82%" } });
          tl.from(list.querySelectorAll(".artist__rule"), {
            scaleX: 0,
            duration: 1.2,
            stagger: 0.06,
            ease: "expo.inOut",
          }).from(
            list.querySelectorAll(".artist__row"),
            { yPercent: 100, opacity: 0, duration: 1.1, stagger: 0.06, ease: "expo.out" },
            0.2
          );
        });
      });

      // Columns drift against each other while scrolling (desktop).
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const st = { trigger: ".artists__grid", start: "top bottom", end: "bottom top", scrub: 0.6 };
        gsap.fromTo(".artists__col:first-child", { x: -36 }, { x: 36, ease: "none", scrollTrigger: st });
        gsap.fromTo(".artists__col:last-child", { x: 36 }, { x: -36, ease: "none", scrollTrigger: st });
      });
    },
    [],
    root
  );

  return (
    <section className="artists section" ref={root} aria-labelledby="artists-title">
      <div className="container">
        <header className="section-head">
          <SectionLabel index="04">Collaborations</SectionLabel>
          <div className="section-head__row">
            <SplitHeading as="h2" className="section-title" id="artists-title">
              Trusted by <em className="serif accent">artists</em>
            </SplitHeading>
            <p className="section-head__sub">
              Shared stages, festival line-ups and front-of-house mixes for some of India&apos;s most celebrated
              performers — and many more.
            </p>
          </div>
        </header>

        <div className="artists__grid">
          <ArtistList title="Worked with" note="Live production" items={artistsWorkedWith} icon="mic" />
          <ArtistList title="Mixed for" note="FOH & monitors" items={artistsMixedFor} icon="faders" />
        </div>
      </div>
    </section>
  );
}
