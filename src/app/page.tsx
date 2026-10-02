import { Hero } from "@/components/home/Hero";
import { TrendingWorks } from "@/components/home/TrendingWorks";
import { SelectedWorks } from "@/components/home/SelectedWorks";
import { ServicesStrip } from "@/components/home/ServicesStrip";
import { ContactSection } from "@/components/home/ContactSection";
import { WORKS_DATA } from "@/data/works";

export default function HomePage() {
  return (
    <main className="relative flex flex-col w-full bg-[#070707]">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Trending Works Horizontal Showcase */}
      <TrendingWorks works={WORKS_DATA} />

      {/* 3. Selected Works Asymmetric Editorial Grid */}
      <SelectedWorks works={WORKS_DATA} />

      {/* 4. Capabilities & Services Strip */}
      <ServicesStrip />

      {/* 5. Contact & Commissions Suite */}
      <ContactSection />
    </main>
  );
}
