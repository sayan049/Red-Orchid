"use client";

import { useState } from "react";
import { STUDIO_CONFIG } from "@/data/works";
import { ArrowUpRight, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    serviceType: "Cinema & Narrative Films",
    budgetRange: "$6,000 – $15,000",
    timeline: "Within 2-3 Months",
    message: "",
    honeypot: "",
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMessage("Please complete all required fields (Name, Email, Message).");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatus("success");
      } else {
        setErrorMessage(data.error || "Failed to submit. Please email hello@redorchidfilms.com directly.");
        setStatus("error");
      }
    } catch {
      setErrorMessage("Network error. Please email hello@redorchidfilms.com directly.");
      setStatus("error");
    }
  };

  return (
    <section
      id="contact"
      className="relative w-full border-t border-white/10 bg-[#070707] py-28 text-white overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-14">
        {/* Section Header */}
        <div className="mb-20">
          <div className="flex items-center gap-2.5 font-mono-code text-xs text-orchid uppercase tracking-widest mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-orchid animate-pulse" />
            <span>// COMMISSIONS & INQUIRIES</span>
          </div>
          <h2 className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-bone uppercase max-w-4xl leading-[0.95]">
            LET&apos;S CRAFT SOMETHING <br />
            <span className="text-orchid">TIMELESS.</span>
          </h2>
        </div>

        {/* 2-Column Split: Direct Contacts vs Inquiry Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Studio availability and direct channels */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-10">
            <div className="space-y-6">
              {/* Studio availability badge */}
              <div className="inline-flex items-center gap-2.5 rounded-full border border-emerald-500/30 bg-emerald-950/30 px-4 py-1.5 backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-mono-code text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                  ACCEPTING COMMISSIONS // 2025
                </span>
              </div>

              <p className="font-sans-ui text-sm sm:text-base text-white/70 leading-relaxed">
                Whether you need a full 35mm short film production, a fashion campaign shot on medium format, or an arresting 9:16 commercial suite, our atelier is ready to realize your vision.
              </p>

              {/* Direct channels list */}
              <div className="space-y-4 border-t border-white/10 pt-6">
                <div>
                  <span className="font-mono-code text-[10px] text-white/40 tracking-widest uppercase block mb-1">
                    DIRECT DISPATCH
                  </span>
                  <a
                    href={`mailto:${STUDIO_CONFIG.email}`}
                    className="font-display text-xl sm:text-2xl text-bone hover:text-orchid transition-colors block"
                  >
                    {STUDIO_CONFIG.email}
                  </a>
                </div>

                <div>
                  <span className="font-mono-code text-[10px] text-white/40 tracking-widest uppercase block mb-1">
                    STUDIO PHONE & WHATSAPP
                  </span>
                  <a
                    href={`tel:${STUDIO_CONFIG.phone}`}
                    className="font-mono-code text-sm text-white/80 hover:text-white transition-colors block"
                  >
                    {STUDIO_CONFIG.phone}
                  </a>
                </div>

                <div>
                  <span className="font-mono-code text-[10px] text-white/40 tracking-widest uppercase block mb-1">
                    LOCATIONS
                  </span>
                  <p className="font-sans-ui text-sm text-white/70">
                    {STUDIO_CONFIG.location}
                  </p>
                </div>
              </div>
            </div>

            {/* Socials strip */}
            <div className="border-t border-white/10 pt-6">
              <span className="font-mono-code text-[10px] text-white/40 tracking-widest uppercase block mb-3">
                CHANNELS
              </span>
              <div className="flex flex-wrap gap-4 text-xs font-mono-code">
                <a
                  href={STUDIO_CONFIG.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-white/70 hover:text-orchid transition-colors"
                >
                  <span>INSTAGRAM</span>
                  <ArrowUpRight className="h-3 w-3" />
                </a>
                <a
                  href={STUDIO_CONFIG.vimeo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-white/70 hover:text-orchid transition-colors"
                >
                  <span>VIMEO</span>
                  <ArrowUpRight className="h-3 w-3" />
                </a>
                <a
                  href={STUDIO_CONFIG.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-white/70 hover:text-orchid transition-colors"
                >
                  <span>YOUTUBE</span>
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form Card */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-white/10 bg-[#0e0c0b] p-6 sm:p-10 shadow-2xl relative">
              {status === "success" ? (
                <div className="py-12 text-center space-y-6">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-orchid/50 bg-orchid/10 text-orchid">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase text-bone">
                      TRANSMISSION CONFIRMED
                    </h3>
                    <p className="mt-2 font-sans-ui text-sm text-white/60 max-w-md mx-auto leading-relaxed">
                      Thank you for reaching out to Red Orchid Films. Sayan and the production team will review your project brief and get back to you within 24 hours.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setStatus("idle");
                      setFormData({
                        name: "",
                        email: "",
                        company: "",
                        serviceType: "Cinema & Narrative Films",
                        budgetRange: "$6,000 – $15,000",
                        timeline: "Within 2-3 Months",
                        message: "",
                        honeypot: "",
                      });
                    }}
                    className="font-mono-code text-xs text-orchid uppercase tracking-widest hover:underline pt-4"
                  >
                    SEND ANOTHER INQUIRY &rarr;
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Honeypot anti-spam field */}
                  <div className="hidden" aria-hidden="true">
                    <input
                      type="text"
                      name="honeypot"
                      tabIndex={-1}
                      value={formData.honeypot}
                      onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                    />
                  </div>

                  {/* Name & Email Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block font-mono-code text-[11px] text-white/60 uppercase tracking-wider mb-2"
                      >
                        YOUR NAME *
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        placeholder="e.g. Elena Rostova"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder-white/20 transition-colors focus:border-orchid focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block font-mono-code text-[11px] text-white/60 uppercase tracking-wider mb-2"
                      >
                        EMAIL ADDRESS *
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        placeholder="elena@domain.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder-white/20 transition-colors focus:border-orchid focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Company / Brand */}
                  <div>
                    <label
                      htmlFor="company"
                      className="block font-mono-code text-[11px] text-white/60 uppercase tracking-wider mb-2"
                    >
                      COMPANY / PRODUCTION BRAND (OPTIONAL)
                    </label>
                    <input
                      id="company"
                      type="text"
                      placeholder="e.g. Muji / Independent Production"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder-white/20 transition-colors focus:border-orchid focus:outline-none"
                    />
                  </div>

                  {/* Service Type Selection */}
                  <div>
                    <label className="block font-mono-code text-[11px] text-white/60 uppercase tracking-wider mb-2.5">
                      PRIMARY SERVICE OF INTEREST
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {STUDIO_CONFIG.services.map((service) => {
                        const isSelected = formData.serviceType === service;
                        return (
                          <button
                            type="button"
                            key={service}
                            onClick={() => setFormData({ ...formData, serviceType: service })}
                            className={`rounded-lg border px-3.5 py-2.5 text-left text-xs font-mono-code transition-all ${
                              isSelected
                                ? "border-orchid bg-orchid/20 text-white font-medium shadow-[0_0_15px_rgba(225,29,72,0.25)]"
                                : "border-white/10 bg-black/40 text-white/60 hover:border-white/20 hover:text-white"
                            }`}
                          >
                            {service}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Budget Tier Pill Selector */}
                  <div>
                    <label className="block font-mono-code text-[11px] text-white/60 uppercase tracking-wider mb-2.5">
                      ANTICIPATED PRODUCTION BUDGET
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {STUDIO_CONFIG.budgetTiers.map((tier) => {
                        const isSelected = formData.budgetRange === tier.label;
                        return (
                          <button
                            type="button"
                            key={tier.label}
                            onClick={() => setFormData({ ...formData, budgetRange: tier.label })}
                            className={`flex flex-col rounded-lg border p-3 text-left transition-all ${
                              isSelected
                                ? "border-orchid bg-orchid/20 text-white"
                                : "border-white/10 bg-black/40 text-white/60 hover:border-white/20 hover:text-white"
                            }`}
                          >
                            <span className="font-mono-code text-xs font-semibold text-white">
                              {tier.label}
                            </span>
                            <span className="font-sans-ui text-[10px] text-white/50 mt-1">
                              {tier.desc}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Project Details Message */}
                  <div>
                    <label
                      htmlFor="message"
                      className="block font-mono-code text-[11px] text-white/60 uppercase tracking-wider mb-2"
                    >
                      TELL US ABOUT THE NARRATIVE / SCOPE *
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={4}
                      placeholder="Locations, concept synopsis, delivery dates, or technical aspirations..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full rounded-lg border border-white/10 bg-black/50 p-4 text-sm text-white placeholder-white/20 transition-colors focus:border-orchid focus:outline-none"
                    />
                  </div>

                  {/* Error banner if any */}
                  {status === "error" && (
                    <div className="flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-950/20 p-3 text-xs text-rose-400">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    data-cursor="TRANSMIT"
                    className="group relative flex w-full items-center justify-center gap-3 rounded-xl border border-orchid bg-orchid px-6 py-4 font-mono-code text-xs font-bold tracking-widest text-white uppercase transition-all duration-300 hover:bg-orchid-dark disabled:opacity-50"
                  >
                    {status === "submitting" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>TRANSMITTING INQUIRY...</span>
                      </>
                    ) : (
                      <>
                        <span>TRANSMIT PRODUCTION INQUIRY</span>
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </>
                    )}
                  </button>

                  <p className="text-center font-mono-code text-[10px] text-white/40">
                    STRICT PRIVACY. ZERO THIRD-PARTY SHARING. DIRECT ATELIER DISPATCH.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
