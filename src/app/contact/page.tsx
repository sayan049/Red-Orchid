import { Metadata } from "next";
import { ContactSection } from "@/components/home/ContactSection";
import { STUDIO_CONFIG } from "@/data/works";
import { Film, Globe, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact & Commissions — Red Orchid Films",
  description:
    "Initiate a narrative short film, editorial photography session, or commercial campaign with Red Orchid Films.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#070707] text-white pt-32 pb-16">
      {/* Commissioning FAQs & Studio Standard */}
      <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-14 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-b border-white/10 pb-16">
          <div className="rounded-xl border border-white/5 bg-[#100e0e] p-6 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orchid/10 text-orchid">
              <Film className="h-5 w-5" strokeWidth={1.5} />
            </div>
            <h3 className="font-display text-lg font-bold uppercase text-bone">
              BESPOKE APPROACH
            </h3>
            <p className="font-sans-ui text-xs text-white/60 leading-relaxed">
              We accept a limited roster of 12-15 commissions annually to ensure our directorial focus and color science remain uncompromised.
            </p>
          </div>

          <div className="rounded-xl border border-white/5 bg-[#100e0e] p-6 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orchid/10 text-orchid">
              <Clock className="h-5 w-5" strokeWidth={1.5} />
            </div>
            <h3 className="font-display text-lg font-bold uppercase text-bone">
              RAPID TURNAROUND
            </h3>
            <p className="font-sans-ui text-xs text-white/60 leading-relaxed">
              Treatments prepared within 72 hours. Initial offline edit cuts delivered within 10 business days of final wrap.
            </p>
          </div>

          <div className="rounded-xl border border-white/5 bg-[#100e0e] p-6 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orchid/10 text-orchid">
              <Globe className="h-5 w-5" strokeWidth={1.5} />
            </div>
            <h3 className="font-display text-lg font-bold uppercase text-bone">
              GLOBAL LICENSING
            </h3>
            <p className="font-sans-ui text-xs text-white/60 leading-relaxed">
              All commercial and narrative assets include comprehensive worldwide festival, broadcast, and digital rights clearance.
            </p>
          </div>
        </div>
      </div>

      {/* Main Interactive Contact Section */}
      <ContactSection />
    </div>
  );
}
