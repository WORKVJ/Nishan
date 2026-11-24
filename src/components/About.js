"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, SplitText, useGsap } from "@/lib/gsap";
import { contact, languages } from "@/data/content";
import { Button, SectionLabel } from "./ui";
import SplitHeading from "./SplitHeading";
import Icon from "./Icon";

export default function About() {
  const root = useRef(null);

  useGsap(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".about__frame",
          { scale: 0.8, rotation: -3 },
          {
            scale: 1,
            rotation: 0,
            ease: "none",
            scrollTrigger: { trigger: ".about__media", start: "top 95%", end: "top 30%", scrub: true },
          }
        );
        // Badge spins with the scroll, like a turntable platter.
        gsap.to(".about__badge-ring text", {
          rotation: 540,
          svgOrigin: "60 60",
          ease: "none",
          scrollTrigger: { trigger: ".about", start: "top bottom", end: "bottom top", scrub: 0.5 },
        });
        // Paragraph lines rise out of masks.
        SplitText.create(".about__text", {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit(self) {
            return gsap.from(self.lines, {
              yPercent: 100,
              duration: 1.2,
              stagger: 0.07,
              ease: "expo.out",
              scrollTrigger: { trigger: ".about__text", start: "top 85%", once: true },
            });
          },
        });
        gsap.fromTo(
          ".about__img",
          { scale: 1.3, yPercent: -6 },
          {
            scale: 1.05,
            yPercent: 6,
            ease: "none",
            scrollTrigger: { trigger: ".about__media", start: "top bottom", end: "bottom top", scrub: true },
          }
        );
        gsap.from(".about__badge", {
          scale: 0.6,
          opacity: 0,
          rotate: -20,
          duration: 1.4,
          ease: "elastic.out(1, 0.6)",
          scrollTrigger: { trigger: ".about__media", start: "top 55%" },
        });
        gsap.from(".about [data-fade]", {
          y: 40,
          opacity: 0,
          duration: 1.2,
          stagger: 0.08,
          ease: "expo.out",
          scrollTrigger: { trigger: ".about__copy", start: "top 75%" },
        });
        gsap.from(".about__info-row", {
          y: 24,
          opacity: 0,
          duration: 1,
          stagger: 0.06,
          ease: "expo.out",
          scrollTrigger: { trigger: ".about__info", start: "top 85%" },
        });
      });
    },
    [],
    root
  );

  const info = [
    { k: "Phone", v: contact.phone, href: contact.phoneHref, icon: "phone" },
    { k: "Email", v: contact.email, href: contact.emailHref, icon: "mail" },
    { k: "Location", v: contact.location, icon: "pin" },
    { k: "Languages", v: languages.join(" · "), icon: "globe" },
  ];

  return (
    <section id="about" className="about section" ref={root}>
      <div className="container about__grid">
        <div className="about__media">
          <div className="about__frame">
            <div className="about__img">
              <Image
                src="/img/nishan_about.jpeg"
                alt="Muhammad Nishan with headphones and a vocal microphone during soundcheck"
                fill
                sizes="(max-width: 1023px) 92vw, 42vw"
                style={{ objectFit: "cover", objectPosition: "50% 25%" }}
              />
            </div>
          </div>
          <div className="about__badge" aria-hidden="true">
            <svg viewBox="0 0 120 120" className="about__badge-ring">
              <defs>
                <path id="badge-circle" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
              </defs>
              <text>
                <textPath href="#badge-circle">AVID VENUE · S6L SPECIALIST · DANTE L2 ·</textPath>
              </text>
            </svg>
            <span className="about__badge-core">
              <strong>7+</strong>
              <span className="mono">yrs</span>
            </span>
          </div>
        </div>

        <div className="about__copy">
          <SectionLabel index="05">About</SectionLabel>
          <SplitHeading as="h2" className="section-title">
            Acoustic physics, <em className="serif accent">live precision</em>
          </SplitHeading>

          <p className="about__lead" data-fade>
            I&apos;m Muhammad Nishan K N — a sound engineer with 7+ years of freelance and professional experience in
            front-of-house and monitor mixing, live multitrack recording and electro-acoustic system design.
          </p>
          <p className="about__text">
            A <strong>BSc in Physics</strong> and professional training at <strong>Audio Academy, Bangalore</strong> let
            me approach acoustics with mathematical precision and musical intuition. I deploy and optimise L-Acoustics
            (K1, K2, K3, Kara2), d&amp;b audiotechnik, DiGiCo Quantum and AVID Venue S6L systems — from stadium audio at
            WPL 2025 in Bangalore to international productions in Dubai with Media Pro International.
          </p>

          <dl className="about__info">
            {info.map((row) => (
              <div className="about__info-row" key={row.k}>
                <dt className="mono">
                  <Icon name={row.icon} size={15} /> {row.k}
                </dt>
                <dd>
                  {row.href ? (
                    <a className="link" href={row.href}>
                      {row.v}
                    </a>
                  ) : (
                    row.v
                  )}
                </dd>
              </div>
            ))}
          </dl>

          <div className="about__ctas" data-fade>
            <Button href={contact.cv} download="Muhammad_Nishan_KN_CV.pdf" icon="download">
              Download CV
            </Button>
            <Button href={contact.linkedin} target="_blank" rel="noopener noreferrer" variant="ghost" icon="linkedin">
              LinkedIn
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
