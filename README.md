# Red Orchid Films — Bespoke Atelier Portfolio
> *"Not content, Cinema."*

A luxury, award-level portfolio website built for **Red Orchid Films**, an independent production house specializing in 35mm narrative short films, medium format photography, high-impact 9:16 vertical reels, commercial campaigns, and art direction.

---

## 📽️ Design Principles & Craft
- **Aesthetic Benchmark:** Bespoke $12,000+ atelier feel, taking inspiration from *Dondre Green*, *Gallery Play*, *Let It Rip Pictures*, and *Balans Studio*.
- **Palette:** Deep Obsidian Black (`#070707`), Film Charcoal (`#111010`), Archival Bone (`#F5F2EB`), Muted Film Slate (`#8E8880`), and signature **Orchid Carmine** (`#E11D48`).
- **Typography:** Display headlines in **Syne** paired with editorial metadata in **Plus Jakarta Sans** and frame counters in **JetBrains Mono**.
- **Tactile Materiality:** Real-time 35mm celluloid grain, interactive chromatic lens dispersion via lazy-loaded Three.js WebGL canvas, and responsive spring cursor physics.
- **Audio Experience:** Synthesized 432Hz ambient cinematic room drone powered by the browser's native Web Audio API (`AudioContext`) with real-time visualizer bars. Zero external MP3 download lag.
- **Global Studio Clock:** Live timecode tracking studio local time in Kolkata / IST (`Asia/Kolkata`) updating every second.

---

## ⚡ Tech Stack & Architecture
- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS v4 with bespoke editorial tokens
- **Motion & Scroll:** Lenis smooth scrolling synchronized with GSAP (`ScrollTrigger`) and `prefers-reduced-motion` compliance
- **3D & WebGL:** Three.js fragment shader for 35mm grain and chromatic aberration (lazy-loaded after first paint)
- **Accessible Primitives:** Accessible Video Player Modal, Photography Lightbox with touch swipe and keyboard controls, and interactive inquiry form
- **SEO & Performance:** Automatic AVIF/WebP image generation, JSON-LD Schema (`Organization`), dynamic `sitemap.xml`, and `robots.txt`

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js:** v18.18+ (tested on Node v26)
- **npm:** v9+

### 2. Installation
```bash
npm install
```

### 3. Running Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Production Build
```bash
npm run build
npm run start
```

---

## 📂 Project Structure

```
Photography/
├── src/
│   ├── app/
│   │   ├── api/contact/route.ts   # Production inquiry handler with honeypot spam protection
│   │   ├── contact/page.tsx       # Dedicated commissions & studio standards page
│   │   ├── gallery/page.tsx       # Filterable archive (Films, Stills, 9:16 Reels) + Lightbox
│   │   ├── work/[slug]/           # Dynamic project case study pages with credits & technical specs
│   │   │   ├── page.tsx
│   │   │   └── WorkDetailClient.tsx
│   │   ├── globals.css            # Design tokens, typography clamp(), Lenis scroll styles
│   │   ├── layout.tsx             # Root layout with fonts, JSON-LD, Navbar & Footer
│   │   ├── page.tsx               # Homepage assembling Hero, Trending, Selected, Services & Contact
│   │   ├── robots.ts              # Dynamic robots.txt
│   │   └── sitemap.ts             # Dynamic sitemap generator
│   ├── components/
│   │   ├── home/
│   │   │   ├── Hero.tsx           # Full-bleed looping reel with poster fallback & showreel modal
│   │   │   ├── HeroShader.tsx     # WebGL 35mm grain & anamorphic chromatic drift
│   │   │   ├── TrendingWorks.tsx  # Horizontal drag/scroll ticker powered by GSAP
│   │   │   ├── SelectedWorks.tsx  # Asymmetrical mixed-aspect ratio editorial grid
│   │   │   ├── ServicesStrip.tsx  # Capabilities with live visual preview stage
│   │   │   └── ContactSection.tsx # Inquiry form with budget tiers & validation
│   │   ├── layout/
│   │   │   ├── Navbar.tsx         # Minimal floating nav, mobile drawer, sound & clock
│   │   │   ├── Footer.tsx         # Atelier footer, studio coordinates & directory
│   │   │   └── SmoothScroll.tsx   # Lenis smooth scroll engine
│   │   └── ui/
│   │       ├── BrandLogo.tsx      # Bespoke SVG orchid petal & aperture glyph
│   │       ├── CustomCursor.tsx   # Dynamic spring cursor with context labels (PLAY, VIEW, DRAG)
│   │       ├── Lightbox.tsx       # Accessible full-screen photography lightbox with swipe
│   │       ├── LiveTime.tsx       # Real-time studio clock with second accuracy
│   │       ├── SoundToggle.tsx    # Ambient tape drone with reactive visualizer bars
│   │       └── VideoModal.tsx     # Cinema player modal with timecodes and keyboard controls
│   ├── data/
│   │   └── works.ts               # Typed local CMS data file (Works, Services, Studio Info)
│   ├── lib/
│   │   └── utils.ts               # Styling & timecode utilities
│   └── types/
│       └── index.ts               # TypeScript interfaces
├── next.config.ts                 # Image domains & optimization settings
├── package.json
└── tsconfig.json
```

---

## 📝 How to Add / Edit Works (No Code Changes Needed!)

All project content is stored in [`src/data/works.ts`](file:///Users/sayanpatra/Desktop/Photography/src/data/works.ts). Simply append a new object to `WORKS_DATA`:

```typescript
{
  id: "9",
  slug: "your-project-slug", // Becomes /work/your-project-slug
  title: "PROJECT TITLE",
  subtitle: "Brief poetic subtitle",
  client: "Client Name / Production Partner",
  category: "Short Film", // "Short Film" | "Photography" | "Reels" | "Commercial" | "Branding"
  subCategory: "Narrative Drama",
  year: "2025",
  duration: "12m 30s",
  aspectRatio: "2.39:1", // "16:9" | "2.39:1" | "4:5" | "9:16" | "1:1"
  coverImage: "https://images.unsplash.com/photo-...", // High-res poster
  videoUrl: "https://.../video.mp4", // Direct MP4 or CDN video link
  synopsis: "The detailed background story of the work...",
  directorStatement: "Directorial notes on lenses and lighting...",
  credits: [
    { role: "Director", name: "Sayan Patra" },
    { role: "Director of Photography", name: "Your DOP" },
  ],
  technicalSpecs: {
    camera: "ARRI Alexa Mini LF",
    lenses: "Cooke Anamorphic/i 50mm",
    aspectRatio: "2.39:1",
    colorGrade: "ACEScct 35mm Emulation",
    location: "Kolkata, India",
  },
  stills: [
    {
      id: "still-1",
      url: "https://images.unsplash.com/...",
      caption: "Opening shot at twilight.",
      camera: "Alexa Mini LF • 50mm • T2.3",
      iso: "800",
    },
  ],
  featured: true,  // Displayed in Selected Works grid
  trending: true,  // Displayed in Trending carousel
  order: 9,
}
```

The system automatically generates the case study page (`/work/your-project-slug`), places it into the filterable `/gallery`, updates `sitemap.xml`, and creates SEO metadata dynamically.

---

## 🚢 Deploying to Vercel

1. Push your repository to GitHub / GitLab:
   ```bash
   git add .
   git commit -m "feat: complete Red Orchid Films bespoke portfolio"
   git remote add origin https://github.com/your-username/red-orchid-films.git
   git push -u origin main
   ```
2. Log into [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your repository. Vercel automatically detects Next.js.
4. Deploy! Production builds complete in ~2 minutes with zero configuration.

---

## 🏆 Quality & Performance Benchmarks
- **Mobile First:** Designed with fluid typography (`clamp()`), safe-area insets, and 44px+ touch targets.
- **Accessibility:** Full WCAG AA contrast, visible focus rings with signature orchid glow, screen-reader semantics, and `prefers-reduced-motion` fallbacks.
- **Fast First Paint:** Critical fonts preloaded via `next/font`, images optimized with modern AVIF/WebP formats, and WebGL deferred until after first paint.
