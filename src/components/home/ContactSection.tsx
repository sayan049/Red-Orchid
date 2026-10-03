"use client";

import React, { useState, useEffect, useRef } from "react";
import { STUDIO_CONFIG } from "@/data/works";
import { ArrowUpRight, Check, Loader2, ChevronDown, IndianRupee, Clapperboard } from "lucide-react";
import { sound } from "@/lib/sound";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";

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
      <FieldLabel className="flex items-center justify-between font-mono-code text-[11px] text-white/60 uppercase tracking-wider">
        <span className="flex items-center gap-1.5">
          {icon}
          {label} {required && <span className="text-orchid">*</span>}
        </span>
      </FieldLabel>

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
        className={`contact-select-trigger group relative flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-left transition-colors min-h-[48px] touch-manipulation cursor-pointer select-none ${
          isOpen ? "is-open" : ""
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
              isOpen ? "rotate-180 text-white" : "group-hover:text-white"
            }`}
          />
        </div>
      </button>

      {/* Dropdown Menu Panel */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute z-50 left-0 right-0 mt-2 max-h-72 overflow-y-auto rounded-xl border border-white/15 bg-[#12100f]/98 p-1.5 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150"
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
      errors.name = "Please fill out this field.";
    }

    if (!formData.email.trim()) {
      errors.email = "Please fill out this field.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        errors.email = "Please enter a valid email address.";
      }
    }

    if (!formData.message.trim()) {
      errors.message = "Please fill out this field.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setErrorMessage("Please complete all required fields.");
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
              {/* Studio availability badge - Bespoke Editorial Cinema aesthetic */}
              <div className="inline-flex items-center gap-2.5 sm:gap-3 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 backdrop-blur-md transition-all duration-300 hover:border-orchid/40">
                <span className="relative flex h-2 w-2 items-center justify-center shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orchid opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-orchid" />
                </span>
                <span className="font-mono-code text-[11px] sm:text-xs tracking-wider text-bone uppercase font-medium">
                  ACCEPTING COMMISSIONS <span className="text-orchid font-bold mx-1">//</span> 2025–2026
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

          {/* Right Column: Redesigned Inquiry Form */}
          <div className="lg:col-span-7">
            <div
              className={`relative transition-transform duration-200 ${
                isShaking ? "animate-ui-shake" : ""
              }`}
            >
              {status === "success" ? (
                <div className="py-12 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
                  <div className="mx-auto flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full border border-orchid/50 bg-orchid/15 text-orchid">
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
                  className="space-y-6 sm:space-y-7"
                >
                  {/* Honeypot anti-spam field */}
                  <div className="hidden" aria-hidden="true">
                    <input
                      type="text"
                      name="honeypot"
                      tabIndex={-1}
                      autoComplete="off"
                      suppressHydrationWarning
                      value={formData.honeypot}
                      onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                    />
                  </div>

                  {/* Form Sub-Header with Cinema Clapperboard Icon */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-2">
                      <Clapperboard className="h-4 w-4 text-white/70" strokeWidth={1.8} />
                      <span className="font-mono-code text-xs font-semibold tracking-wider text-white uppercase">
                        COMMISSION BRIEF
                      </span>
                    </div>
                    <span className="font-mono-code text-[11px] text-white/40">
                      * REQUIRED FIELDS
                    </span>
                  </div>

                  <FieldGroup className="space-y-5 sm:space-y-6">
                    {/* 1. Name & 2. Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <Field data-invalid={!!fieldErrors.name} className="gap-2">
                        <FieldLabel
                          htmlFor="name"
                          className={`font-mono-code text-[11px] uppercase tracking-wider transition-colors ${
                            fieldErrors.name ? "text-rose-400 font-semibold" : "text-white/60"
                          }`}
                        >
                          NAME <span className={fieldErrors.name ? "text-rose-400" : "text-orchid"}>*</span>
                        </FieldLabel>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          autoComplete="name"
                          suppressHydrationWarning
                          placeholder="e.g. Sayan Patra"
                          value={formData.name}
                          onChange={(e) => {
                            setFormData({ ...formData, name: e.target.value });
                            if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: undefined }));
                            if (status === "error") setStatus("idle");
                          }}
                          className={`contact-field-input w-full rounded-xl px-4 py-3.5 text-base sm:text-sm text-white placeholder-white/20 min-h-[48px] ${
                            fieldErrors.name ? "has-error" : ""
                          }`}
                        />
                        {fieldErrors.name && (
                          <FieldError className="font-mono-code text-[11px] text-rose-400 flex items-center gap-1.5 mt-0.5 tracking-wide">
                            <span className="h-1 w-1 rounded-full bg-rose-400 shrink-0" />
                            <span>{fieldErrors.name}</span>
                          </FieldError>
                        )}
                      </Field>

                      <Field data-invalid={!!fieldErrors.email} className="gap-2">
                        <FieldLabel
                          htmlFor="email"
                          className={`font-mono-code text-[11px] uppercase tracking-wider transition-colors ${
                            fieldErrors.email ? "text-rose-400 font-semibold" : "text-white/60"
                          }`}
                        >
                          EMAIL <span className={fieldErrors.email ? "text-rose-400" : "text-orchid"}>*</span>
                        </FieldLabel>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          suppressHydrationWarning
                          placeholder="you@domain.com"
                          value={formData.email}
                          onChange={(e) => {
                            setFormData({ ...formData, email: e.target.value });
                            if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }));
                            if (status === "error") setStatus("idle");
                          }}
                          className={`contact-field-input w-full rounded-xl px-4 py-3.5 text-base sm:text-sm text-white placeholder-white/20 min-h-[48px] ${
                            fieldErrors.email ? "has-error" : ""
                          }`}
                        />
                        {fieldErrors.email && (
                          <FieldError className="font-mono-code text-[11px] text-rose-400 flex items-center gap-1.5 mt-0.5 tracking-wide">
                            <span className="h-1 w-1 rounded-full bg-rose-400 shrink-0" />
                            <span>{fieldErrors.email}</span>
                          </FieldError>
                        )}
                      </Field>
                    </div>

                    {/* 3. Company / Production Name (Optional) */}
                    <Field className="gap-2">
                      <FieldLabel
                        htmlFor="company"
                        className="font-mono-code text-[11px] text-white/60 uppercase tracking-wider"
                      >
                        COMPANY / PRODUCTION NAME <span className="text-white/35 font-normal">(OPTIONAL)</span>
                      </FieldLabel>
                      <input
                        id="company"
                        name="company"
                        type="text"
                        autoComplete="organization"
                        suppressHydrationWarning
                        placeholder="e.g. Warner Bros. / Maison Margiela / Independent"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="contact-field-input w-full rounded-xl px-4 py-3.5 text-base sm:text-sm text-white placeholder-white/20 min-h-[48px]"
                      />
                    </Field>

                    {/* 4. Pricing in INR (Dropdown) */}
                    <Field className="gap-2">
                      <CustomSelect
                        label="PRICING IN INR (₹)"
                        required
                        icon={<IndianRupee className="h-3.5 w-3.5 text-orchid" />}
                        value={formData.pricingInr}
                        options={PRICING_INR_OPTIONS}
                        onChange={(val) => setFormData((prev) => ({ ...prev, pricingInr: val }))}
                      />
                    </Field>

                    {/* 5. Primary Interest (Proper Dropdown) */}
                    <Field className="gap-2">
                      <CustomSelect
                        label="PRIMARY INTEREST"
                        required
                        value={formData.primaryInterest}
                        options={PRIMARY_INTEREST_OPTIONS}
                        onChange={(val) => setFormData((prev) => ({ ...prev, primaryInterest: val }))}
                      />
                    </Field>

                    {/* 6. Tell us about narrative/scope */}
                    <Field data-invalid={!!fieldErrors.message} className="gap-2">
                      <FieldLabel
                        htmlFor="message"
                        className={`font-mono-code text-[11px] uppercase tracking-wider transition-colors ${
                          fieldErrors.message ? "text-rose-400 font-semibold" : "text-white/60"
                        }`}
                      >
                        TELL US ABOUT NARRATIVE / SCOPE <span className={fieldErrors.message ? "text-rose-400" : "text-orchid"}>*</span>
                      </FieldLabel>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        suppressHydrationWarning
                        placeholder="Concept synopsis, expected timeline, location aspirations, technical specs (e.g. 35mm film or digital cinema)..."
                        value={formData.message}
                        onChange={(e) => {
                          setFormData({ ...formData, message: e.target.value });
                          if (fieldErrors.message) setFieldErrors((prev) => ({ ...prev, message: undefined }));
                          if (status === "error") setStatus("idle");
                        }}
                        className={`contact-field-input w-full rounded-xl p-4 text-base sm:text-sm text-white placeholder-white/20 resize-y min-h-[110px] ${
                          fieldErrors.message ? "has-error" : ""
                        }`}
                      />
                      {fieldErrors.message && (
                        <FieldError className="font-mono-code text-[11px] text-rose-400 flex items-center gap-1.5 mt-0.5 tracking-wide">
                          <span className="h-1 w-1 rounded-full bg-rose-400 shrink-0" />
                          <span>{fieldErrors.message}</span>
                        </FieldError>
                      )}
                    </Field>
                  </FieldGroup>

                  {/* Minimal Global Status if Non-Field Error */}
                  {status === "error" && errorMessage && Object.keys(fieldErrors).length === 0 && (
                    <div className="flex items-center gap-2 font-mono-code text-xs text-rose-400 pt-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-pulse" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* 7. Submit Option */}
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    data-cursor="SUBMIT"
                    className="group relative flex w-full items-center justify-center gap-3 rounded-xl border border-orchid bg-orchid px-6 py-4 font-mono-code text-xs sm:text-sm font-bold tracking-widest text-white uppercase transition-all duration-300 hover:bg-orchid-dark disabled:opacity-50 min-h-[50px] touch-manipulation cursor-pointer active:scale-[0.99] select-none"
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
