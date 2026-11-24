"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGsap } from "@/lib/gsap";
import { experience, education, certifications, tools, contact } from "@/data/content";
import { Button, SectionLabel } from "./ui";
import SplitHeading from "./SplitHeading";
import Icon from "./Icon";

function Timeline({ title, items }) {
  return (
    <div className="timeline">
      <h3 className="timeline__title mono">{title}</h3>
      <div className="timeline__list">
        <span className="timeline__track" aria-hidden="true">
          <span className="timeline__fill" />
        </span>
        <ol>
        {items.map((item) => (
          <li className="tl-item" key={`${item.title}-${item.date}`}>
            <span className="tl-item__dot" aria-hidden="true" />
            <p className="mono tl-item__date">{item.date}</p>
            <div className="tl-item__body">
              <h4 className="tl-item__title">{item.title}</h4>
              <p className="tl-item__org">{item.org}</p>
              <p className="tl-item__text">{item.text}</p>
            </div>
          </li>
        ))}
        </ol>
      </div>
    </div>
  );
}

export default function Experience() {
  const root = useRef(null);

  useGsap(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Progress line fills as you read down the timeline.
        gsap.utils.toArray(".timeline__list").forEach((list) => {
          gsap.fromTo(
            list.querySelector(".timeline__fill"),
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              scrollTrigger: { trigger: list, start: "top 60%", end: "bottom 60%", scrub: 0.4 },
            }
          );
        });

        gsap.utils.toArray(".tl-item").forEach((item) => {
          gsap.from(item.querySelectorAll(".tl-item__date, .tl-item__body"), {
            y: 40,
            opacity: 0,
            duration: 1.1,
            stagger: 0.08,
            ease: "expo.out",
            scrollTrigger: { trigger: item, start: "top 85%" },
          });
          ScrollTrigger.create({
            trigger: item,
            start: "top 60%",
            end: "bottom 60%",
            toggleClass: { targets: item, className: "is-active" },
          });
          const date = item.querySelector(".tl-item__date");
          const dateText = date.textContent;
          ScrollTrigger.create({
            trigger: item,
            start: "top 60%",
            onEnter: () => {
              item.classList.add("is-passed");
              gsap.to(date, {
                scrambleText: { text: dateText, chars: "0123456789/–", speed: 0.8 },
                duration: 0.9,
                ease: "none",
                overwrite: true,
              });
            },
            onLeaveBack: () => item.classList.remove("is-passed"),
          });
        });

        gsap.from(".tool", {
          y: 50,
          rotationY: -65,
          transformPerspective: 900,
          transformOrigin: "0% 50%",
          opacity: 0,
          duration: 1.3,
          stagger: { each: 0.06, grid: "auto", from: "start" },
          ease: "expo.out",
          scrollTrigger: { trigger: ".tools", start: "top 85%" },
        });
        gsap.from(".cert", {
          scale: 0.85,
          opacity: 0,
          duration: 1,
          stagger: 0.07,
          ease: "back.out(1.6)",
          scrollTrigger: { trigger: ".certs", start: "top 90%" },
        });
      });

      // Without motion, mark every item as reached.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.utils.toArray(".tl-item").forEach((el) => el.classList.add("is-passed"));
      });
    },
    [],
    root
  );

  return (
    <section id="experience" className="experience section" ref={root}>
      <div className="container experience__grid">
        <aside className="experience__aside">
          <div className="experience__sticky">
            <SectionLabel index="07">Experience</SectionLabel>
            <SplitHeading as="h2" className="section-title">
              Precision <em className="serif accent">with passion</em>
            </SplitHeading>
            <p className="section-head__sub">
              Over seven years designing and operating world-class audio across stadiums, festivals and international
              venues throughout India and the UAE.
            </p>
            <Button href={contact.cv} download="Muhammad_Nishan_KN_CV.pdf" variant="ghost" icon="download">
              Full résumé (PDF)
            </Button>
          </div>
        </aside>

        <div className="experience__main">
          <Timeline title="Work experience" items={experience} />
          <Timeline title="Education" items={education} />

          <div className="toolkit">
            <h3 className="timeline__title mono">Consoles &amp; acoustic tools</h3>
            <ul className="tools">
              {tools.map((t) => (
                <li className="tool" key={t.name}>
                  <span className="tool__name">{t.name}</span>
                  <span className="tool__note mono">{t.note}</span>
                </li>
              ))}
            </ul>

            <h3 className="timeline__title mono">Certifications</h3>
            <ul className="certs">
              {certifications.map((c) => (
                <li className="cert" key={c}>
                  <Icon name="award" size={16} /> {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
