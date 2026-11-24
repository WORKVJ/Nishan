import localFont from "next/font/local";
import "./globals.css";

// Fonts are bundled in src/fonts (latin subset) so dev and builds never depend on Google's servers.
const sans = localFont({
  src: "../fonts/InterTight-Variable.woff2",
  weight: "100 900",
  variable: "--font-sans",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

const serif = localFont({
  src: [
    { path: "../fonts/InstrumentSerif-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/InstrumentSerif-Italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-serif",
  display: "swap",
  fallback: ["Georgia", "serif"],
});

const mono = localFont({
  src: "../fonts/JetBrainsMono-Variable.woff2",
  weight: "400 500",
  variable: "--font-mono",
  display: "swap",
  fallback: ["ui-monospace", "monospace"],
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://muhammadnishan.com"),
  title: "Muhammad Nishan K N | Sound Engineer | AVID Venue S6L Specialist | Live Audio Technician",
  description:
    "Dynamic and results-driven Sound Engineer with 7+ years of freelance and professional experience in FOH mixing, monitor mixing, live recording, and system design. Specialist in AVID Venue S6L, L-Acoustics, D&B, and Dante audio networking.",
  keywords:
    "Muhammad Nishan, Sound Engineer, AVID Venue S6L, Live Audio Technician, FOH Mixing, Monitor Mixing, L-Acoustics, D&B, Dante, Wayanad Kerala, Bangalore, UAE Dubai, AR Rahman, Shankar Mahadevan, WPL 2025",
  authors: [{ name: "Muhammad Nishan K N" }],
  openGraph: {
    title: "Muhammad Nishan K N - Live Sound Engineer & AVID S6L Specialist",
    description: "7+ Years Experience in FOH & Monitor Mixing, Tour Sound, Multitrack Recording & System Design.",
    url: "https://muhammadnishan.com",
    siteName: "Muhammad Nishan Portfolio",
    images: [
      {
        url: "/img/nishan_hero_s6l.jpeg",
        width: 840,
        height: 1120,
        alt: "Muhammad Nishan K N at an AVID Venue S6L console",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Muhammad Nishan K N | Sound Engineer | AVID Venue S6L Specialist",
    description: "Live Sound Engineer, AVID Venue S6L Specialist & Live Audio Technician with 7+ years experience.",
    images: ["/img/nishan_hero_s6l.jpeg"],
  },
};

export const viewport = {
  themeColor: "#09090b",
  colorScheme: "dark",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
