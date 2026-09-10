"use client";

import React, { useState, useEffect, useRef } from "react";
import Lenis from "lenis";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [theme, setTheme] = useState("dark");
  const [activeSection, setActiveSection] = useState("home");
  const [activeModal, setActiveModal] = useState(null);
  const [showToTop, setShowToTop] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    message: "",
  });

  // 2026 Ambient Cursor Spotlight tracking
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);


  // Initialize 2026 Lenis Smooth Momentum Scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    let animationFrameId;
    function raf(time) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }
    animationFrameId = requestAnimationFrame(raf);

    // Sync scrollY with Lenis scroll
    lenis.on("scroll", (e) => {
      setScrollY(e.scroll);
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
    };
  }, []);



  // Preloader counter animation (0% to 100%)
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 15) + 6;
      if (current >= 100) {
        current = 100;
        setCount(100);
        clearInterval(interval);
        setTimeout(() => {
          setLoading(false);
        }, 450);
      } else {
        setCount(current);
      }
    }, 40);

    return () => clearInterval(interval);
  }, []);

  // Theme switcher
  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.setAttribute("color-scheme", nextTheme);
    localStorage.setItem("theme", nextTheme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    document.documentElement.setAttribute("color-scheme", savedTheme);
  }, []);

  // Scroll listener for active section spy and to-top button
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setShowToTop(y > 350);

      // Section spy
      const sections = ["home", "portfolio", "about", "services", "resume", "contact"];
      const scrollThreshold = y + 250;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollThreshold >= top && scrollThreshold < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection Observer for scroll reveal animations
  useEffect(() => {
    if (loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    const elements = document.querySelectorAll(".scroll-reveal, .scroll-reveal-scale");
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [loading]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && activeModal) {
        setActiveModal(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeModal]);

  // Form submission - direct WhatsApp redirect with pre-filled details
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);

    const messageLines = [
      "🔥 *New Sound Engineering Inquiry*",
      "",
      `*Name:* ${formData.name}`,
      formData.company ? `*Band / Company:* ${formData.company}` : null,
      `*Email:* ${formData.email}`,
      formData.phone ? `*Phone / WhatsApp:* ${formData.phone}` : null,
      "",
      `*Project Requirements:*`,
      formData.message,
    ].filter(Boolean).join("\n");

    const whatsappUrl = `https://wa.me/919188370323?text=${encodeURIComponent(messageLines)}`;
    window.open(whatsappUrl, "_blank");
  };

  // Flagship projects using authentic user photos
  const projects = [
    {
      id: 1,
      title: "AV Head - WPL 2025 (Bangalore)",
      subtitle: "Women's Premier League T20 • Stadium Sound Reinforcement & Broadcast",
      category: "Stadium Audio & Broadcast",
      image: "/img/nishan_outdoor_festival.jpeg",
      date: "02.2025 - 03.2025",
      role: "AV Head & Lead System Engineer",
      duration: "5 Weeks",
      location: "M. Chinnaswamy Stadium, Bangalore",
      description:
        "Headed the complete Audio-Visual and sound reinforcement operations for the Women's Premier League (WPL) 2025 at M. Chinnaswamy Stadium, Bangalore. Orchestrated stadium-wide acoustic distribution, broadcast stems, live DJ/entertainment routing, and player announcements with zero downtime.",
      challenge:
        "High-decibel stadium noise exceeding 105 dB(A) required maximum speech intelligibility and punchy entertainment acoustics without acoustic feedback across commentator and broadcast mics. Redundant audio networking was critical.",
      solution:
        "Engineered a distributed stadium line array system with redundant Dante primary/secondary gigabit networks. Calibrated delay and phase alignment using SMAART v9 and LA Network Manager. Supervised multizone wireless RF frequency coordination across 32+ channels of Shure Axient Digital systems.",
      gear: [
        "L-Acoustics K1/K2 & Kara2",
        "AVID Venue S6L",
        "DiGiCo Quantum 338",
        "Shure Axient Digital RF",
        "Dante Redundant AoIP",
        "SMAART v9 Analyzer",
      ],
    },
    {
      id: 2,
      title: "Freeground Music Festival",
      subtitle: "Dual-Stage Live Sound Engineering & Headline FOH Mixing",
      category: "Festival Audio Production",
      image: "/img/nishan_digico_arena.jpeg",
      date: "11.2024",
      role: "FOH Engineer & Systems Coordinator",
      duration: "1 Week",
      location: "India",
      description:
        "Delivered Front-of-House (FOH) and monitor engineering across dual stages for tens of thousands of music lovers at the Freeground Music Festival. Engineered pristine mixes for high-energy live bands, indie acts, and headline artists.",
      challenge:
        "Strict 15-minute changeovers between diverse live acts, varied stage plots, and complex multi-instrument patches while keeping dynamic range balanced across massive outdoor festival grounds.",
      solution:
        "Pre-programmed show files and scene automation on AVID Venue S6L and DiGiCo consoles. Streamlined stage patching using standardized 48-channel digital splitters, reducing soundcheck times by 30% and delivering articulate mixes with pristine low-end control.",
      gear: [
        "AVID Venue S6L-24C",
        "DiGiCo SD-Series",
        "D&B audiotechnik J-Series",
        "Sennheiser 6000 Wireless",
        "Waves SoundGrid Extreme",
        "Pro Tools Multitrack",
      ],
    },
    {
      id: 3,
      title: "Blooming Green Festival",
      subtitle: "Technical & Production Head",
      category: "Festival Production Leadership",
      image: "/img/nishan_blooming_green.jpeg",
      date: "01.2025",
      role: "Technical & Production Head",
      duration: "3 Weeks",
      location: "Kerala, India",
      description:
        "Served as Technical and Production Head for the Blooming Green Festival. Oversaw end-to-end technical production, acoustic design, lighting coordination, stage infrastructure, and electrical distribution for the eco-conscious live music festival.",
      challenge:
        "Eco-sensitive outdoor venue required rigorous noise containment near residential peripheries while maintaining full immersive sound pressure levels on the main dance lawn. Energy-efficient power distribution was essential.",
      solution:
        "Engineered a cardioid subwoofer array using Soundvision simulation, attenuating 18 dB of rear low-frequency spill. Supervised safe three-phase generator load balancing utilizing my certified electrical engineering expertise.",
      gear: [
        "L-Acoustics K3 & KS28 Cardioid Subs",
        "Allen & Heath dLive S7000",
        "Soundvision 3D Prediction",
        "SMAART SPL Monitoring",
        "3-Phase Power Balancing",
      ],
    },
    {
      id: 4,
      title: "Bread Festival Abu Dhabi",
      subtitle: "International Live Festival Audio Crew",
      category: "International Live Production",
      image: "/img/nishan_quantum_foh.jpeg",
      date: "04.2025 - 05.2025",
      role: "Sound Technician (Media Pro International)",
      duration: "4 Weeks",
      location: "Abu Dhabi & Dubai, UAE",
      description:
        "Executed multi-stage audio setup, precision cabling, RF frequency scanning, and stage mic deployment for international cultural events and live festival performances in the UAE with leading production firm Media Pro International.",
      challenge:
        "High outdoor ambient desert temperatures and demanding international production standards with strict daily schedules, diverse global artist lineups, and multi-language acoustic requirements.",
      solution:
        "Rigged and aligned L-Acoustics K1, K2, and Kara2 hangs with thermal compensation filters. Executed flawless RF wireless coordination and stage micing for global acoustic ensembles and headline acts.",
      gear: [
        "L-Acoustics K1 / K2 / Kara2",
        "LA Network Manager",
        "DiGiCo Quantum 338",
        "Yamaha PM10 Rivage",
        "Shure PSM1000 IEMs",
        "Dante AoIP",
      ],
    },
  ];

  // Artists worked with and mixed for
  const artistsWorkedWith = [
    "AR Rahman",
    "Shankar Mahadevan",
    "Agam",
    "Thaikkudam Bridge",
    "Avial",
    "When Chai Met Toast",
    "Euphoria",
    "Jonita Gandhi",
  ];

  const artistsMixedFor = [
    "Raghu Dixit",
    "Job Kurian",
    "Vasuki Vaibhav",
    "Sachin Warrier",
    "Mythri Iyer",
    "Frizzle D'Souza",
    "Jaskaran Singh",
    "Maithili Thakur",
  ];

  // All 8 authentic live sound engineer photos
  const galleryItems = [
    {
      title: "AVID Venue S6L Mixing Position",
      subtitle: "Hands on Faders • Multi-Channel Digital Mixing",
      image: "/img/nishan_hero_s6l.jpeg",
    },
    {
      title: "Outdoor Festival Stage Operations",
      subtitle: "Dual-Screen DiGiCo Quantum Setup Overlooking Crowd",
      image: "/img/nishan_outdoor_festival.jpeg",
    },
    {
      title: "Blooming Green Festival",
      subtitle: "Live Sound Mixing under Canopy • Eco-Stage",
      image: "/img/nishan_blooming_green.jpeg",
    },
    {
      title: "Concert Arena FOH Position",
      subtitle: "DiGiCo Console with Stage Lighting & LED Screens",
      image: "/img/nishan_digico_arena.jpeg",
    },
    {
      title: "Soundcheck & Mic Tuning",
      subtitle: "Vocal Microphone & Monitor Level Alignment",
      image: "/img/nishan_about.jpeg",
    },
    {
      title: "Live Band Soundcheck Session",
      subtitle: "Allen & Heath Console • Dynamic Instrument Balancing",
      image: "/img/nishan_console_soundcheck.jpeg",
    },
    {
      title: "DiGiCo Quantum 338 Station",
      subtitle: "Media Pro International Live Production • UAE",
      image: "/img/nishan_quantum_foh.jpeg",
    },
    {
      title: "Bread Festival Abu Dhabi Live Stage",
      subtitle: "International Production Crew & Array Tuning",
      image: "/img/proj_breadfest.jpg",
    },
  ];

  return (
    <>
      {/* Loader Start */}
      <div id="loader" className={`loader ${!loading ? "loaded" : ""}`}>
        <div className="loader__wrapper">
          <div className="loader__content">
            <div className="loader__count">
              <span className="count__text">{count}</span>
              <span className="count__percent">%</span>
            </div>
          </div>
        </div>
      </div>
      {/* Loader End */}

      {/* Floating Header Navigation Start */}
      <header id="header" className="header d-flex justify-content-center">
        <div className="header__navigation d-flex justify-content-start">
          <nav id="menu" className="menu">
            <ul className="menu__list d-flex justify-content-start">
              <li className="menu__item">
                <a
                  className={`menu__link btn ${activeSection === "home" ? "active" : ""}`}
                  href="#home"
                >
                  <span className="menu__caption">Home</span>
                  <i className="ph ph-house-simple"></i>
                </a>
              </li>
              <li className="menu__item">
                <a
                  className={`menu__link btn ${activeSection === "portfolio" ? "active" : ""}`}
                  href="#portfolio"
                >
                  <span className="menu__caption">Portfolio</span>
                  <i className="ph ph-squares-four"></i>
                </a>
              </li>
              <li className="menu__item">
                <a
                  className={`menu__link btn ${activeSection === "about" ? "active" : ""}`}
                  href="#about"
                >
                  <span className="menu__caption">About Me</span>
                  <i className="ph ph-user"></i>
                </a>
              </li>
              <li className="menu__item">
                <a
                  className={`menu__link btn ${activeSection === "services" ? "active" : ""}`}
                  href="#services"
                >
                  <span className="menu__caption">Services</span>
                  <i className="ph ph-faders"></i>
                </a>
              </li>
              <li className="menu__item">
                <a
                  className={`menu__link btn ${activeSection === "resume" ? "active" : ""}`}
                  href="#resume"
                >
                  <span className="menu__caption">Resume</span>
                  <i className="ph ph-article"></i>
                </a>
              </li>
              <li className="menu__item">
                <a
                  className={`menu__link btn ${activeSection === "contact" ? "active" : ""}`}
                  href="#contact"
                >
                  <span className="menu__caption">Contact</span>
                  <i className="ph ph-envelope"></i>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      {/* Floating Header Navigation End */}

      {/* Fixed Logo Start */}
      <div className="logo">
        <a href="#home" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <svg width="68" height="24" viewBox="0 0 135 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M10 32V8L25 24L40 8V32H32V18L25 25.5L18 18V32H10Z"
              fill={theme === "dark" ? "#ffffff" : "#151617"}
            />
            <path
              d="M55 32V8H63L78 26V8H86V32H78L63 14V32H55Z"
              fill={theme === "dark" ? "#ffffff" : "#151617"}
            />
            <circle cx="100" cy="28" r="5" fill="#FFBB00" />
          </svg>
          <span
            style={{
              fontFamily: "var(--_font-accent)",
              fontWeight: "700",
              fontSize: "1.4rem",
              letterSpacing: "2px",
              color: "var(--t-bright)",
              textTransform: "uppercase",
            }}
          >
            NISHAN
          </span>
        </a>
      </div>
      {/* Fixed Logo End */}

      {/* Fixed Color Switch Start */}
      <div className="color">
        <button
          id="color-switcher"
          className="color-switcher"
          type="button"
          role="switch"
          aria-label="light/dark mode"
          aria-checked={theme === "dark"}
          onClick={toggleTheme}
          style={{ cursor: "pointer" }}
        ></button>
      </div>
      {/* Fixed Color Switch End */}

      {/* 2026 Ambient Cursor Spotlight */}
      <div
        className="ambient-spotlight"
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
          opacity: mousePos.x > -500 ? 1 : 0,
        }}
      />

      {/* Page Content Start */}
      <main id="page-content" className="page-content">
        {/* ============================================================ */}
        {/* HERO SECTION (2026 Soundwave & Acoustic Visualizer)          */}
        {/* ============================================================ */}
        <section id="home" className="main home">
          <div className="main__intro">
            {/* Intro Background Start with Transparent 3D Cutouts (NO STONES) */}
            <div className="intro__background intro-bg-01">
              <div
                className="intro-bg-01__01"
                style={{
                  transform: `translate3d(0, ${scrollY * 0.16}px, 0)`,
                  willChange: "transform",
                }}
              >
                <img
                  src="/img/backgrounds/1200x1200_bg05.webp"
                  alt="AVID Venue S6L Live Audio Console"
                />
                <div className="intro-bg__shadow"></div>
              </div>
              <div
                className="intro-bg-01__02"
                style={{
                  transform: `translate3d(0, ${scrollY * -0.1}px, 0)`,
                  willChange: "transform",
                }}
              >
                <img
                  src="/img/backgrounds/1200x1200_bg06.webp"
                  alt="Studio Audio Monitoring"
                />
                <div className="intro-bg__shadow"></div>
              </div>
            </div>
            {/* Intro Background End */}

            <div className="container-fluid p-0 fullheight-desktop">
              <div className="row g-0 fullheight-desktop align-items-xl-stretch">
                <div className="col-12 col-xl-2"></div>
                <div className="col-12 col-xl-8 fullheight-desktop">
                  {/* Headline */}
                  <div id="headline" className="headline d-flex align-items-start flex-column loading-wrap">
                    <p className="headline__subtitle space-bottom scroll-reveal">
                      Hello!
                      <br />
                      I&apos;m Muhammad Nishan K N
                    </p>
                    <h1 className="headline__title scroll-reveal delay-1">
                      Sound
                      <br />
                      Engineer
                      <span className="audio-equalizer">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                      </span>
                    </h1>
                    <div className="headline__btn scroll-reveal delay-2">
                      <a className="btn btn-line-small icon-right slide-right-down" href="#portfolio">
                        <span className="btn-caption">Explore projects</span>
                        <i className="ph ph-arrow-down-right"></i>
                      </a>
                    </div>

                    {/* 2026 Live Audio Spectrum HUD */}
                    <div className="audio-hud-panel scroll-reveal delay-3">
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div className="audio-pulse-dot"></div>
                        <div>
                          <span className="audio-status-pill">Dante™ AoIP Online</span>
                          <div style={{ color: "var(--t-muted)", fontSize: "1.15rem", marginTop: "2px" }}>
                            96kHz · 64-Ch Float · 104.2 dB SPL
                          </div>
                        </div>
                      </div>
                      <div className="spectrum-bars">
                        {[50, 75, 45, 90, 70, 100, 60, 85, 40, 95, 75, 50, 85, 65, 90, 40].map((h, i) => (
                          <div
                            key={i}
                            className="spectrum-bar"
                            style={{
                              animationDelay: `${(i % 6) * 0.16}s`,
                              animationDuration: `${0.85 + (i % 4) * 0.22}s`,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-xl-2"></div>
              </div>
            </div>
          </div>

          {/* Main Section Media */}
          <div className="main__media media-grid-bottom">
            <div className="container-fluid p-0">
              <div className="row g-0">
                <div className="col-12 col-xl-2"></div>
                <div className="col-12 col-xl-8">
                  {/* Hero Showcase: Muhammad Nishan at AVID Venue S6L Console */}
                  <div className="content__block scroll-reveal-scale">
                    <div className="container-fluid p-0">
                      <div className="row g-0">
                        <div className="col-12">
                          <div
                            style={{
                              position: "relative",
                              borderRadius: "28px",
                              overflow: "hidden",
                              boxShadow: "0 35px 85px rgba(0,0,0,0.6)",
                              height: "560px",
                              border: "1px solid rgba(255, 255, 255, 0.12)",
                            }}
                          >
                            <img
                              src="/img/nishan_hero_s6l.jpeg"
                              alt="Muhammad Nishan at AVID Venue S6L Console"
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                objectPosition: "center 30%",
                                transform: `scale(${1 + scrollY * 0.00012})`,
                                transition: "transform 0.08s linear",
                              }}
                            />
                            <div
                              style={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                right: 0,
                                padding: "32px 36px",
                                background: "linear-gradient(to top, rgba(12,12,16,0.96) 0%, rgba(12,12,16,0.5) 60%, transparent 100%)",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-end",
                                flexWrap: "wrap",
                                gap: "16px",
                              }}
                            >
                              <div>
                                <span style={{ color: "#FFBB00", fontWeight: "600", fontSize: "1.3rem", textTransform: "uppercase", letterSpacing: "1px" }}>
                                  Live Audio Engineering
                                </span>
                                <h3 style={{ color: "#fff", fontSize: "2.6rem", fontWeight: "700", marginTop: "4px" }}>
                                  Muhammad Nishan at AVID Venue S6L Console
                                </h3>
                              </div>
                              <span className="artist-badge" style={{ borderColor: "#FFBB00", color: "#FFBB00" }}>
                                <i className="ph ph-faders"></i> FOH Specialist
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Blockquote */}
                  <div className="content__block large-text-block scroll-reveal">
                    <div className="container-fluid p-0">
                      <div className="row g-0">
                        <div className="col-12">
                          <blockquote className="reveal-type" style={{ fontSize: "2.5rem", lineHeight: "1.4" }}>
                            Sound is the invisible architecture of live emotion. From stadium line arrays to
                            intimate monitor mixes, I engineer precision, clarity, and visceral energy for every performance.
                          </blockquote>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-xl-2"></div>

                {/* Marquee Ticker Ribbon */}
                <div className="media__fullwidth" style={{ overflow: "hidden" }}>
                  <div className="continuous-marquee">
                    <div style={{ display: "flex", alignItems: "center", gap: "30px", padding: "16px 0" }}>
                      <span className="artist-badge"><i className="ph ph-faders"></i> AVID VENUE S6L</span>
                      <span className="artist-badge"><i className="ph ph-speaker-high"></i> L-ACOUSTICS K1 / K2 / K3</span>
                      <span className="artist-badge"><i className="ph ph-broadcast"></i> DANTE LEVEL 2 CERTIFIED</span>
                      <span className="artist-badge"><i className="ph ph-waveform"></i> SMAART v9 ACOUSTICS</span>
                      <span className="artist-badge"><i className="ph ph-radio"></i> RF WIRELESS (SHURE / SENNHEISER)</span>
                      <span className="artist-badge"><i className="ph ph-soundbar"></i> D&amp;B AUDIOTECHNIK</span>
                      <span className="artist-badge"><i className="ph ph-sliders"></i> DIGICO QUANTUM 338</span>
                      <span className="artist-badge"><i className="ph ph-record"></i> PRO TOOLS MULTITRACK</span>

                      {/* Duplicate for seamless loop */}
                      <span className="artist-badge"><i className="ph ph-faders"></i> AVID VENUE S6L</span>
                      <span className="artist-badge"><i className="ph ph-speaker-high"></i> L-ACOUSTICS K1 / K2 / K3</span>
                      <span className="artist-badge"><i className="ph ph-broadcast"></i> DANTE LEVEL 2 CERTIFIED</span>
                      <span className="artist-badge"><i className="ph ph-waveform"></i> SMAART v9 ACOUSTICS</span>
                      <span className="artist-badge"><i className="ph ph-radio"></i> RF WIRELESS (SHURE / SENNHEISER)</span>
                      <span className="artist-badge"><i className="ph ph-soundbar"></i> D&amp;B AUDIOTECHNIK</span>
                      <span className="artist-badge"><i className="ph ph-sliders"></i> DIGICO QUANTUM 338</span>
                      <span className="artist-badge"><i className="ph ph-record"></i> PRO TOOLS MULTITRACK</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Hero Section End */}

        {/* ============================================================ */}
        {/* PORTFOLIO SECTION (2026 Stacking Cards Scroll Animation)      */}
        {/* ============================================================ */}
        <section id="portfolio" className="inner inner-stack-bottom no-padding-top portfolio">
          <div className="inner__wrapper">
            <div className="container-fluid p-0">
              <div className="row g-0 justify-content-center">
                <div className="col-12 col-xl-10">
                  <div className="inner__content">
                    <div style={{ textAlign: "center", marginBottom: "60px" }} className="scroll-reveal">
                      <span className="section-name" style={{ display: "inline-flex", gap: "8px", alignItems: "center" }}>
                        <span>Flagship Productions</span>
                        <i className="ph ph-arrow-down-right"></i>
                      </span>
                      <h2 style={{ fontSize: "4.2rem", fontWeight: "700", marginTop: "12px", letterSpacing: "-0.5px" }}>
                        Major Arena, Stadium &amp; Festival Productions
                      </h2>
                      <p style={{ color: "var(--t-muted)", fontSize: "1.6rem", maxWidth: "700px", margin: "14px auto 0" }}>
                        Experience the 2026 stacking scroll deck. Click any card to inspect the full technical casestudy.
                      </p>
                    </div>

                    {/* Stacking Cards Container */}
                    <div className="portfolio-deck-wrapper">
                      <div className="portfolio-deck">
                        {projects.map((proj) => (
                          <div
                            className="portfolio-card"
                            key={proj.id}
                            onClick={() => setActiveModal(proj)}
                          >
                            <div className="card-shine"></div>
                            <div className="portfolio-card__content">
                              <div>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                                  <span className="card-index-pill">0{proj.id} / 04</span>
                                  <span
                                    style={{
                                      padding: "6px 14px",
                                      borderRadius: "999px",
                                      background: "rgba(255, 187, 0, 0.14)",
                                      border: "1px solid #FFBB00",
                                      color: "#FFBB00",
                                      fontSize: "1.2rem",
                                      fontWeight: "700",
                                      letterSpacing: "1px",
                                      textTransform: "uppercase",
                                    }}
                                  >
                                    {proj.category}
                                  </span>
                                  <span style={{ color: "var(--t-muted)", fontSize: "1.3rem" }}>
                                    {proj.date}
                                  </span>
                                </div>
                                <h3 style={{ fontSize: "3.2rem", fontWeight: "700", lineHeight: "1.2", marginBottom: "14px", color: "var(--t-bright)" }}>
                                  {proj.title}
                                </h3>
                                <p style={{ color: "var(--t-medium)", fontSize: "1.6rem", lineHeight: "1.6", marginBottom: "24px" }}>
                                  {proj.subtitle}
                                </p>
                                <div style={{ display: "flex", gap: "24px", marginBottom: "24px", flexWrap: "wrap" }}>
                                  <div>
                                    <span style={{ fontSize: "1.2rem", color: "var(--t-muted)", display: "block", textTransform: "uppercase" }}>Role</span>
                                    <strong style={{ fontSize: "1.4rem", color: "var(--t-bright)" }}>{proj.role}</strong>
                                  </div>
                                  <div>
                                    <span style={{ fontSize: "1.2rem", color: "var(--t-muted)", display: "block", textTransform: "uppercase" }}>Location</span>
                                    <strong style={{ fontSize: "1.4rem", color: "var(--t-bright)" }}>{proj.location}</strong>
                                  </div>
                                </div>
                              </div>
                              <div style={{ marginTop: "16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
                                <span className="btn btn-default hover-default" style={{ pointerEvents: "none" }}>
                                  <em></em>
                                  <span className="btn-caption">View Technical Casestudy</span>
                                </span>
                                <span style={{ fontSize: "1.2rem", color: "var(--t-muted)", letterSpacing: "1px" }}>
                                  <i className="ph-bold ph-waveform" style={{ color: "#FFBB00", marginRight: "6px" }}></i>
                                  {proj.gear[0]}
                                </span>
                              </div>
                            </div>
                            <div className="portfolio-card__media">
                              <img
                                src={proj.image}
                                alt={proj.title}
                              />
                              <div className="portfolio-card__gradient" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ============================================================ */}
            {/* "BUT WAIT... THERE'S MORE!" - ARTISTS & REAL PHOTOS GALLERY */}
            {/* ============================================================ */}
            <div className="project__block grid-block no-margin" style={{ padding: "110px 0 40px" }}>
              <div className="container-fluid p-0">
                <div className="row g-0 justify-content-center text-center">
                  <div className="col-12 col-xl-10">
                    <div className="scroll-reveal">
                      <h3 className="headline__portfolio" style={{ fontSize: "4rem", marginBottom: "16px" }}>
                        Artists &amp; Bands Worked With
                      </h3>
                      <p style={{ color: "var(--t-muted)", fontSize: "1.6rem", marginBottom: "34px" }}>
                        Live sound engineering and multi-stage festival production collaborations:
                      </p>
                      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", marginBottom: "55px" }}>
                        {artistsWorkedWith.map((artist, idx) => (
                          <span className="artist-badge" key={idx}>
                            <i className="ph ph-star-fill"></i> {artist}
                          </span>
                        ))}
                        <span className="artist-badge" style={{ borderColor: "#FFBB00", color: "#FFBB00" }}>
                          <i className="ph ph-plus-circle"></i> &amp; Many More
                        </span>
                      </div>
                    </div>

                    <div className="scroll-reveal delay-1">
                      <h3 className="headline__portfolio" style={{ fontSize: "3.5rem", marginBottom: "16px" }}>
                        Mixed For Live Acts &amp; Ensembles
                      </h3>
                      <p style={{ color: "var(--t-muted)", fontSize: "1.6rem", marginBottom: "34px" }}>
                        Front-of-House and monitor mixing delivered with clinical sonic precision for:
                      </p>
                      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", marginBottom: "75px" }}>
                        {artistsMixedFor.map((artist, idx) => (
                          <span className="artist-badge" key={idx}>
                            <i className="ph ph-microphone-stage"></i> {artist}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Section heading for authentic photo gallery */}
                    <div className="scroll-reveal delay-2" style={{ textAlign: "center", marginBottom: "45px" }}>
                      <span className="section-name" style={{ display: "inline-flex", gap: "8px", alignItems: "center" }}>
                        <span>On The Road &amp; Behind The Consoles</span>
                        <i className="ph ph-camera"></i>
                      </span>
                      <h3 style={{ fontSize: "3.4rem", fontWeight: "700", marginTop: "12px" }}>
                        Live Sound Engineering in Action
                      </h3>
                      <p style={{ color: "var(--t-muted)", fontSize: "1.6rem" }}>
                        Authentic moments across soundchecks, arena tours, and festival stages.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 8-Photo Live Sound Grid with Muhammad Nishan's authentic photos */}
                <div className="row g-4 justify-content-center">
                  {galleryItems.map((item, index) => (
                    <div
                      className="col-12 col-md-6 col-lg-3 grid-item scroll-reveal"
                      key={index}
                      style={{ transitionDelay: `${(index % 4) * 0.12}s` }}
                    >
                      <div className="gallery-card">
                        <div className="card-shine"></div>
                        <img src={item.image} alt={item.title} />
                        <div className="gallery-card__overlay">
                          <span className="gallery-card__subtitle">{item.subtitle}</span>
                          <h4 className="gallery-card__title">{item.title}</h4>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Portfolio Section End */}

        {/* ============================================================ */}
        {/* ABOUT ME SECTION                                             */}
        {/* ============================================================ */}
        <section id="about" className="inner inner-grid-bottom about">
          <div className="inner__wrapper">
            <div className="container-fluid p-0">
              <div className="row g-0">
                {/* Section Name */}
                <div className="col-12 col-xl-2">
                  <div className="inner__name">
                    <div className="content__block name-block">
                      <span className="section-name icon-right scroll-reveal">
                        <span className="section-name-caption">About me</span>
                        <i className="ph ph-arrow-down-right"></i>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Section Content */}
                <div className="col-12 col-xl-8">
                  <div className="inner__content">
                    <div className="content__block section-grid-title">
                      <div className="block__descr scroll-reveal">
                        <h2 className="reveal-type">
                          Acoustic physics &amp;
                          <br />
                          live precision
                        </h2>
                      </div>
                    </div>

                    {/* Image: Authentic Photo of Muhammad Nishan with Mic & Headphones */}
                    <div className="content__block grid-block scroll-reveal">
                      <div className="container-fluid p-0">
                        <div className="row g-0">
                          <div className="col-12 grid-item">
                            <div
                              style={{
                                position: "relative",
                                borderRadius: "28px",
                                overflow: "hidden",
                                height: "560px",
                                boxShadow: "0 30px 70px rgba(0,0,0,0.55)",
                                border: "1px solid rgba(255, 255, 255, 0.1)",
                              }}
                            >
                              <img
                                src="/img/nishan_about.jpeg"
                                alt="Muhammad Nishan K N - Live Sound Engineer"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                  objectPosition: "center 22%",
                                }}
                              />
                              <div
                                style={{
                                  position: "absolute",
                                  bottom: 0,
                                  left: 0,
                                  right: 0,
                                  padding: "28px 34px",
                                  background: "linear-gradient(to top, rgba(12,12,16,0.95) 0%, transparent 100%)",
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  flexWrap: "wrap",
                                  gap: "14px",
                                }}
                              >
                                <div>
                                  <h4 style={{ color: "#fff", fontSize: "2.4rem", fontWeight: "700" }}>Muhammad Nishan K N</h4>
                                  <p style={{ color: "#FFBB00", fontSize: "1.4rem" }}>Sound Engineer • AVID Venue S6L Specialist</p>
                                </div>
                                <span className="artist-badge">
                                  <i className="ph ph-check-circle"></i> 7+ Yrs Experience
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Narrative & Bio */}
                    <div className="content__block grid-block scroll-reveal">
                      <div className="container-fluid p-0">
                        <div className="row g-0 justify-content-between">
                          <div className="col-12 col-md-8 col-lg-7 col-xxl-9 grid-item about-descr pre-grid">
                            <p className="about-descr__text type-basic-160lh">
                              Dynamic and results-driven Sound Engineer with 7+ years of freelance and professional experience
                              in front-of-house (FOH) mixing, monitor mixing, live multitrack recording, and electro-acoustic system design.
                              My background combines rigorous academic training with a <strong>BSc in Physics</strong> and professional live sound
                              certifications from <strong>Audio Academy, Bangalore</strong>, enabling me to approach acoustics with mathematical precision
                              and deep musical intuition.
                            </p>
                            <p className="about-descr__text type-basic-160lh" style={{ marginTop: "18px" }}>
                              Proficient in deploying and optimizing high-end systems including L-Acoustics (K1, K2, K3, Kara2),
                              D&amp;B audiotechnik, DiGiCo Quantum, and AVID Venue S6L desks. Whether managing multi-stage arena audio for the WPL 2025
                              in Bangalore, executing international seminars in Dubai with Media Pro International, or coordinating complex RF wireless
                              spectra for headline festivals, I ensure artists and audiences experience pure, uncompromised sound.
                            </p>

                            <div style={{ marginTop: "30px", marginBottom: "30px" }}>
                              <h6 style={{ fontSize: "1.4rem", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "14px", color: "#FFBB00" }}>
                                Languages Spoken:
                              </h6>
                              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                <span className="artist-badge">English (Fluent)</span>
                                <span className="artist-badge">Malayalam (Native)</span>
                                <span className="artist-badge">Hindi (Proficient)</span>
                                <span className="artist-badge">Tamil (Basic)</span>
                              </div>
                            </div>

                            <div className="btn-group about-descr__btnholder">
                              <a
                                className="btn btn-default hover-default"
                                href="/img/Nishan.pdf"
                                download="Muhammad_Nishan_KN_CV.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <em></em>
                                <span className="btn-caption" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                                  <span>Download CV</span>
                                  <i className="ph-bold ph-download-simple"></i>
                                </span>
                              </a>
                            </div>
                          </div>

                          <div className="col-12 col-md-4 col-xxl-3 grid-item about-info pre-grid">
                            <div className="about-info__item">
                              <h6>Muhammad Nishan K N</h6>
                            </div>
                            <div className="about-info__item">
                              <h6>
                                <a className="link-inline text-link" href="tel:+919188370323">
                                  +91 9188370323
                                </a>
                              </h6>
                            </div>
                            <div className="about-info__item">
                              <h6>
                                <a className="link-inline text-link" href="mailto:muhammadnishan341@gmail.com">
                                  muhammadnishan341@gmail.com
                                </a>
                              </h6>
                            </div>
                            <div className="about-info__item">
                              <h6>
                                <span className="link-inline text-link">
                                  Mananthavady, Wayanad, Kerala 670645
                                </span>
                              </h6>
                            </div>
                            <div className="about-info__item">
                              <h6>
                                <a
                                  className="link-inline text-link"
                                  href="https://www.linkedin.com"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  LinkedIn Profile <i className="ph ph-arrow-up-right"></i>
                                </a>
                              </h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-xl-2"></div>
              </div>
            </div>
          </div>
        </section>
        {/* About Section End */}

        {/* ============================================================ */}
        {/* SERVICES SECTION                                             */}
        {/* ============================================================ */}
        <section id="services" className="inner inner-stack-bottom services">
          <div className="inner__wrapper">
            <div className="container-fluid p-0">
              <div className="row g-0">
                <div className="col-12 col-xl-2">
                  <div className="inner__name">
                    <div className="content__block name-block">
                      <span className="section-name icon-right scroll-reveal">
                        <span className="section-name-caption">Services</span>
                        <i className="ph ph-arrow-down-right"></i>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-xl-8">
                  <div className="inner__content">
                    <div className="content__block pre-stack-text-block scroll-reveal">
                      <div className="block__descr">
                        <h2 className="reveal-type">
                          Engineering
                          <br />
                          impactful live sound
                        </h2>
                        <p className="h2__text type-basic-160lh">
                          Comprehensive audio engineering capabilities tailored for stadium tours, music festivals,
                          broadcast productions, and high-stakes live performances.
                        </p>
                        <br />
                        <br />
                      </div>
                    </div>

                    {/* Services Cards Grid */}
                    <div className="content__block grid-block">
                      <div className="container-fluid p-0">
                        <div className="row g-0 align-items-stretch cards">
                          {/* Card 1 */}
                          <div className="col-12 col-md-6 cards__item grid-item scroll-reveal">
                            <div className="cards__card d-flex flex-column" style={{ height: "100%", padding: "38px 32px" }}>
                              <div className="cards__descr">
                                <div style={{ color: "#FFBB00", fontSize: "2.8rem", marginBottom: "16px" }}>
                                  <i className="ph ph-faders"></i>
                                </div>
                                <h3 className="cards__title">
                                  Front of House (FOH)
                                  <br />
                                  Mixing
                                </h3>
                                <br />
                                <p className="cards__text type-basic-160lh">
                                  Sculpting transparent, energetic, and powerful live sound balances for massive audiences.
                                  Mastery over dynamic EQ, parallel compression, multitrack grouping, and vocal clarity in challenging acoustic environments.
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Card 2 */}
                          <div className="col-12 col-md-6 cards__item grid-item scroll-reveal delay-1">
                            <div className="cards__card d-flex flex-column" style={{ height: "100%", padding: "38px 32px" }}>
                              <div className="cards__descr">
                                <div style={{ color: "#FFBB00", fontSize: "2.8rem", marginBottom: "16px" }}>
                                  <i className="ph ph-headphones"></i>
                                </div>
                                <h3 className="cards__title">
                                  Monitor Mixing &amp;
                                  <br />
                                  RF Coordination
                                </h3>
                                <br />
                                <p className="cards__text type-basic-160lh">
                                  Custom in-ear monitor (IEM) mixes and stage wedges tailored to each artist’s preference.
                                  Advanced RF spectrum coordination using Shure Wireless Workbench and Sennheiser WSM to eliminate dropouts and intermodulation.
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Card 3 */}
                          <div className="col-12 col-md-6 cards__item grid-item scroll-reveal delay-2">
                            <div className="cards__card d-flex flex-column" style={{ height: "100%", padding: "38px 32px" }}>
                              <div className="cards__descr">
                                <div style={{ color: "#FFBB00", fontSize: "2.8rem", marginBottom: "16px" }}>
                                  <i className="ph ph-waveform"></i>
                                </div>
                                <h3 className="cards__title">
                                  System Design &amp;
                                  <br />
                                  Optimization
                                </h3>
                                <br />
                                <p className="cards__text type-basic-160lh">
                                  Venue acoustic modeling and line array prediction using Soundvision and MAPP XT.
                                  Real-time system phase and frequency alignment with SMAART v9, ensuring coherent coverage and punchy low-end across every seat.
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Card 4 */}
                          <div className="col-12 col-md-6 cards__item grid-item scroll-reveal delay-3">
                            <div className="cards__card d-flex flex-column" style={{ height: "100%", padding: "38px 32px" }}>
                              <div className="cards__descr">
                                <div style={{ color: "#FFBB00", fontSize: "2.8rem", marginBottom: "16px" }}>
                                  <i className="ph ph-broadcast"></i>
                                </div>
                                <h3 className="cards__title">
                                  Broadcast Audio &amp;
                                  <br />
                                  Dante Networking
                                </h3>
                                <br />
                                <p className="cards__text type-basic-160lh">
                                  Certified Dante Level 2 networking across gigabit switches for zero-latency digital distribution.
                                  Pro Tools multitrack recording and dedicated broadcast feed mixing for live streaming and televised events.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-xl-2"></div>
              </div>
            </div>
          </div>
        </section>
        {/* Services Section End */}

        {/* ============================================================ */}
        {/* RESUME SECTION                                               */}
        {/* ============================================================ */}
        <section id="resume" className="inner inner-grid-bottom resume">
          <div className="inner__wrapper">
            <div className="container-fluid p-0">
              <div className="row g-0">
                <div className="col-12 col-xl-2">
                  <div className="inner__name">
                    <div className="content__block name-block">
                      <span className="section-name icon-right scroll-reveal">
                        <span className="section-name-caption">Resume</span>
                        <i className="ph ph-arrow-down-right"></i>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-xl-8">
                  <div className="inner__content">
                    <div className="content__block section-tagline-title scroll-reveal">
                      <div className="block__descr">
                        <h2 className="reveal-type">
                          Precision
                          <br />
                          with passion
                        </h2>
                        <p className="h2__text type-basic-160lh">
                          Over 7 years of hands-on experience designing and operating world-class audio gear across stadiums,
                          music festivals, and international venues throughout India and the UAE.
                        </p>
                        <div className="btn-group about-descr__btnholder" style={{ marginTop: "26px" }}>
                          <a
                            className="btn btn-default hover-default"
                            href="/img/Nishan.pdf"
                            download="Muhammad_Nishan_KN_CV.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <em></em>
                            <span className="btn-caption" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                              <span>Download CV</span>
                              <i className="ph-bold ph-download-simple"></i>
                            </span>
                          </a>
                        </div>
                      </div>
                    </div>
                    <br />
                    <br />

                    {/* Work Experience Timeline */}
                    <div className="content__block pre-text-items">
                      <div className="block__subtitle scroll-reveal">
                        <p className="tagline-chapter">Work experience</p>
                      </div>

                      <div className="container-fluid p-0 resume-lines">
                        <div className="resume-divider"></div>

                        {/* Experience 1 */}
                        <div className="row g-0 resume-lines__item scroll-reveal">
                          <div className="col-12 col-md-4 col-lg-2">
                            <p className="resume-lines__date type-basic-160lh">04/2025 – 05/2025</p>
                          </div>
                          <div className="col-12 col-md-4 col-lg-5">
                            <h4 className="resume-lines__title">Sound Technician</h4>
                            <p className="resume-lines__source small">Media Pro International • Dubai, UAE</p>
                          </div>
                          <div className="col-12 col-md-4 col-lg-5">
                            <p className="resume-lines__descr type-basic-160lh">
                              Designed and executed multi-stage audio setups with L-Acoustics (K1, K2, K3, Kara2). Completed
                              international seminars and live festivals with precision, deploying complex micing and cabling under tight timelines.
                            </p>
                          </div>
                        </div>
                        <div className="resume-divider"></div>

                        {/* Experience 2 */}
                        <div className="row g-0 resume-lines__item scroll-reveal">
                          <div className="col-12 col-md-4 col-lg-2">
                            <p className="resume-lines__date type-basic-160lh">04/2019 – Present</p>
                          </div>
                          <div className="col-12 col-md-4 col-lg-5">
                            <h4 className="resume-lines__title">Sound Engineer (Freelance)</h4>
                            <p className="resume-lines__source small">India &amp; UAE</p>
                          </div>
                          <div className="col-12 col-md-4 col-lg-5">
                            <p className="resume-lines__descr type-basic-160lh">
                              Delivered professional-grade FOH and monitor mixing. Oversaw system design and technical coordination
                              for diverse live events. Deployed major systems including D&amp;B, Adamson, JBL, Meyer, and RCF with specialized RF wireless frequency management.
                            </p>
                          </div>
                        </div>
                        <div className="resume-divider"></div>

                        {/* Experience 3 */}
                        <div className="row g-0 resume-lines__item scroll-reveal">
                          <div className="col-12 col-md-4 col-lg-2">
                            <p className="resume-lines__date type-basic-160lh">12/2023 – 03/2025</p>
                          </div>
                          <div className="col-12 col-md-4 col-lg-5">
                            <h4 className="resume-lines__title">Sound Technician</h4>
                            <p className="resume-lines__source small">Salam Sounds • Kottakkal, Kerala</p>
                          </div>
                          <div className="col-12 col-md-4 col-lg-5">
                            <p className="resume-lines__descr type-basic-160lh">
                              Managed live audio at large-scale events, including a 15-artist festival in Kochi. Handled Pro Tools-based
                              multitrack recording and resolved real-time audio issues ensuring uninterrupted stage performances.
                            </p>
                          </div>
                        </div>
                        <div className="resume-divider"></div>

                        {/* Experience 4 */}
                        <div className="row g-0 resume-lines__item scroll-reveal">
                          <div className="col-12 col-md-4 col-lg-2">
                            <p className="resume-lines__date type-basic-160lh">04/2022 – Present</p>
                          </div>
                          <div className="col-12 col-md-4 col-lg-5">
                            <h4 className="resume-lines__title">Production Coordinator</h4>
                            <p className="resume-lines__source small">Freelance • Various Locations</p>
                          </div>
                          <div className="col-12 col-md-4 col-lg-5">
                            <p className="resume-lines__descr type-basic-160lh">
                              Supervised full event audio production and equipment integration. Improved technical workflows,
                              reducing artist soundcheck time by 30% across multiple festivals.
                            </p>
                          </div>
                        </div>
                        <div className="resume-divider"></div>

                        {/* Experience 5 */}
                        <div className="row g-0 resume-lines__item scroll-reveal">
                          <div className="col-12 col-md-4 col-lg-2">
                            <p className="resume-lines__date type-basic-160lh">10/2023 – 12/2023</p>
                          </div>
                          <div className="col-12 col-md-4 col-lg-5">
                            <h4 className="resume-lines__title">Sound Technician</h4>
                            <p className="resume-lines__source small">Ashoka AVL Solutions</p>
                          </div>
                          <div className="col-12 col-md-4 col-lg-5">
                            <p className="resume-lines__descr type-basic-160lh">
                              Delivered stage tech services, signal routing, and live sound enforcement for public and corporate events.
                            </p>
                          </div>
                        </div>
                        <div className="resume-divider"></div>

                        {/* Experience 6 */}
                        <div className="row g-0 resume-lines__item scroll-reveal">
                          <div className="col-12 col-md-4 col-lg-2">
                            <p className="resume-lines__date type-basic-160lh">Earlier</p>
                          </div>
                          <div className="col-12 col-md-4 col-lg-5">
                            <h4 className="resume-lines__title">Electrician &amp; Power Systems</h4>
                            <p className="resume-lines__source small">Freelance • Various Locations</p>
                          </div>
                          <div className="col-12 col-md-4 col-lg-5">
                            <p className="resume-lines__descr type-basic-160lh">
                              Designed and installed safe, energy-efficient electrical systems for residential and commercial spaces,
                              providing foundational mastery over 3-phase generator loads and live event power distribution.
                            </p>
                          </div>
                        </div>
                        <div className="resume-divider"></div>
                      </div>
                    </div>

                    {/* Education */}
                    <div className="content__block pre-text-items" style={{ marginTop: "60px" }}>
                      <div className="block__subtitle scroll-reveal">
                        <p className="tagline-chapter">My education</p>
                      </div>

                      <div className="container-fluid p-0 resume-lines">
                        <div className="resume-divider"></div>

                        <div className="row g-0 resume-lines__item scroll-reveal">
                          <div className="col-12 col-md-4 col-lg-2">
                            <p className="resume-lines__date type-basic-160lh">2024 – 2025</p>
                          </div>
                          <div className="col-12 col-md-4 col-lg-5">
                            <h4 className="resume-lines__title">Diploma in Recording Arts &amp; Live Sound Engineering</h4>
                            <p className="resume-lines__source small">Audio Academy • Bangalore</p>
                          </div>
                          <div className="col-12 col-md-4 col-lg-5">
                            <p className="resume-lines__descr type-basic-160lh">
                              Comprehensive professional training in console workflows (AVID, DiGiCo, Yamaha), line array acoustic optimization,
                              studio multitrack mixing, mastering, and RF wireless management.
                            </p>
                          </div>
                        </div>
                        <div className="resume-divider"></div>

                        <div className="row g-0 resume-lines__item scroll-reveal">
                          <div className="col-12 col-md-4 col-lg-2">
                            <p className="resume-lines__date type-basic-160lh">2020 – 2023</p>
                          </div>
                          <div className="col-12 col-md-4 col-lg-5">
                            <h4 className="resume-lines__title">BSc in Physics</h4>
                            <p className="resume-lines__source small">Government College Mananthavady • University of Kannur</p>
                          </div>
                          <div className="col-12 col-md-4 col-lg-5">
                            <p className="resume-lines__descr type-basic-160lh">
                              In-depth study of wave mechanics, sound propagation, thermodynamics, and electromagnetism,
                              forming the quantitative scientific bedrock for acoustic system design and phase alignment.
                            </p>
                          </div>
                        </div>
                        <div className="resume-divider"></div>
                      </div>
                    </div>

                    {/* Certifications */}
                    <div className="content__block pre-text-items scroll-reveal" style={{ marginTop: "60px" }}>
                      <div className="block__subtitle">
                        <p className="tagline-chapter">Professional Certifications</p>
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", marginTop: "16px" }}>
                        <div className="tool-pill" style={{ borderColor: "#FFBB00" }}>
                          <i className="ph-bold ph-certificate" style={{ color: "#FFBB00" }}></i> AVID Venue Specialist
                        </div>
                        <div className="tool-pill" style={{ borderColor: "#FFBB00" }}>
                          <i className="ph-bold ph-certificate" style={{ color: "#FFBB00" }}></i> AVID Venue Professional
                        </div>
                        <div className="tool-pill" style={{ borderColor: "#22c55e" }}>
                          <i className="ph-bold ph-check-circle" style={{ color: "#22c55e" }}></i> Dante Level 2 Certified
                        </div>
                        <div className="tool-pill">
                          <i className="ph-bold ph-shield-check"></i> CCTV &amp; Networking (Govt. Certified)
                        </div>
                      </div>
                    </div>

                    {/* Consoles and Tools Badges */}
                    <div className="content__block grid-block pre-text-items" style={{ marginTop: "60px" }}>
                      <div className="block__subtitle grid-block-subtitle scroll-reveal">
                        <p className="tagline-chapter">Consoles &amp; Acoustic Tools</p>
                      </div>

                      <div className="tools-cards d-flex justify-content-start flex-wrap">
                        <div className="tools-cards__item d-flex grid-item scroll-reveal">
                          <div className="tools-cards__card" style={{ width: "100%", padding: "22px" }}>
                            <h6 className="tools-cards__caption tagline-tool" style={{ color: "#FFBB00", fontSize: "1.8rem" }}>
                              AVID Venue S6L
                            </h6>
                            <p style={{ color: "var(--t-muted)", fontSize: "1.2rem", marginTop: "4px" }}>Certified Specialist</p>
                          </div>
                        </div>

                        <div className="tools-cards__item d-flex grid-item scroll-reveal delay-1">
                          <div className="tools-cards__card" style={{ width: "100%", padding: "22px" }}>
                            <h6 className="tools-cards__caption tagline-tool" style={{ fontSize: "1.8rem" }}>
                              DiGiCo Quantum
                            </h6>
                            <p style={{ color: "var(--t-muted)", fontSize: "1.2rem", marginTop: "4px" }}>Quantum 338 &amp; SD Series</p>
                          </div>
                        </div>

                        <div className="tools-cards__item d-flex grid-item scroll-reveal delay-2">
                          <div className="tools-cards__card" style={{ width: "100%", padding: "22px" }}>
                            <h6 className="tools-cards__caption tagline-tool" style={{ fontSize: "1.8rem" }}>
                              Allen &amp; Heath
                            </h6>
                            <p style={{ color: "var(--t-muted)", fontSize: "1.2rem", marginTop: "4px" }}>dLive &amp; SQ Series</p>
                          </div>
                        </div>

                        <div className="tools-cards__item d-flex grid-item scroll-reveal delay-3">
                          <div className="tools-cards__card" style={{ width: "100%", padding: "22px" }}>
                            <h6 className="tools-cards__caption tagline-tool" style={{ fontSize: "1.8rem" }}>
                              Yamaha &amp; Midas
                            </h6>
                            <p style={{ color: "var(--t-muted)", fontSize: "1.2rem", marginTop: "4px" }}>CL/QL &amp; PRO Series</p>
                          </div>
                        </div>

                        <div className="tools-cards__item d-flex grid-item scroll-reveal">
                          <div className="tools-cards__card" style={{ width: "100%", padding: "22px" }}>
                            <h6 className="tools-cards__caption tagline-tool" style={{ color: "#FFBB00", fontSize: "1.8rem" }}>
                              SMAART v9
                            </h6>
                            <p style={{ color: "var(--t-muted)", fontSize: "1.2rem", marginTop: "4px" }}>Real-time FFT Analysis</p>
                          </div>
                        </div>

                        <div className="tools-cards__item d-flex grid-item scroll-reveal delay-1">
                          <div className="tools-cards__card" style={{ width: "100%", padding: "22px" }}>
                            <h6 className="tools-cards__caption tagline-tool" style={{ fontSize: "1.8rem" }}>
                              Soundvision
                            </h6>
                            <p style={{ color: "var(--t-muted)", fontSize: "1.2rem", marginTop: "4px" }}>L-Acoustics 3D Prediction</p>
                          </div>
                        </div>

                        <div className="tools-cards__item d-flex grid-item scroll-reveal delay-2">
                          <div className="tools-cards__card" style={{ width: "100%", padding: "22px" }}>
                            <h6 className="tools-cards__caption tagline-tool" style={{ fontSize: "1.8rem" }}>
                              LA Network Manager
                            </h6>
                            <p style={{ color: "var(--t-muted)", fontSize: "1.2rem", marginTop: "4px" }}>Amplifier Telemetry &amp; EQ</p>
                          </div>
                        </div>

                        <div className="tools-cards__item d-flex grid-item scroll-reveal delay-3">
                          <div className="tools-cards__card" style={{ width: "100%", padding: "22px" }}>
                            <h6 className="tools-cards__caption tagline-tool" style={{ fontSize: "1.8rem" }}>
                              Pro Tools
                            </h6>
                            <p style={{ color: "var(--t-muted)", fontSize: "1.2rem", marginTop: "4px" }}>Live Multitrack Recording</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-xl-2"></div>
              </div>
            </div>

            {/* Follow Me Marquee Ribbon */}
            <div className="container-fluid p-0">
              <div className="row g-0">
                <div className="col-12">
                  <div className="content__block no-padding section-tagline-title" style={{ overflow: "hidden" }}>
                    <div className="continuous-marquee">
                      <div style={{ display: "flex", alignItems: "center", gap: "40px", padding: "18px 0" }}>
                        {[...Array(6)].map((_, i) => (
                          <div key={i} style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                            <span style={{ fontSize: "2.8rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2px" }}>
                              LET&apos;S MIX LIVE
                            </span>
                            <svg width="32" height="32" viewBox="0 0 92.3 93.1" fill="#FFBB00">
                              <rect x="45.7" width="2" height="93.1" />
                              <rect x="-0.4" y="46.1" width="93.1" height="2" />
                            </svg>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Socials Lines */}
              <div className="row g-0 justify-content-center">
                <div className="col-12 col-xl-8">
                  <div className="content__block">
                    <div className="block__subtitle scroll-reveal">
                      <p className="tagline-chapter">Connect &amp; Socials</p>
                    </div>

                    <ul className="socials-lines d-flex flex-column">
                      <li className="socials-lines__item scroll-reveal">
                        <div className="socials-lines__divider"></div>
                        <a
                          className="socials-lines__link d-flex align-items-center justify-content-between"
                          href="https://www.linkedin.com"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <h4>LinkedIn</h4>
                          <div className="socials-lines__icon d-flex">
                            <i className="ph ph-arrow-up-right"></i>
                          </div>
                        </a>
                        <div className="socials-lines__divider"></div>
                      </li>

                      <li className="socials-lines__item scroll-reveal">
                        <a
                          className="socials-lines__link d-flex align-items-center justify-content-between"
                          href="tel:+919188370323"
                        >
                          <h4>Phone (+91 9188370323)</h4>
                          <div className="socials-lines__icon d-flex">
                            <i className="ph ph-phone-call"></i>
                          </div>
                        </a>
                        <div className="socials-lines__divider"></div>
                      </li>

                      <li className="socials-lines__item scroll-reveal">
                        <a
                          className="socials-lines__link d-flex align-items-center justify-content-between"
                          href="mailto:muhammadnishan341@gmail.com"
                        >
                          <h4>Email (muhammadnishan341@gmail.com)</h4>
                          <div className="socials-lines__icon d-flex">
                            <i className="ph ph-envelope-simple"></i>
                          </div>
                        </a>
                        <div className="socials-lines__divider"></div>
                      </li>

                      <li className="socials-lines__item scroll-reveal">
                        <a
                          className="socials-lines__link d-flex align-items-center justify-content-between"
                          href="https://wa.me/919188370323"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <h4>WhatsApp</h4>
                          <div className="socials-lines__icon d-flex">
                            <i className="ph ph-whatsapp-logo"></i>
                          </div>
                        </a>
                        <div className="socials-lines__divider"></div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Resume Section End */}

        {/* ============================================================ */}
        {/* CONTACT SECTION                                              */}
        {/* ============================================================ */}
        <section id="contact" className="inner contact inner-grid-bottom no-padding-bottom">
          <div className="inner__wrapper">
            <div className="container-fluid p-0">
              <div className="row g-0">
                <div className="col-12 col-xl-2">
                  <div className="inner__name">
                    <div className="content__block name-block">
                      <span className="section-name icon-right scroll-reveal">
                        <span className="section-name-caption">Contact</span>
                        <i className="ph ph-arrow-down-right"></i>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-xl-8">
                  <div className="inner__content">
                    <div className="content__block section-form-title scroll-reveal">
                      <div className="block__descr">
                        <h2 className="reveal-type">Let&apos;s talk sound!</h2>
                        <p className="h2__text text-twothirds type-basic-160lh">
                          Planning a stadium tour, festival production, or looking for an AVID Venue S6L FOH / monitor engineer?
                          Drop me a line and let&apos;s bring sonic excellence to your stage.
                        </p>
                      </div>
                    </div>

                    {/* Contact Form */}
                    <div className="content__block grid-block pre-grid-items scroll-reveal">
                      <div className="form-container">
                        {formSubmitted && (
                          <div
                            className="toast-success"
                            style={{
                              background: "rgba(37, 211, 102, 0.12)",
                              border: "1px solid #25D366",
                              color: "#e6e6e6",
                              padding: "18px 22px",
                              borderRadius: "16px",
                              marginBottom: "28px",
                              display: "flex",
                              alignItems: "center",
                              gap: "14px",
                            }}
                          >
                            <i className="ph-bold ph-whatsapp-logo" style={{ fontSize: "2.8rem", color: "#25D366" }}></i>
                            <div>
                              <strong style={{ color: "#25D366", display: "block", fontSize: "1.5rem" }}>Redirecting to WhatsApp...</strong>
                              <span style={{ fontSize: "1.35rem", color: "var(--t-medium)" }}>
                                Your details have been pre-filled. If WhatsApp didn't open automatically,{" "}
                                <a
                                  href={`https://wa.me/919188370323?text=${encodeURIComponent(
                                    `🔥 *New Sound Engineering Inquiry*\n\n*Name:* ${formData.name}\n${formData.company ? `*Band / Company:* ${formData.company}\n` : ""
                                    }*Email:* ${formData.email}\n${formData.phone ? `*Phone:* ${formData.phone}\n` : ""
                                    }\n*Project Requirements:*\n${formData.message}`
                                  )}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ color: "#25D366", textDecoration: "underline", fontWeight: "600" }}
                                >
                                  click here to send on WhatsApp
                                </a>.
                              </span>
                            </div>
                          </div>
                        )}

                        <form className="form contact-form" onSubmit={handleSubmit}>
                          <div className="container-fluid p-0">
                            <div className="row gx-0">
                              <div className="col-12 col-md-6 form__item">
                                <input
                                  type="text"
                                  name="Name"
                                  placeholder="Your name*"
                                  required
                                  value={formData.name}
                                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                              </div>
                              <div className="col-12 col-md-6 form__item">
                                <input
                                  type="text"
                                  name="Company"
                                  placeholder="Band / Production Company"
                                  value={formData.company}
                                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                />
                              </div>
                              <div className="col-12 col-md-6 form__item">
                                <input
                                  type="email"
                                  name="E-mail"
                                  placeholder="Email*"
                                  required
                                  value={formData.email}
                                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                              </div>
                              <div className="col-12 col-md-6 form__item">
                                <input
                                  type="tel"
                                  name="Phone"
                                  placeholder="Phone / WhatsApp"
                                  value={formData.phone}
                                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                              </div>
                              <div className="col-12 form__item">
                                <textarea
                                  name="Message"
                                  placeholder="Tell me about your tour, festival, or sound requirements*"
                                  required
                                  value={formData.message}
                                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                ></textarea>
                              </div>
                              <div className="col-12 form__item">
                                <button className="btn btn-default hover-default" type="submit">
                                  <em></em>
                                  <span className="btn-caption" style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}>
                                    <span>Send via WhatsApp</span>
                                    <i className="ph-bold ph-whatsapp-logo" style={{ fontSize: "2rem", color: "#25D366" }}></i>
                                  </span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>

                    {/* Contact Details */}
                    <div className="content__block grid-block scroll-reveal">
                      <div className="container-fluid p-0 contact-data">
                        <div className="row g-0">
                          <div className="col-12 col-md-6 col-lg-3 contact-data__item grid-item">
                            <p className="contact-data__title tagline-chapter">Location</p>
                            <p className="contact-data__text small type-basic-160lh">
                              Mananthavady, Wayanad<br />Kerala 670645, India
                            </p>
                          </div>
                          <div className="col-12 col-md-6 col-lg-3 contact-data__item grid-item">
                            <p className="contact-data__title tagline-chapter">Direct Phone</p>
                            <p className="contact-data__text small type-basic-160lh">
                              <a className="link-small-160lh" href="tel:+919188370323">
                                +91 9188370323
                              </a>
                            </p>
                          </div>
                          <div className="col-12 col-md-6 col-lg-3 contact-data__item grid-item">
                            <p className="contact-data__title tagline-chapter">Email</p>
                            <p className="contact-data__text small type-basic-160lh">
                              <a className="link-small-160lh" href="mailto:muhammadnishan341@gmail.com">
                                muhammadnishan341@gmail.com
                              </a>
                            </p>
                          </div>
                          <div className="col-12 col-md-6 col-lg-3 contact-data__item grid-item">
                            <p className="contact-data__title tagline-chapter">Availability</p>
                            <p className="contact-data__text small type-basic-160lh">
                              India, UAE &amp; Global Tours<br />
                              <span style={{ color: "#22c55e", fontWeight: "600" }}>• Available for Bookings</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-xl-2"></div>
              </div>
            </div>

            {/* Footer Marquee */}
            <div className="footer footer-marquee" style={{ overflow: "hidden" }}>
              <div className="container-fluid p-0">
                <div className="row g-0">
                  <div className="col-12">
                    <div className="content__block no-padding">
                      <div className="continuous-marquee">
                        <div style={{ display: "flex", alignItems: "center", gap: "40px", padding: "22px 0" }}>
                          {[...Array(6)].map((_, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                              <a
                                href="mailto:muhammadnishan341@gmail.com"
                                style={{
                                  fontSize: "3.2rem",
                                  fontWeight: "700",
                                  textTransform: "uppercase",
                                  letterSpacing: "2px",
                                  color: "var(--t-bright)",
                                  textDecoration: "none",
                                }}
                              >
                                {i % 2 === 0 ? "Book Soundcheck?" : "Let's Mix Live!"}
                              </a>
                              <svg width="36" height="36" viewBox="0 0 92.3 93.1" fill="#FFBB00">
                                <rect x="45.7" width="2" height="93.1" />
                                <rect x="-0.4" y="46.1" width="93.1" height="2" />
                              </svg>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Contact Section End */}
      </main>
      {/* Page Content End */}

      {/* Bottom Background Audio Waves (NO STONES) */}
      <div className="bottom__background bottom-bg-01" style={{ opacity: 0.35 }}>
        <div className="bottom-bg-01__02">
          <img src="/img/backgrounds/audio_wave_bg1.svg" alt="Audio waveform pattern" />
        </div>
        <div className="bottom-bg-01__01">
          <img src="/img/backgrounds/audio_wave_bg2.svg" alt="Acoustic pattern" />
        </div>
      </div>

      {/* Floating To Top Button */}
      {showToTop && (
        <a
          href="#home"
          id="to-top"
          className="btn btn-to-top"
          style={{ opacity: 1, visibility: "visible", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <i className="ph ph-arrow-up"></i>
        </a>
      )}

      {/* Project Casestudy Modal Dialog */}
      {activeModal && (
        <div className="custom-modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="custom-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <button className="custom-modal-close" onClick={() => setActiveModal(null)}>
              <i className="ph ph-x"></i>
            </button>

            <div style={{ position: "relative", height: "460px", overflow: "hidden" }}>
              <img
                src={activeModal.image}
                alt={activeModal.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(14,14,18,0.96) 0%, rgba(14,14,18,0.4) 60%, transparent 100%)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  padding: "44px",
                }}
              >
                <span style={{ color: "#FFBB00", fontWeight: "600", fontSize: "1.4rem", textTransform: "uppercase", letterSpacing: "1.5px" }}>
                  {activeModal.category}
                </span>
                <h2 style={{ color: "#fff", fontSize: "3.4rem", fontWeight: "700", marginTop: "8px" }}>
                  {activeModal.title}
                </h2>
                <p style={{ color: "#ccc", fontSize: "1.6rem", marginTop: "6px" }}>{activeModal.subtitle}</p>
              </div>
            </div>

            <div style={{ padding: "44px" }}>
              {/* Project Meta Details */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                  gap: "16px",
                  paddingBottom: "28px",
                  borderBottom: "1px solid var(--stroke-elements, #333)",
                  marginBottom: "32px",
                }}
              >
                <div>
                  <p style={{ color: "var(--t-muted)", fontSize: "1.3rem", textTransform: "uppercase", letterSpacing: "1px" }}>Date</p>
                  <p style={{ fontWeight: "600", fontSize: "1.5rem", marginTop: "4px" }}>{activeModal.date}</p>
                </div>
                <div>
                  <p style={{ color: "var(--t-muted)", fontSize: "1.3rem", textTransform: "uppercase", letterSpacing: "1px" }}>Role</p>
                  <p style={{ fontWeight: "600", fontSize: "1.5rem", marginTop: "4px" }}>{activeModal.role}</p>
                </div>
                <div>
                  <p style={{ color: "var(--t-muted)", fontSize: "1.3rem", textTransform: "uppercase", letterSpacing: "1px" }}>Duration</p>
                  <p style={{ fontWeight: "600", fontSize: "1.5rem", marginTop: "4px" }}>{activeModal.duration}</p>
                </div>
                <div>
                  <p style={{ color: "var(--t-muted)", fontSize: "1.3rem", textTransform: "uppercase", letterSpacing: "1px" }}>Location</p>
                  <p style={{ fontWeight: "600", fontSize: "1.5rem", marginTop: "4px" }}>{activeModal.location}</p>
                </div>
              </div>

              {/* Overview */}
              <div style={{ marginBottom: "32px" }}>
                <h4 style={{ fontSize: "2.1rem", marginBottom: "12px", color: "var(--t-bright)" }}>Project Overview</h4>
                <p style={{ fontSize: "1.6rem", lineHeight: "1.7", color: "var(--t-medium)" }}>{activeModal.description}</p>
              </div>

              {/* The Challenge */}
              <div style={{ marginBottom: "32px" }}>
                <h4 style={{ fontSize: "2.1rem", marginBottom: "12px", color: "#FFBB00" }}>The Audio Challenge</h4>
                <p style={{ fontSize: "1.6rem", lineHeight: "1.7", color: "var(--t-medium)" }}>{activeModal.challenge}</p>
              </div>

              {/* The Solution */}
              <div style={{ marginBottom: "32px" }}>
                <h4 style={{ fontSize: "2.1rem", marginBottom: "12px", color: "var(--t-bright)" }}>Engineering Solution</h4>
                <p style={{ fontSize: "1.6rem", lineHeight: "1.7", color: "var(--t-medium)" }}>{activeModal.solution}</p>
              </div>

              {/* Gear Deployed */}
              <div>
                <h4 style={{ fontSize: "2.1rem", marginBottom: "16px", color: "var(--t-bright)" }}>Key Gear &amp; Systems Deployed</h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {activeModal.gear.map((g, i) => (
                    <span
                      key={i}
                      style={{
                        padding: "8px 18px",
                        background: "rgba(255, 187, 0, 0.12)",
                        border: "1px solid #FFBB00",
                        color: "#FFBB00",
                        borderRadius: "10px",
                        fontSize: "1.3rem",
                        fontWeight: "600",
                      }}
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ textAlign: "center", marginTop: "44px" }}>
                <a
                  className="btn btn-default hover-default"
                  href="#contact"
                  onClick={() => setActiveModal(null)}
                >
                  <em></em>
                  <span className="btn-caption">Inquire About Similar Production</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
