// Single source of truth for all portfolio copy.

export const contact = {
  name: "Muhammad Nishan K N",
  shortName: "Nishan",
  phone: "+91 9188370323",
  phoneHref: "tel:+919188370323",
  email: "muhammadnishan341@gmail.com",
  emailHref: "mailto:muhammadnishan341@gmail.com",
  whatsappNumber: "919188370323",
  whatsappHref: "https://wa.me/919188370323",
  linkedin: "https://www.linkedin.com",
  location: "Mananthavady, Wayanad, Kerala 670645",
  cv: "/img/Nishan.pdf",
};

export const navLinks = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

export const stats = [
  { value: 7, suffix: "+", label: "Years mixing live" },
  { value: 16, suffix: "+", label: "Headline artists & bands" },
  { value: 32, suffix: "+", label: "RF channels coordinated" },
  { value: 30, suffix: "%", label: "Faster soundchecks" },
];

export const gear = [
  "AVID Venue S6L",
  "L-Acoustics K1 / K2 / K3",
  "DiGiCo Quantum 338",
  "Dante Level 2",
  "SMAART v9",
  "d&b audiotechnik",
  "Shure Axient Digital",
  "Pro Tools Multitrack",
  "Allen & Heath dLive",
  "Soundvision",
];

export const disciplines = [
  "FOH Mixing",
  "Monitor Mixing",
  "RF Coordination",
  "System Design",
  "Dante Networking",
  "Live Multitrack Recording",
  "Broadcast Audio",
  "Production Management",
];

export const projects = [
  {
    id: 1,
    title: "WPL 2025",
    fullTitle: "AV Head — WPL 2025 (Bangalore)",
    subtitle: "Women's Premier League T20 · Stadium sound reinforcement & broadcast",
    category: "Stadium Audio & Broadcast",
    image: "/img/nishan_outdoor_festival.jpeg",
    date: "02.2025 – 03.2025",
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
    title: "Freeground Festival",
    fullTitle: "Freeground Music Festival",
    subtitle: "Dual-stage live sound engineering & headline FOH mixing",
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
      "d&b audiotechnik J-Series",
      "Sennheiser 6000 Wireless",
      "Waves SoundGrid Extreme",
      "Pro Tools Multitrack",
    ],
  },
  {
    id: 3,
    title: "Blooming Green",
    fullTitle: "Blooming Green Festival",
    subtitle: "Technical & production head for an eco-conscious music festival",
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
      "Engineered a cardioid subwoofer array using Soundvision simulation, attenuating 18 dB of rear low-frequency spill. Supervised safe three-phase generator load balancing utilizing certified electrical engineering expertise.",
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
    title: "Bread Festival",
    fullTitle: "Bread Festival Abu Dhabi",
    subtitle: "International live festival audio crew with Media Pro International",
    category: "International Live Production",
    image: "/img/nishan_quantum_foh.jpeg",
    date: "04.2025 – 05.2025",
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

export const artistsWorkedWith = [
  "AR Rahman",
  "Shankar Mahadevan",
  "Agam",
  "Thaikkudam Bridge",
  "Avial",
  "When Chai Met Toast",
  "Euphoria",
  "Jonita Gandhi",
];

export const artistsMixedFor = [
  "Raghu Dixit",
  "Job Kurian",
  "Vasuki Vaibhav",
  "Sachin Warrier",
  "Mythri Iyer",
  "Frizzle D'Souza",
  "Jaskaran Singh",
  "Maithili Thakur",
];

export const gallery = [
  {
    title: "AVID Venue S6L",
    subtitle: "Hands on faders · multi-channel digital mixing",
    image: "/img/nishan_hero_s6l.jpeg",
  },
  {
    title: "Outdoor Festival FOH",
    subtitle: "DiGiCo Quantum setup overlooking the grounds",
    image: "/img/nishan_outdoor_festival.jpeg",
  },
  {
    title: "Blooming Green",
    subtitle: "Live mixing under canopy · eco-stage",
    image: "/img/nishan_blooming_green.jpeg",
  },
  {
    title: "Concert Arena",
    subtitle: "DiGiCo console with stage lighting & LED",
    image: "/img/nishan_digico_arena.jpeg",
  },
  {
    title: "Soundcheck",
    subtitle: "Vocal mic & monitor level alignment",
    image: "/img/nishan_about.jpeg",
  },
  {
    title: "Live Band Session",
    subtitle: "Allen & Heath · dynamic instrument balancing",
    image: "/img/nishan_console_soundcheck.jpeg",
  },
  {
    title: "DiGiCo Quantum 338",
    subtitle: "Media Pro International · UAE",
    image: "/img/nishan_quantum_foh.jpeg",
  },
  {
    title: "Bread Festival Abu Dhabi",
    subtitle: "International production crew & array tuning",
    image: "/img/proj_breadfest.jpg",
  },
];

export const services = [
  {
    title: "Front of House Mixing",
    icon: "faders",
    text: "Sculpting transparent, energetic and powerful live balances for large audiences — dynamic EQ, parallel compression, multitrack grouping and vocal clarity in challenging rooms.",
    tags: ["S6L", "DiGiCo", "dLive"],
  },
  {
    title: "Monitor Mixing & RF",
    icon: "headphones",
    text: "Custom IEM and wedge mixes tailored to each artist, with RF spectrum coordination in Shure Wireless Workbench and Sennheiser WSM to eliminate dropouts and intermodulation.",
    tags: ["IEM", "Axient", "WSM"],
  },
  {
    title: "System Design & Optimisation",
    icon: "waveform",
    text: "Venue modelling and line-array prediction in Soundvision and MAPP XT, then real-time phase and frequency alignment with SMAART v9 for coherent coverage at every seat.",
    tags: ["Soundvision", "SMAART", "MAPP XT"],
  },
  {
    title: "Broadcast & Dante Networking",
    icon: "broadcast",
    text: "Certified Dante Level 2 networks for zero-latency distribution, plus Pro Tools multitrack recording and dedicated broadcast mixes for streamed and televised events.",
    tags: ["Dante", "Pro Tools", "Broadcast"],
  },
];

export const experience = [
  {
    date: "04/2025 – 05/2025",
    title: "Sound Technician",
    org: "Media Pro International · Dubai, UAE",
    text: "Designed and executed multi-stage audio setups with L-Acoustics (K1, K2, K3, Kara2). Delivered international seminars and live festivals, deploying complex micing and cabling under tight timelines.",
  },
  {
    date: "04/2019 – Present",
    title: "Sound Engineer (Freelance)",
    org: "India & UAE",
    text: "Professional FOH and monitor mixing, system design and technical coordination for diverse live events. Deployed d&b, Adamson, JBL, Meyer and RCF systems with specialised RF management.",
  },
  {
    date: "12/2023 – 03/2025",
    title: "Sound Technician",
    org: "Salam Sounds · Kottakkal, Kerala",
    text: "Managed live audio at large-scale events including a 15-artist festival in Kochi. Pro Tools multitrack recording and real-time troubleshooting for uninterrupted performances.",
  },
  {
    date: "04/2022 – Present",
    title: "Production Coordinator",
    org: "Freelance · Various locations",
    text: "Supervised full event audio production and equipment integration. Improved technical workflows, reducing artist soundcheck time by 30% across multiple festivals.",
  },
  {
    date: "10/2023 – 12/2023",
    title: "Sound Technician",
    org: "Ashoka AVL Solutions",
    text: "Stage tech services, signal routing and live sound reinforcement for public and corporate events.",
  },
  {
    date: "Earlier",
    title: "Electrician & Power Systems",
    org: "Freelance · Various locations",
    text: "Designed and installed safe, energy-efficient electrical systems — the foundation for confident 3-phase generator loads and live event power distribution.",
  },
];

export const education = [
  {
    date: "2024 – 2025",
    title: "Diploma in Recording Arts & Live Sound Engineering",
    org: "Audio Academy · Bangalore",
    text: "Console workflows (AVID, DiGiCo, Yamaha), line-array optimisation, studio multitrack mixing, mastering and RF wireless management.",
  },
  {
    date: "2020 – 2023",
    title: "BSc in Physics",
    org: "Government College Mananthavady · University of Kannur",
    text: "Wave mechanics, sound propagation, thermodynamics and electromagnetism — the quantitative bedrock for system design and phase alignment.",
  },
];

export const certifications = [
  "AVID Venue Specialist",
  "AVID Venue Professional",
  "Dante Level 2 Certified",
  "CCTV & Networking (Govt. Certified)",
];

export const tools = [
  { name: "AVID Venue S6L", note: "Certified specialist" },
  { name: "DiGiCo Quantum", note: "Quantum 338 & SD series" },
  { name: "Allen & Heath", note: "dLive & SQ series" },
  { name: "Yamaha & Midas", note: "CL/QL, Rivage & PRO series" },
  { name: "SMAART v9", note: "Real-time FFT analysis" },
  { name: "Soundvision", note: "L-Acoustics 3D prediction" },
  { name: "LA Network Manager", note: "Amp telemetry & EQ" },
  { name: "Pro Tools", note: "Live multitrack recording" },
];

export const languages = [
  "English — Fluent",
  "Malayalam — Native",
  "Hindi — Proficient",
  "Tamil — Basic",
];
