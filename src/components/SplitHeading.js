"use client";

import { useRef } from "react";
import { gsap, SplitText, useGsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * Heading whose lines rise out of a mask when scrolled into view.
 * Re-splits automatically on resize / font load so line breaks stay correct.
 */
export default function SplitHeading({ as: Tag = "h2", className = "", children, start = "top 85%", delay = 0, id }) {
  const ref = useRef(null);

  useGsap(
    () => {
      if (prefersReducedMotion() || !ref.current) return;
      SplitText.create(ref.current, {
        type: "lines",
        mask: "lines",
        linesClass: "split-line",
        autoSplit: true,
        onSplit(self) {
          return gsap.from(self.lines, {
            yPercent: 115,
            rotate: 2.5,
            transformOrigin: "0% 100%",
            duration: 1.4,
            stagger: 0.1,
            delay,
            ease: "expo.out",
            scrollTrigger: { trigger: ref.current, start, once: true },
          });
        },
      });
    },
    [],
    ref
  );

  return (
    <Tag ref={ref} className={className} id={id}>
      {children}
    </Tag>
  );
}
