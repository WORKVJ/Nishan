"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, useIsoLayoutEffect, prefersReducedMotion } from "@/lib/gsap";
import Preloader from "./Preloader";
import Cursor from "./Cursor";

const ShellContext = createContext({
  ready: false,
  scrollTo: () => {},
  lockScroll: () => {},
  unlockScroll: () => {},
});

export const useShell = () => useContext(ShellContext);

export default function AppShell({ children }) {
  const [ready, setReady] = useState(false);
  const lenisRef = useRef(null);
  const locks = useRef(0);

  useIsoLayoutEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    const reduced = prefersReducedMotion();
    // lerp-based smoothing follows the wheel closely (no "floaty" delay);
    // touch devices keep native scrolling for zero input latency.
    const lenis = new Lenis({
      lerp: reduced ? 1 : 0.12,
      smoothWheel: !reduced,
      wheelMultiplier: 1,
      syncTouch: false,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    // Prioritised: Lenis must set the scroll position BEFORE GSAP writes styles this frame,
    // otherwise window.scrollTo forces a synchronous style recalc + layout on every frame.
    gsap.ticker.add(tick, false, true);
    gsap.ticker.lagSmoothing(0);

    // Hold the page still while the preloader runs.
    lenis.stop();
    document.documentElement.classList.add("is-loading");

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);

    return () => {
      window.removeEventListener("load", refresh);
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const handleLoaded = useCallback(() => {
    document.documentElement.classList.remove("is-loading");
    lenisRef.current?.start();
    setReady(true);
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, []);

  const scrollTo = useCallback((target, opts = {}) => {
    const lenis = lenisRef.current;
    const el = typeof target === "string" ? document.querySelector(target) : target;
    if (lenis) {
      lenis.scrollTo(el ?? target, { duration: 1.6, force: true, ...opts });
    } else if (el?.scrollIntoView) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const lockScroll = useCallback(() => {
    locks.current += 1;
    lenisRef.current?.stop();
    document.documentElement.classList.add("is-locked");
  }, []);

  const unlockScroll = useCallback(() => {
    locks.current = Math.max(0, locks.current - 1);
    if (locks.current === 0) {
      lenisRef.current?.start();
      document.documentElement.classList.remove("is-locked");
    }
  }, []);

  const value = useMemo(
    () => ({ ready, scrollTo, lockScroll, unlockScroll }),
    [ready, scrollTo, lockScroll, unlockScroll]
  );

  return (
    <ShellContext.Provider value={value}>
      <Preloader onComplete={handleLoaded} />
      <Cursor />
      {children}
    </ShellContext.Provider>
  );
}
