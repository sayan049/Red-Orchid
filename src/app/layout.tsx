import type { Metadata, Viewport } from "next";
import { Syne, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { CustomCursor } from "@/components/ui/CustomCursor";

const fontSyne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const fontSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const fontMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#070707",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://redorchidfilms.com"),
  title: "Red Orchid Films — Not content, Cinema.",
  description:
    "Bespoke production atelier crafting short films, medium format photography, 9:16 kinetic reels, and commercial worlds. Based in Kolkata, Mumbai, and worldwide.",
  keywords: [
    "Red Orchid Films",
    "Cinema Production House",
    "Short Films",
    "Medium Format Photography",
    "Editorial Stills",
    "9:16 Reels",
    "Arri Alexa Cinematography",
    "35mm Film",
    "Director Sayan Patra",
    "Commercial Videography",
  ],
  icons: {
    icon: [
      { url: "/logo-orchid.png", sizes: "any" },
      { url: "/icon.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/logo-orchid.png",
    apple: "/icon.png",
  },
  authors: [{ name: "Red Orchid Films" }],
  creator: "Red Orchid Films",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://redorchidfilms.com",
    title: "Red Orchid Films — Not content, Cinema.",
    description:
      "Bespoke production atelier crafting short films, medium format photography, 9:16 kinetic reels, and commercial worlds.",
    siteName: "Red Orchid Films",
    images: [
      {
        url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=85&w=1200",
        width: 1200,
        height: 630,
        alt: "Red Orchid Films Atelier Cinematography",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Red Orchid Films — Not content, Cinema.",
    description:
      "Bespoke production atelier crafting short films, medium format photography, and 9:16 kinetic reels.",
    images: [
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=85&w=1200",
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://redorchidfilms.com/#organization",
      name: "Red Orchid Films",
      url: "https://redorchidfilms.com",
      logo: "https://redorchidfilms.com/logo.png",
      slogan: "Not content, Cinema.",
      description:
        "Bespoke production atelier crafting short films, medium format photography, 9:16 kinetic reels, and commercial worlds.",
      email: "hello@redorchidfilms.com",
      telephone: "+919830024190",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Kolkata",
        addressRegion: "West Bengal",
        addressCountry: "IN",
      },
      sameAs: [
        "https://instagram.com/redorchidfilms",
        "https://vimeo.com/redorchidfilms",
        "https://youtube.com/@redorchidfilms",
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fontSyne.variable} ${fontSans.variable} ${fontMono.variable} dark`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className="min-h-screen bg-[#070707] text-[#f5f2eb] antialiased selection:bg-[#e11d48] selection:text-white"
        suppressHydrationWarning
      >
        <CustomCursor />
        <Navbar />
        <SmoothScroll>
          {children}
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
