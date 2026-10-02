"use client";

import React, { useState, useEffect, useRef } from "react";
import { STUDIO_CONFIG } from "@/data/works";
import { ArrowUpRight, Check, AlertCircle, Loader2, ChevronDown, IndianRupee, Sparkles } from "lucide-react";
import { sound } from "@/lib/sound";

const PRIMARY_INTEREST_OPTIONS = [
  {
    label: "Narrative Cinema & Short Films",
    desc: "Shot on 35mm Celluloid / Arri Alexa LF with Anamorphic glass",
  },
  {
    label: "Commercial Campaigns & Brand Worlds",
    desc: "Bespoke high-contrast visual universes for international maisons",
  },
  {
    label: "Editorial Photography & Medium Format",
    desc: "Hasselblad stills, raw human quietude, and sculpted light",
  },
  {
    label: "Kinetic 9:16 Vertical Direction & Reels",
    desc: "High-octane mobile-first visual cinema with hypnotic pacing",
  },
  {
    label: "Color Science & ACEScct Color Grading",
    desc: "Film-emulated color grading with custom print film LUTs",
  },
  {
    label: "Directorial Consultation & Creative Direction",
    desc: "Script breakdown, visual treatments, and auteur consulting",
  },
];

const PRICING_INR_OPTIONS = [
  {
    label: "₹1,50,000 – ₹3,50,000",
    desc: "Independent short narrative, music video, or editorial stills suite",
  },
  {
    label: "₹3,50,000 – ₹7,50,000",
    desc: "Mid-scale brand story, kinetic 9:16 commercial suite, or campaign",
  },
  {
    label: "₹7,50,000 – ₹15,00,000",
    desc: "Comprehensive cinema commercial, period short film, or studio suite",
  },
  {
    label: "₹15,00,000 – ₹30,00,000+",
    desc: "Large format multi-city production or international co-production",
  },
  {
    label: "To Be Discussed / Flexible Scope",
    desc: "Custom brief, passion project, or grant-funded collaboration",
  },
];

interface CustomSelectProps {
  label: string;
  required?: boolean;
  value: string;
  options: { label: string; desc?: string }[];
  onChange: (val: string) => void;
  icon?: React.ReactNode;
}

function CustomSelect({
  label,
  required = false,
  value,
  options,
  onChange,
  icon,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((o) => o.label === value) || options[0];

  return (
    <div className="relative space-y-2" ref={dropdownRef}>
      <label className="flex items-center justify-between font-mono-code text-[11px] text-white/60 uppercase tracking-wider">
        <span className="flex items-center gap-1.5">
          {icon}
          {label} {required && <span className="text-orchid">*</span>}
        </span>
      </label>

      {/* Select trigger button */}
      <button
        type="button"
        onClick={() => {
          try {
            sound.playClick();
          } catch {}
          setIsOpen((prev) => !prev);
        }}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={`group relative flex w-full items-center justify-between rounded-xl border px-4 py-3.5 text-left transition-all duration-200 min-h-[48px] touch-manipulation cursor-pointer select-none ${
          isOpen
            ? "border-orchid bg-[#161312] shadow-[0_0_20px_rgba(225,29,72,0.18)]"
            : "border-white/10 bg-black/50 hover:border-white/20 hover:bg-white/[0.03]"
        }`}
      >
        <div className="flex flex-col pr-3 truncate">
          <span className="font-mono-code text-xs sm:text-sm font-medium text-white truncate">
            {selectedOption.label}
          </span>
          {selectedOption.desc && (
            <span className="font-sans-ui text-[11px] text-white/45 truncate mt-0.5">
              {selectedOption.desc}
            </span>
          )}
        </div>

        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/5 transition-transform duration-300">
          <ChevronDown
            className={`h-4 w-4 text-white/60 transition-transform duration-300 ${
              isOpen ? "rotate-180 text-orchid" : "group-hover:text-white"
            }`}
          />
        </div>
      </button>

      {/* Dropdown Menu Panel */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute z-50 left-0 right-0 mt-2 max-h-72 overflow-y-auto rounded-xl border border-white/15 bg-[#12100f]/98 p-1.5 shadow-[0_15px_40px_rgba(0,0,0,0.85)] backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150"
        >
          {options.map((opt) => {
            const isSelected = opt.label === value;
            return (
              <div
                role="option"
                aria-selected={isSelected}
                key={opt.label}
                onClick={() => {
                  try {
                    sound.playClick();
                  } catch {}
                  onChange(opt.label);
                  setIsOpen(false);
                }}
                className={`group flex items-start justify-between gap-3 rounded-lg px-3.5 py-2.5 transition-colors cursor-pointer select-none min-h-[44px] touch-manipulation ${
                  isSelected
                    ? "bg-orchid/15 text-white"
                    : "text-white/70 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                <div className="flex flex-col">
                  <span
                    className={`font-mono-code text-xs sm:text-sm ${
                      isSelected ? "font-semibold text-white" : "font-normal"
                    }`}
                  >
                    {opt.label}
                  </span>
                  {opt.desc && (
                    <span className="font-sans-ui text-[10.5px] text-white/45 mt-0.5 leading-snug">
                      {opt.desc}
                    </span>
                  )}
                </div>

                {isSelected && (
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orchid text-white mt-0.5">
                    <Check className="h-3 w-3" strokeWidth={2.5} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    pricingInr: PRICING_INR_OPTIONS[0].label,
    primaryInterest: PRIMARY_INTEREST_OPTIONS[0].label,
    message: "",
    honeypot: "",
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});
  const [isShaking, setIsShaking] = useState(false);

  const triggerShake = () => {
    setIsShaking(false);
    if (typeof window !== "undefined") {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsShaking(true);
          try {
            sound.playError();
          } catch {}
          if ("vibrate" in navigator) {
            try {
              navigator.vibrate([50, 50, 50]);
            } catch {}
          }
        });
      });
    } else {
      setIsShaking(true);
    }
    setTimeout(() => {
      setIsShaking(false);
    }, 520);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      sound.playClick();
    } catch {}

    const errors: { name?: string; email?: string; message?: string } = {};

    if (!formData.name.trim()) {
      errors.name = "Please fill out this field (Full Name required)";
    }

    if (!formData.email.trim()) {
      errors.email = "Please fill out this field (Email Address required)";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        errors.email = "Please provide a valid email address (e.g. name@domain.com)";
      }
    }

    if (!formData.message.trim()) {
      errors.message = "Please fill out this field (Narrative / Scope required)";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setErrorMessage("Please complete all required fields highlighted in crimson below.");
      setStatus("error");
      triggerShake();
      return;
    }

    setStatus("submitting");
    setErrorMessage("");
    setFieldErrors({});

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        company: formData.company.trim(),
        serviceType: formData.primaryInterest,
        budgetRange: formData.pricingInr,
        message: formData.message.trim(),
        honeypot: formData.honeypot,
      };

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        sound.playSuccess();
        setStatus("success");
      } else {
        setErrorMessage(data.error || "Failed to submit. Please email hello@redorchidfilms.com directly.");
        setStatus("error");
        triggerShake();
      }
    } catch {
      setErrorMessage("Network connection error. Please email hello@redorchidfilms.com directly.");
      setStatus("error");
      triggerShake();
    }
  };

  return (
    <section
      id="contact"
      className="relative w-full border-t border-white/10 bg-[#070707] py-20 sm:py-28 text-white overflow-hidden"
    >
      {/* Ambient background studio glow */}
      <div className="absolute top-1/4 -right-32 h-96 w-96 rounded-full bg-orchid/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 -left-32 h-96 w-96 rounded-full bg-orchid/5 blur-[150px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-8 md:px-10 lg:px-14 relative z-10">
        {/* Section Header */}
        <div className="mb-12 sm:mb-18">
          <div className="flex items-center gap-2.5 font-mono-code text-xs text-orchid uppercase tracking-widest mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-orchid animate-pulse" />
            <span>{"// COMMISSIONS & INQUIRIES"}</span>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-bone uppercase max-w-4xl leading-[1.05] sm:leading-[0.95] break-words">
            LET&apos;S CRAFT SOMETHING <br className="hidden sm:inline" />
            <span className="text-orchid">TIMELESS.</span>
          </h2>
        </div>

        {/* 2-Column Split: Direct Contacts vs Redesigned Inquiry Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left Column: Studio availability and direct channels */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8 sm:space-y-10">
            <div className="space-y-6">
              {/* Studio availability badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/30 px-3.5 py-1.5 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="font-mono-code text-[10px] sm:text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                  ACCEPTING COMMISSIONS // 2025-2026
                </span>
              </div>

              <p className="font-sans-ui text-sm sm:text-base text-white/70 leading-relaxed">
                Whether you need a full 35mm short film production, an international commercial campaign, or an arresting editorial suite, our atelier is prepared to realize your visual vision with zero artistic compromises.
              </p>

              {/* Direct channels list */}
              <div className="space-y-5 border-t border-white/10 pt-6">
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

          {/* Right Column: Redesigned Inquiry Form Card */}
          <div className="lg:col-span-7">
            <div
              className={`rounded-2xl border border-white/10 bg-[#0c0a09]/90 p-5 sm:p-8 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.7)] backdrop-blur-xl relative transition-transform duration-200 ${
                isShaking ? "animate-ui-shake" : ""
              }`}
            >
              {/* Subtle top card accent line */}
              <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-orchid/40 to-transparent" />

              {status === "success" ? (
                <div className="py-12 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
                  <div className="mx-auto flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full border border-orchid/50 bg-orchid/15 text-orchid shadow-[0_0_30px_rgba(225,29,72,0.3)]">
                    <Check className="h-7 w-7 sm:h-8 sm:w-8" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase text-bone">
                      TRANSMISSION CONFIRMED
                    </h3>
                    <p className="mt-2 font-sans-ui text-xs sm:text-sm text-white/65 max-w-md mx-auto leading-relaxed">
                      Thank you for reaching out to Red Orchid Films. Sayan and our atelier production team will review your scope and get back to you within 24 hours.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setStatus("idle");
                      setFieldErrors({});
                      setFormData({
                        name: "",
                        email: "",
                        company: "",
                        pricingInr: PRICING_INR_OPTIONS[0].label,
                        primaryInterest: PRIMARY_INTEREST_OPTIONS[0].label,
                        message: "",
                        honeypot: "",
                      });
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 font-mono-code text-xs font-semibold text-white uppercase tracking-wider hover:border-orchid hover:bg-orchid transition-all cursor-pointer min-h-[44px]"
                  >
                    <span>SEND ANOTHER INQUIRY</span>
                    <span>&rarr;</span>
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  noValidate
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

                  {/* Form Sub-Header */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-orchid" />
                      <span className="font-mono-code text-xs font-semibold tracking-wider text-white uppercase">
                        COMMISSION BRIEF
                      </span>
                    </div>
                    <span className="font-mono-code text-[11px] text-white/40">
                      * REQUIRED FIELDS
                    </span>
                  </div>

                  {/* 1. Name & 2. Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <label
                        htmlFor="name"
                        className={`block font-mono-code text-[11px] uppercase tracking-wider transition-colors ${
                          fieldErrors.name ? "text-rose-400 font-semibold" : "text-white/60"
                        }`}
                      >
                        NAME <span className={fieldErrors.name ? "text-rose-400" : "text-orchid"}>*</span>
                      </label>
                      <input
                        id="name"
                        type="text"
                        placeholder="e.g. Sayan Patra"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: undefined }));
                          if (status === "error") setStatus("idle");
                        }}
                        className={`w-full rounded-xl border px-4 py-3.5 text-base sm:text-sm text-white placeholder-white/25 transition-all focus:outline-none min-h-[48px] ${
                          fieldErrors.name
                            ? "border-rose-500 bg-rose-950/30 shadow-[0_0_25px_rgba(244,63,94,0.25)] ring-1 ring-rose-500/40 focus:border-rose-400 focus:ring-rose-400"
                            : "border-white/10 bg-black/50 focus:border-orchid focus:bg-[#120f0e]"
                        }`}
                      />
                      {fieldErrors.name && (
                        <div className="flex items-center gap-2 rounded-lg border border-rose-500/40 bg-gradient-to-r from-rose-950/70 to-rose-900/40 px-3 py-1.5 shadow-[0_0_15px_rgba(244,63,94,0.18)] backdrop-blur-md animate-in fade-in slide-in-from-top-1 duration-150">
                          <span className="relative flex h-2 w-2 shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
                          </span>
                          <span className="font-mono-code text-[10.5px] font-semibold text-rose-300 tracking-wide uppercase">
                            {fieldErrors.name}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className={`block font-mono-code text-[11px] uppercase tracking-wider transition-colors ${
                          fieldErrors.email ? "text-rose-400 font-semibold" : "text-white/60"
                        }`}
                      >
                        EMAIL <span className={fieldErrors.email ? "text-rose-400" : "text-orchid"}>*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        placeholder="you@domain.com"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }));
                          if (status === "error") setStatus("idle");
                        }}
                        className={`w-full rounded-xl border px-4 py-3.5 text-base sm:text-sm text-white placeholder-white/25 transition-all focus:outline-none min-h-[48px] ${
                          fieldErrors.email
                            ? "border-rose-500 bg-rose-950/30 shadow-[0_0_25px_rgba(244,63,94,0.25)] ring-1 ring-rose-500/40 focus:border-rose-400 focus:ring-rose-400"
                            : "border-white/10 bg-black/50 focus:border-orchid focus:bg-[#120f0e]"
                        }`}
                      />
                      {fieldErrors.email && (
                        <div className="flex items-center gap-2 rounded-lg border border-rose-500/40 bg-gradient-to-r from-rose-950/70 to-rose-900/40 px-3 py-1.5 shadow-[0_0_15px_rgba(244,63,94,0.18)] backdrop-blur-md animate-in fade-in slide-in-from-top-1 duration-150">
                          <span className="relative flex h-2 w-2 shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
                          </span>
                          <span className="font-mono-code text-[10.5px] font-semibold text-rose-300 tracking-wide uppercase">
                            {fieldErrors.email}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 3. Company / Production Name (Optional) */}
                  <div className="space-y-2">
                    <label
                      htmlFor="company"
                      className="block font-mono-code text-[11px] text-white/60 uppercase tracking-wider"
                    >
                      COMPANY / PRODUCTION NAME <span className="text-white/35 font-normal">(OPTIONAL)</span>
                    </label>
                    <input
                      id="company"
                      type="text"
                      placeholder="e.g. Warner Bros. / Maison Margiela / Independent"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3.5 text-base sm:text-sm text-white placeholder-white/25 transition-all focus:border-orchid focus:bg-[#120f0e] focus:outline-none min-h-[48px]"
                    />
                  </div>

                  {/* 4. Pricing in INR (Dropdown) */}
                  <CustomSelect
                    label="PRICING IN INR (₹)"
                    required
                    icon={<IndianRupee className="h-3.5 w-3.5 text-orchid" />}
                    value={formData.pricingInr}
                    options={PRICING_INR_OPTIONS}
                    onChange={(val) => setFormData((prev) => ({ ...prev, pricingInr: val }))}
                  />

                  {/* 5. Primary Interest (Proper Dropdown) */}
                  <CustomSelect
                    label="PRIMARY INTEREST"
                    required
                    value={formData.primaryInterest}
                    options={PRIMARY_INTEREST_OPTIONS}
                    onChange={(val) => setFormData((prev) => ({ ...prev, primaryInterest: val }))}
                  />

                  {/* 6. Tell us about narrative/scope */}
                  <div className="space-y-2">
                    <label
                      htmlFor="message"
                      className={`block font-mono-code text-[11px] uppercase tracking-wider transition-colors ${
                        fieldErrors.message ? "text-rose-400 font-semibold" : "text-white/60"
                      }`}
                    >
                      TELL US ABOUT NARRATIVE / SCOPE <span className={fieldErrors.message ? "text-rose-400" : "text-orchid"}>*</span>
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      placeholder="Concept synopsis, expected timeline, location aspirations, technical specs (e.g. 35mm film or digital cinema)..."
                      value={formData.message}
                      onChange={(e) => {
                        setFormData({ ...formData, message: e.target.value });
                        if (fieldErrors.message) setFieldErrors((prev) => ({ ...prev, message: undefined }));
                        if (status === "error") setStatus("idle");
                      }}
                      className={`w-full rounded-xl border p-4 text-base sm:text-sm text-white placeholder-white/25 transition-all focus:outline-none resize-y min-h-[110px] ${
                        fieldErrors.message
                          ? "border-rose-500 bg-rose-950/30 shadow-[0_0_25px_rgba(244,63,94,0.25)] ring-1 ring-rose-500/40 focus:border-rose-400 focus:ring-rose-400"
                          : "border-white/10 bg-black/50 focus:border-orchid focus:bg-[#120f0e]"
                      }`}
                    />
                    {fieldErrors.message && (
                      <div className="flex items-center gap-2 rounded-lg border border-rose-500/40 bg-gradient-to-r from-rose-950/70 to-rose-900/40 px-3 py-1.5 shadow-[0_0_15px_rgba(244,63,94,0.18)] backdrop-blur-md animate-in fade-in slide-in-from-top-1 duration-150">
                        <span className="relative flex h-2 w-2 shrink-0">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
                        </span>
                        <span className="font-mono-code text-[10.5px] font-semibold text-rose-300 tracking-wide uppercase">
                          {fieldErrors.message}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* High-Impact Error Alert with Vibration / Shaky Style */}
                  {status === "error" && (
                    <div
                      role="alert"
                      className={`relative overflow-hidden rounded-xl border border-rose-500/40 bg-gradient-to-r from-rose-950/70 via-[#19090c]/90 to-rose-950/70 p-4 shadow-[0_0_35px_rgba(225,29,72,0.25)] backdrop-blur-md ${
                        isShaking ? "animate-ui-shake" : "animate-in fade-in duration-150"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500 text-white items-center justify-center">
                            <AlertCircle className="h-2.5 w-2.5" strokeWidth={3} />
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono-code text-[11px] font-bold uppercase tracking-widest text-rose-400">
                              // TRANSMISSION HALTED
                            </span>
                            <span className="font-mono-code text-[10px] text-rose-300/60 uppercase">
                              • ACTION REQUIRED
                            </span>
                          </div>
                          <p className="mt-1 font-sans-ui text-xs text-rose-200/90 leading-relaxed">
                            {errorMessage}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 7. Submit Option */}
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    data-cursor="SUBMIT"
                    className="group relative flex w-full items-center justify-center gap-3 rounded-xl border border-orchid bg-orchid px-6 py-4 font-mono-code text-xs sm:text-sm font-bold tracking-widest text-white uppercase transition-all duration-300 hover:bg-orchid-dark hover:shadow-[0_0_30px_rgba(225,29,72,0.4)] disabled:opacity-50 min-h-[50px] touch-manipulation cursor-pointer active:scale-[0.99] select-none"
                  >
                    {status === "submitting" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                        <span>TRANSMITTING INQUIRY...</span>
                      </>
                    ) : (
                      <>
                        <span>SUBMIT PRODUCTION INQUIRY</span>
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" strokeWidth={2} />
                      </>
                    )}
                  </button>

                  <p className="text-center font-mono-code text-[10px] text-white/35 uppercase tracking-wider pt-1">
                    STRICT CONFIDENTIALITY. DIRECT ATELIER DISPATCH. 24H RESPONSE.
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
