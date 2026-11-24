"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { gsap, SplitText, useGsap } from "@/lib/gsap";
import { projects } from "@/data/content";
import { SectionLabel } from "./ui";
import Icon from "./Icon";
import ProjectModal from "./ProjectModal";
import SplitHeading from "./SplitHeading";

export default function Projects() {
  const root = useRef(null);
  const [active, setActive] = useState(null);
  const lastTrigger = useRef(null);

  useGsap(
    () => {
      const mm = gsap.matchMedia();
      const cards = gsap.utils.toArray(".stack__item");

      mm.add(
        {
          any: "all",
          stack: "(min-width: 1024px) and (min-height: 700px)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { stack, reduced } = context.conditions;
          if (reduced) return;

          cards.forEach((item, i) => {
            const card = item.querySelector(".pcard");
            const img = item.querySelector(".pcard__img");

            // Entrance
            gsap.from(card, {
              y: 120,
              opacity: 0,
              rotateX: stack ? -8 : 0,
              transformPerspective: 1400,
              transformOrigin: "50% 0%",
              duration: 1.4,
              ease: "expo.out",
              scrollTrigger: { trigger: item, start: "top 92%" },
            });

            // Gold curtain lifts off the photo
            gsap.fromTo(
              item.querySelector(".pcard__curtain"),
              { scaleY: 1 },
              {
                scaleY: 0,
                transformOrigin: "50% 0%",
                duration: 1.5,
                ease: "expo.inOut",
                scrollTrigger: { trigger: item, start: "top 78%" },
              }
            );

            // Title letters rise out of a mask
            SplitText.create(item.querySelector(".pcard__title"), {
              type: "chars,lines",
              mask: "lines",
              autoSplit: true,
              onSplit(self) {
                return gsap.from(self.chars, {
                  yPercent: 110,
                  rotate: 6,
                  duration: 1.2,
                  stagger: 0.025,
                  ease: "expo.out",
                  scrollTrigger: { trigger: item, start: "top 72%", once: true },
                });
              },
            });

            // Image drift inside its frame
            gsap.fromTo(
              img,
              { yPercent: -8, scale: 1.18 },
              {
                yPercent: 8,
                scale: 1.08,
                ease: "none",
                scrollTrigger: { trigger: item, start: "top bottom", end: "bottom top", scrub: true },
              }
            );

            // Stacked cards recede as the next one slides over them
            if (stack && i < cards.length - 1) {
              const next = cards[i + 1];
              gsap.to(card, {
                scale: 0.88 + i * 0.015,
                rotationX: 7,
                transformPerspective: 1600,
                ease: "none",
                scrollTrigger: { trigger: next, start: "top bottom", end: "top 20%", scrub: true },
              });
              gsap.to(item.querySelector(".pcard__dim"), {
                opacity: 0.65,
                ease: "none",
                scrollTrigger: { trigger: next, start: "top bottom", end: "top 20%", scrub: true },
              });
            }
          });
        }
      );
    },
    [],
    root
  );

  const open = (p, e) => {
    lastTrigger.current = e?.currentTarget ?? null;
    setActive(p);
  };

  const close = () => {
    setActive(null);
    lastTrigger.current?.focus?.({ preventScroll: true });
  };

  return (
    <section id="work" className="work section" ref={root}>
      <div className="container">
        <header className="section-head">
          <SectionLabel index="02">Selected work</SectionLabel>
          <div className="section-head__row">
            <SplitHeading as="h2" className="section-title">
              Flagship <em className="serif accent">productions</em>
            </SplitHeading>
            <p className="section-head__sub">
              Stadiums, festivals and international stages. Open any project for the full technical case study — the
              challenge, the engineering and the gear.
            </p>
          </div>
        </header>

        <div className="stack">
          {projects.map((p, i) => (
            <article className="stack__item" key={p.id} style={{ "--i": i }}>
              <div className="pcard" data-cursor="View case" onClick={(e) => open(p, e)}>
                <div className="pcard__content">
                  <div className="pcard__top">
                    <span className="mono pcard__index">
                      {String(i + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
                    </span>
                    <span className="chip">{p.category}</span>
                  </div>

                  <div className="pcard__body">
                    <p className="mono pcard__date">{p.date}</p>
                    <h3 className="pcard__title">{p.title}</h3>
                    <p className="pcard__sub">{p.subtitle}</p>
                  </div>

                  <dl className="pcard__meta">
                    <div>
                      <dt className="mono">Role</dt>
                      <dd>{p.role}</dd>
                    </div>
                    <div>
                      <dt className="mono">Location</dt>
                      <dd>{p.location}</dd>
                    </div>
                  </dl>

                  <button
                    type="button"
                    className="pcard__cta"
                    onClick={(e) => {
                      e.stopPropagation();
                      open(p, e);
                    }}
                    aria-haspopup="dialog"
                  >
                    <span>View case study</span>
                    <span className="pcard__cta-icon">
                      <Icon name="arrowUpRight" size={18} strokeWidth={2} />
                    </span>
                  </button>
                </div>

                <div className="pcard__media">
                  <div className="pcard__img">
                    <Image
                      src={p.image}
                      alt={p.fullTitle}
                      fill
                      sizes="(max-width: 1023px) 92vw, 45vw"
                      style={{ objectFit: "cover", objectPosition: "50% 35%" }}
                    />
                  </div>
                  <div className="pcard__media-shade" aria-hidden="true" />
                  <div className="pcard__curtain" aria-hidden="true" />
                  <ul className="pcard__gear" aria-label="Key gear">
                    {p.gear.slice(0, 3).map((g) => (
                      <li key={g} className="chip chip--glass">
                        {g}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pcard__dim" aria-hidden="true" />
              </div>
            </article>
          ))}
        </div>
      </div>

      <ProjectModal project={active} onClose={close} />
    </section>
  );
}
