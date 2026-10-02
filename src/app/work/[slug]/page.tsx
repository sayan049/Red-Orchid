import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { WORKS_DATA } from "@/data/works";
import { ArrowUpRight, ArrowLeft, Camera } from "lucide-react";
import { WorkDetailClient } from "@/components/work/WorkDetailClient";

interface WorkPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return WORKS_DATA.map((work) => ({
    slug: work.slug,
  }));
}

export async function generateMetadata({ params }: WorkPageProps): Promise<Metadata> {
  const { slug } = await params;
  const work = WORKS_DATA.find((w) => w.slug === slug);

  if (!work) {
    return {
      title: "Work Not Found — Red Orchid Films",
    };
  }

  return {
    title: `${work.title} — Red Orchid Films`,
    description: work.synopsis,
    openGraph: {
      title: `${work.title} | Red Orchid Films`,
      description: work.synopsis,
      images: [{ url: work.coverImage }],
    },
  };
}

export default async function WorkPage({ params }: WorkPageProps) {
  const { slug } = await params;
  const workIndex = WORKS_DATA.findIndex((w) => w.slug === slug);

  if (workIndex === -1) {
    notFound();
  }

  const work = WORKS_DATA[workIndex];
  const nextWork = WORKS_DATA[(workIndex + 1) % WORKS_DATA.length];

  return (
    <article className="min-h-screen bg-[#070707] text-white pt-28 pb-24">
      <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-14">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/#works"
            className="group inline-flex items-center gap-2 font-mono-code text-xs text-white/50 hover:text-white transition-colors uppercase tracking-wider"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1 text-orchid" strokeWidth={1.5} />
            <span>BACK TO WORKS ARCHIVE</span>
          </Link>
        </div>

        {/* Project Title Block */}
        <div className="mb-12 border-b border-white/10 pb-12">
          <div className="flex flex-wrap items-center gap-3 font-mono-code text-xs text-orchid uppercase tracking-widest mb-4">
            <span className="rounded-full border border-orchid/30 bg-orchid/10 px-3 py-1 text-white">
              {work.category}
            </span>
            <span>•</span>
            <span className="text-white/60">{work.year}</span>
            <span>•</span>
            <span className="text-white/60">{work.client}</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold uppercase tracking-tight text-bone">
            {work.title}
          </h1>

          {work.subtitle && (
            <p className="mt-3 font-sans-ui text-lg sm:text-xl text-white/60 max-w-3xl leading-relaxed">
              {work.subtitle}
            </p>
          )}
        </div>

        {/* Interactive Client-Side Media Hero & Stills Gallery */}
        <WorkDetailClient work={work} />

        {/* Synopsis & Director's Statement */}
        <div className="mt-20 grid grid-cols-1 lg:grid-cols-12 gap-12 border-b border-white/10 pb-20">
          <div className="lg:col-span-4">
            <span className="font-mono-code text-xs tracking-widest text-orchid uppercase block mb-3">
              {"// SYNOPSIS & LOGLINE"}
            </span>
            <p className="font-display text-2xl font-bold uppercase text-bone">
              THE VISION
            </p>
          </div>

          <div className="lg:col-span-8 space-y-8 font-sans-ui text-sm sm:text-base text-white/70 leading-relaxed">
            <p className="text-white/90 text-lg font-normal leading-relaxed">
              {work.synopsis}
            </p>

            {work.directorStatement && (
              <div className="rounded-xl border border-white/10 bg-[#111010] p-6 sm:p-8">
                <span className="font-mono-code text-xs text-orchid uppercase tracking-wider block mb-2">
                  DIRECTOR&apos;S NOTE
                </span>
                <p className="italic text-white/80 leading-relaxed font-sans-ui">
                  &ldquo;{work.directorStatement}&rdquo;
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Technical Specs & Production Credits Grid */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 border-b border-white/10 pb-20">
          {/* Technical Specifications */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-2 font-mono-code text-xs text-orchid uppercase tracking-widest">
              <Camera className="h-3.5 w-3.5" strokeWidth={1.5} />
              <span>TECHNICAL SPECIFICATIONS</span>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#111010] p-6 divide-y divide-white/5 font-mono-code text-xs">
              <div className="py-2.5 flex justify-between">
                <span className="text-white/40 uppercase">CAMERA</span>
                <span className="text-white/90">{work.technicalSpecs?.camera || "35mm Cinema Package"}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-white/40 uppercase">LENSES</span>
                <span className="text-white/90">{work.technicalSpecs?.lenses || "Anamorphic Primes"}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-white/40 uppercase">ASPECT RATIO</span>
                <span className="text-white/90">{work.aspectRatio}</span>
              </div>
              {work.duration && (
                <div className="py-2.5 flex justify-between">
                  <span className="text-white/40 uppercase">RUNTIME</span>
                  <span className="text-white/90">{work.duration}</span>
                </div>
              )}
              {work.technicalSpecs?.colorGrade && (
                <div className="py-2.5 flex justify-between">
                  <span className="text-white/40 uppercase">COLOR GRADE</span>
                  <span className="text-white/90">{work.technicalSpecs.colorGrade}</span>
                </div>
              )}
              {work.technicalSpecs?.location && (
                <div className="py-2.5 flex justify-between">
                  <span className="text-white/40 uppercase">LOCATION</span>
                  <span className="text-white/90">{work.technicalSpecs.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Credits Roster */}
          <div className="lg:col-span-7 space-y-6">
            <span className="font-mono-code text-xs text-orchid uppercase tracking-widest block">
              {"// PRODUCTION CREDITS"}
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {work.credits.map((credit, cIdx) => (
                <div
                  key={cIdx}
                  className="rounded-xl border border-white/5 bg-[#0e0c0b] p-4 flex flex-col justify-between"
                >
                  <span className="font-mono-code text-[11px] text-white/40 uppercase">
                    {credit.role}
                  </span>
                  <span className="font-display text-base font-semibold text-bone uppercase mt-1">
                    {credit.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Magnetic Next Project Gateway */}
        <div className="mt-20 pt-8 text-center">
          <span className="font-mono-code text-xs text-orchid uppercase tracking-widest block mb-4">
            NEXT PROJECT IN ARCHIVE
          </span>

          <Link
            href={`/work/${nextWork.slug}`}
            data-cursor="NEXT FILM"
            className="group inline-flex flex-col items-center gap-4 transition-all"
          >
            <h2 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold uppercase text-bone transition-colors group-hover:text-orchid">
              {nextWork.title}
            </h2>
            <div className="flex items-center gap-2 font-mono-code text-xs text-white/60 group-hover:text-white transition-colors">
              <span>{nextWork.category} • {nextWork.client}</span>
              <ArrowUpRight className="h-4 w-4 text-orchid transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" strokeWidth={1.5} />
            </div>
          </Link>
        </div>
      </div>
    </article>
  );
}
