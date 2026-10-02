"use client";

import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/frequently-asked-questions-with-accordion-utils/accordion";

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FrequentlyAskedQuestionsProps {
  title?: string;
  description?: string;
  data?: FAQItem[];
  className?: string;
  supportEmail?: string;
}

export const defaultFAQs: FAQItem[] = [
  {
    question: "What camera systems and celluloid formats does Red Orchid specialize in?",
    answer:
      "We specialize in authentic 35mm motion picture film (Kodak Vision3 500T, 250D, and 50D) captured on Arriflex and Panavision cameras, as well as digital cinema systems including the ARRI Alexa 35, Sony Venice 2, and Hasselblad H6D medium format for large-scale editorial stills.",
  },
  {
    question: "Where is your atelier based and do you accept international commissions?",
    answer:
      "Our main studio facilities and equipment ateliers are based in Kolkata and Mumbai, India. We frequently deploy full production crews internationally across Europe, East Asia, and the Americas for narrative films, fashion campaigns, and global commercial syndication.",
  },
  {
    question: "What does the complete production pipeline look like?",
    answer:
      "Our process encompasses the full narrative continuum: script development, visual storyboard conceptualization, casting, location scouting, principal 35mm/digital photography, 4K/6K negative scanning, original sound design, and master ACEScct DaVinci Resolve color grading.",
  },
  {
    question: "What is your typical turnaround timeline for commissions?",
    answer:
      "Commercial campaigns and editorial short films typically require 3 to 6 weeks from creative brief to final delivery. Narrative short films and complex celluloid projects are tailored individually, generally spanning 2 to 4 months.",
  },
  {
    question: "Can we commission stills photography alongside cinema production?",
    answer:
      "Yes. Sayan Patra and our atelier team frequently execute dual cinema-and-stills packages, utilizing 35mm and medium format analog cameras during principal photography to create cohesive, gallery-grade promotional suites.",
  },
  {
    question: "How do we initiate a production inquiry or request a treatment?",
    answer:
      "You can submit an inquiry through our Commission Brief form on this page or email us directly at hello@redorchidfilms.com. We review briefs and reply within 24 hours with scheduling and preliminary feasibility.",
  },
];

export default function FrequentlyAskedQuestions({
  title = "FREQUENTLY ASKED INQUIRIES",
  description = "Detailed insights into our celluloid workflows, international production capabilities, and technical delivery standards. For custom briefs, reach our atelier directly at",
  data = defaultFAQs,
  className,
  supportEmail = "hello@redorchidfilms.com",
}: FrequentlyAskedQuestionsProps) {
  const words = title.split(" ");

  return (
    <section
      id="faq"
      aria-label="Frequently Asked Questions"
      className={cn(
        "relative w-full overflow-hidden py-24 sm:py-32 bg-[#070707] border-t border-white/10 text-white",
        className
      )}
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-orchid/5 blur-[160px] pointer-events-none rounded-full" />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8 relative z-10">
        {/* Section Tag */}
        <div className="flex items-center justify-center gap-2 font-mono-code text-[11px] text-orchid uppercase tracking-widest mb-4">
          <span className="h-1.5 w-1.5 rounded-full bg-orchid animate-pulse" />
          <span>{"// ATELIER KNOWLEDGE & SCOPE"}</span>
        </div>

        {/* Animated Title */}
        <h2 className="relative z-10 mx-auto max-w-3xl text-center font-display text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-bone uppercase break-words">
          {words.map((word, index) => (
            <motion.span
              key={`${word}-${index}`}
              initial={{ opacity: 0, filter: "blur(6px)", y: 12 }}
              whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.4,
                delay: index * 0.08,
                ease: "easeInOut",
              }}
              className="mr-2.5 inline-block"
            >
              {word}
            </motion.span>
          ))}
        </h2>

        {/* Subtitle Description */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative z-10 mx-auto mt-5 max-w-2xl text-center font-sans-ui text-xs sm:text-sm md:text-base text-white/60 leading-relaxed"
        >
          {description}{" "}
          <a
            href={`mailto:${supportEmail}`}
            className="text-orchid font-mono-code underline underline-offset-4 hover:text-rose-400 transition-colors"
          >
            {supportEmail}
          </a>
        </motion.p>

        {/* Accordion Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 sm:mt-16 rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-8 backdrop-blur-md"
        >
          <Accordion type="single" collapsible className="w-full">
            {data.map((item, index) => (
              <motion.div
                key={`faq-${index}`}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.35,
                  delay: 0.3 + index * 0.05,
                  ease: "easeOut",
                }}
              >
                <AccordionItem value={`item-${index}`}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
