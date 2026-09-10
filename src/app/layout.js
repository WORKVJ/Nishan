import "./globals.css";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://muhammadnishan.com"),
  title: "Muhammad Nishan K N | Sound Engineer | AVID Venue S6L Specialist | Live Audio Technician",
  description: "Dynamic and results-driven Sound Engineer with 7+ years of freelance and professional experience in FOH mixing, monitor mixing, live recording, and system design. Specialist in AVID Venue S6L, L-Acoustics, D&B, and Dante audio networking.",
  keywords: "Muhammad Nishan, Sound Engineer, AVID Venue S6L, Live Audio Technician, FOH Mixing, Monitor Mixing, L-Acoustics, D&B, Dante, Wayanad Kerala, Bangalore, UAE Dubai, AR Rahman, Shankar Mahadevan, WPL 2025",
  authors: [{ name: "Muhammad Nishan K N" }],
  openGraph: {
    title: "Muhammad Nishan K N - Live Sound Engineer & AVID S6L Specialist",
    description: "7+ Years Experience in FOH & Monitor Mixing, Tour Sound, Multitrack Recording & System Design.",
    url: "https://muhammadnishan.com",
    siteName: "Muhammad Nishan Portfolio",
    images: [
      {
        url: "/img/nishan_portrait.jpg",
        width: 1200,
        height: 1200,
        alt: "Muhammad Nishan K N - Sound Engineer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Muhammad Nishan K N | Sound Engineer | AVID Venue S6L Specialist",
    description: "Live Sound Engineer, AVID Venue S6L Specialist & Live Audio Technician with 7+ years experience.",
    images: ["/img/hero_foh.jpg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" color-scheme="dark">
      <head>
        {/* Google Font Urbanist */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Urbanist:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />

        {/* Phosphor Icons */}
        <link
          rel="stylesheet"
          type="text/css"
          href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/regular/style.css"
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/bold/style.css"
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/thin/style.css"
        />

        {/* Template CSS */}
        <link rel="stylesheet" type="text/css" href="/css/loaders/loader.css" />
        <link rel="stylesheet" type="text/css" href="/css/plugins.css" />
        <link rel="stylesheet" type="text/css" href="/css/main.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
