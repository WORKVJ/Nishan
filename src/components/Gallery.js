"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGsap } from "@/lib/gsap";
import { gallery } from "@/data/content";
import { SectionLabel } from "./ui";
import SplitHeading from "./SplitHeading";

export default function Gallery() {
  const root = useRef(null);
  const counter = useRef(null);

  useGsap(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const track = root.current.querySelector(".gallery__track");
        const viewport = root.current.querySelector(".gallery__viewport");
        const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
        const skewTo = gsap.quickTo(track, "skewX", { duration: 0.5, ease: "power3.out" });
        const total = gallery.length;
        let lastIdx = 1;

        const scroller = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              skewTo(gsap.utils.clamp(-3, 3, self.getVelocity() / -900));
              const idx = Math.min(total, Math.floor(self.progress * total) + 1);
              if (counter.current && idx !== lastIdx) {
                lastIdx = idx;
                counter.current.textContent = String(idx).padStart(2, "0");
              }
            },
            onLeave: () => skewTo(0),
            onLeaveBack: () => skewTo(0),
          },
        });

        // Outline backdrop word travels against the photos for depth.
        gsap.to(".gallery__bgword", {
          x: () => distance() * 0.45,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: 1.2,
            invalidateOnRefresh: true,
          },
        });

        gsap.to(".gallery__bar", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });

        // Each photo pans inside its frame as it travels across the screen.
        gsap.utils.toArray(".gcard").forEach((card) => {
          gsap.fromTo(
            card.querySelector(".gcard__img"),
            { xPercent: -10 },
            {
              xPercent: 10,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                containerAnimation: scroller,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            }
          );
          gsap.fromTo(
            card.querySelector(".gcard__frame"),
            { rotation: 6, scale: 0.84, yPercent: 6 },
            {
              rotation: 0,
              scale: 1,
              yPercent: 0,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                containerAnimation: scroller,
                start: "left right",
                end: "left 50%",
                scrub: true,
              },
            }
          );
          gsap.from(card.querySelector(".gcard__cap"), {
            y: 30,
            opacity: 0,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: { trigger: card, containerAnimation: scroller, start: "left 85%" },
          });
        });
      });

      mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.from(".gcard", {
          x: 80,
          opacity: 0,
          stagger: 0.08,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: { trigger: ".gallery__track", start: "top 85%" },
        });
      });
    },
    [],
    root
  );

  return (
    <section className="gallery" ref={root} aria-labelledby="gallery-title">
      <div className="gallery__inner">
        <p className="gallery__bgword" aria-hidden="true">
          Behind the consoles —
        </p>
        <div className="container gallery__head">
          <div>
            <SectionLabel index="03">On the road</SectionLabel>
            <SplitHeading as="h2" className="section-title" id="gallery-title">
              Behind the <em className="serif accent">consoles</em>
            </SplitHeading>
          </div>
          <p className="gallery__count mono" aria-hidden="true">
            <span ref={counter}>01</span> / {String(gallery.length).padStart(2, "0")}
          </p>
        </div>

        <div className="gallery__viewport">
          <ul className="gallery__track">
            {gallery.map((g, i) => (
              <li className="gcard" key={g.title} style={{ "--i": i }}>
                <div className="gcard__frame">
                  <div className="gcard__img">
                    <Image
                      src={g.image}
                      alt={`${g.title} — ${g.subtitle}`}
                      fill
                      sizes="(max-width: 767px) 78vw, (max-width: 1023px) 46vw, 30vw"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                </div>
                <div className="gcard__cap">
                  <span className="mono gcard__num">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="gcard__title">{g.title}</h3>
                    <p className="gcard__sub">{g.subtitle}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="container">
          <div className="gallery__progress" aria-hidden="true">
            <span className="gallery__bar" />
          </div>
        </div>
      </div>
    </section>
  );
}
