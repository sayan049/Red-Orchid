"use client";

import { useState } from "react";
import { STUDIO_CONFIG } from "@/data/works";
import { ArrowUpRight, Check, AlertCircle, Loader2 } from "lucide-react";
import { sound } from "@/lib/sound";

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

  const handleSelectService = (service: string) => {
    try {
      sound.playClick();
    } catch {}
    setFormData((prev) => ({ ...prev, serviceType: service }));
  };

  const handleSelectBudget = (budget: string) => {
    try {
      sound.playClick();
    } catch {}
    setFormData((prev) => ({ ...prev, budgetRange: budget }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      sound.playClick();
    } catch {}

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage("Please complete all required fields (Name, Email, Message).");
      setStatus("error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setErrorMessage("Please provide a valid email address.");
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
        sound.playSuccess();
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
      className="relative w-full border-t border-white/10 bg-[#070707] py-20 sm:py-28 text-white overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-8 md:px-10 lg:px-14">
        {/* Section Header */}
        <div className="mb-14 sm:mb-20">
          <div className="flex items-center gap-2.5 font-mono-code text-xs text-orchid uppercase tracking-widest mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-orchid animate-pulse" />
            <span>{"// COMMISSIONS & INQUIRIES"}</span>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-bone uppercase max-w-4xl leading-[1.05] sm:leading-[0.95] break-words">
            LET&apos;S CRAFT SOMETHING <br className="hidden sm:inline" />
            <span className="text-orchid">TIMELESS.</span>
          </h2>
        </div>

        {/* 2-Column Split: Direct Contacts vs Inquiry Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Left Column: Studio availability and direct channels */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8 sm:space-y-10">
            <div className="space-y-6">
              {/* Studio availability badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/30 px-3.5 py-1.5 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="font-mono-code text-[10px] sm:text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
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
                    onClick={() => sound.playClick()}
                    className="font-display text-lg sm:text-2xl text-bone hover:text-orchid transition-colors block truncate"
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
                    onClick={() => sound.playClick()}
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
                  onClick={() => sound.playClick()}
                  className="flex items-center gap-1.5 text-white/70 hover:text-orchid transition-colors py-1"
                >
                  <span>INSTAGRAM</span>
                  <ArrowUpRight className="h-3 w-3" strokeWidth={1.5} />
                </a>
                <a
                  href={STUDIO_CONFIG.vimeo}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sound.playClick()}
                  className="flex items-center gap-1.5 text-white/70 hover:text-orchid transition-colors py-1"
                >
                  <span>VIMEO</span>
                  <ArrowUpRight className="h-3 w-3" strokeWidth={1.5} />
                </a>
                <a
                  href={STUDIO_CONFIG.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sound.playClick()}
                  className="flex items-center gap-1.5 text-white/70 hover:text-orchid transition-colors py-1"
                >
                  <span>YOUTUBE</span>
                  <ArrowUpRight className="h-3 w-3" strokeWidth={1.5} />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form Card */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-white/10 bg-[#0e0c0b] p-5 sm:p-8 md:p-10 shadow-2xl relative">
              {status === "success" ? (
                <div className="py-10 text-center space-y-5">
                  <div className="mx-auto flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full border border-orchid/50 bg-orchid/10 text-orchid">
                    <Check className="h-7 w-7 sm:h-8 sm:w-8" strokeWidth={1.75} />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase text-bone">
                      TRANSMISSION CONFIRMED
                    </h3>
                    <p className="mt-2 font-sans-ui text-xs sm:text-sm text-white/60 max-w-md mx-auto leading-relaxed">
                      Thank you for reaching out to Red Orchid Films. Sayan and the production team will review your project brief and get back to you within 24 hours.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
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
                    className="font-mono-code text-xs text-orchid uppercase tracking-widest hover:underline pt-4 min-h-[44px]"
                  >
                    SEND ANOTHER INQUIRY &rarr;
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  suppressHydrationWarning
                  className="space-y-5 sm:space-y-6"
                >
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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
                        className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-3 text-base sm:text-sm text-white placeholder-white/20 transition-colors focus:border-orchid focus:outline-none min-h-[44px]"
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
                        className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-3 text-base sm:text-sm text-white placeholder-white/20 transition-colors focus:border-orchid focus:outline-none min-h-[44px]"
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
                      className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-3 text-base sm:text-sm text-white placeholder-white/20 transition-colors focus:border-orchid focus:outline-none min-h-[44px]"
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
                            onClick={() => handleSelectService(service)}
                            className={`rounded-lg border px-3.5 py-2.5 text-left text-xs font-mono-code transition-all min-h-[44px] touch-manipulation cursor-pointer active:scale-[0.98] select-none ${
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
                            onClick={() => handleSelectBudget(tier.label)}
                            className={`flex flex-col rounded-lg border p-3 text-left transition-all min-h-[44px] touch-manipulation cursor-pointer active:scale-[0.98] select-none ${
                              isSelected
                                ? "border-orchid bg-orchid/20 text-white"
                                : "border-white/10 bg-black/40 text-white/60 hover:border-white/20 hover:text-white"
                            }`}
                          >
                            <span className="font-mono-code text-xs font-semibold text-white">
                              {tier.label}
                            </span>
                            <span className="font-sans-ui text-[10px] text-white/50 mt-0.5">
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
                      className="w-full rounded-lg border border-white/10 bg-black/50 p-4 text-base sm:text-sm text-white placeholder-white/20 transition-colors focus:border-orchid focus:outline-none"
                    />
                  </div>

                  {/* Error banner */}
                  {status === "error" && (
                    <div className="flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-950/30 p-3 text-xs text-rose-300">
                      <AlertCircle className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    data-cursor="TRANSMIT"
                    className="group relative flex w-full items-center justify-center gap-3 rounded-xl border border-orchid bg-orchid px-6 py-4 font-mono-code text-xs font-bold tracking-widest text-white uppercase transition-all duration-300 hover:bg-orchid-dark disabled:opacity-50 min-h-[48px] touch-manipulation cursor-pointer active:scale-98"
                  >
                    {status === "submitting" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} />
                        <span>TRANSMITTING INQUIRY...</span>
                      </>
                    ) : (
                      <>
                        <span>TRANSMIT PRODUCTION INQUIRY</span>
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.75} />
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
