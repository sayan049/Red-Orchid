"use client";

import React, { memo, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useMotionValue, animate, motion } from "motion/react";
import useMeasure from "react-use-measure";

export type Logo = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  label?: string;
};

export type InfiniteSliderProps = {
  children: React.ReactNode;
  gap?: number;
  duration?: number;
  durationOnHover?: number;
  direction?: "horizontal" | "vertical";
  reverse?: boolean;
  className?: string;
};

export const InfiniteSlider = memo(function InfiniteSlider({
  children,
  gap = 16,
  duration = 25,
  durationOnHover,
  direction = "horizontal",
  reverse = false,
  className,
}: InfiniteSliderProps) {
  const [currentDuration, setCurrentDuration] = useState(duration);
  const [ref, { width, height }] = useMeasure();
  const translation = useMotionValue(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const size = direction === "horizontal" ? width : height;
    if (!size || size <= 0) return;

    const contentSize = size + gap;
    const from = reverse ? -contentSize / 2 : 0;
    const to = reverse ? 0 : -contentSize / 2;

    let controls: { stop: () => void } | undefined;

    if (isTransitioning) {
      controls = animate(translation, [translation.get(), to], {
        ease: "linear",
        duration:
          currentDuration * Math.abs((translation.get() - to) / contentSize),
        onComplete: () => {
          setIsTransitioning(false);
          setKey((prev) => prev + 1);
        },
      });
    } else {
      controls = animate(translation, [from, to], {
        ease: "linear",
        duration: currentDuration,
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 0,
        onRepeat: () => translation.set(from),
      });
    }

    return () => controls?.stop();
  }, [
    key,
    translation,
    currentDuration,
    width,
    height,
    gap,
    isTransitioning,
    direction,
    reverse,
  ]);

  const hoverProps = durationOnHover
    ? {
        onHoverStart: () => {
          setIsTransitioning(true);
          setCurrentDuration(durationOnHover);
        },
        onHoverEnd: () => {
          setIsTransitioning(true);
          setCurrentDuration(duration);
        },
      }
    : {};

  return (
    <div className={cn("overflow-hidden w-full", className)}>
      <motion.div
        ref={ref}
        className="flex w-max shrink-0"
        style={{
          ...(direction === "horizontal"
            ? { x: translation }
            : { y: translation }),
          gap: `${gap}px`,
          flexDirection: direction === "horizontal" ? "row" : "column",
        }}
        {...hoverProps}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
});

export const LogoImage = memo(function LogoImage({ logo }: { logo: Logo }) {
  return (
    <div className="flex items-center justify-center h-12 px-6 py-2.5 rounded-xl bg-white/[0.03] border border-white/8 hover:border-orchid/40 hover:bg-white/[0.07] transition-all duration-300 group/logo select-none">
      <img
        alt={logo.alt}
        src={logo.src}
        width={logo.width ?? 120}
        height={logo.height ?? 24}
        loading="lazy"
        className="pointer-events-none h-4 sm:h-5 max-w-[120px] select-none object-contain filter brightness-0 invert opacity-65 group-hover/logo:opacity-100 transition-opacity"
      />
      {logo.label && (
        <span className="font-mono-code text-[11px] uppercase tracking-wider text-white/70 ml-2 group-hover/logo:text-white transition-colors">
          {logo.label}
        </span>
      )}
    </div>
  );
});

export interface LogoMarqueeProps {
  logos: Logo[];
  secondRowLogos?: Logo[];
  twoLines?: boolean;
  className?: string;
  gap?: number;
  duration?: number;
  durationOnHover?: number;
}

export const LogoMarquee = memo(function LogoMarquee({
  logos,
  secondRowLogos,
  twoLines = false,
  className,
  gap = 32,
  duration = 60,
  durationOnHover = 25,
}: LogoMarqueeProps) {
  // If twoLines is enabled or secondRowLogos is provided, render two rows moving in opposite directions
  const isTwoRows = twoLines || (secondRowLogos && secondRowLogos.length > 0);

  // If secondRowLogos is not provided but twoLines is true, split or alternate logos
  const row1 = logos;
  const row2 = secondRowLogos && secondRowLogos.length > 0
    ? secondRowLogos
    : [...logos].reverse();

  return (
    <div
      className={cn(
        "max-w-7xl mx-auto overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)] space-y-4",
        className,
      )}
    >
      {/* Line 1: Forward Direction */}
      <InfiniteSlider
        gap={gap}
        reverse={false}
        duration={duration}
        durationOnHover={durationOnHover}
      >
        {row1.map((logo, i) => (
          <LogoImage key={`r1-${logo.alt}-${i}`} logo={logo} />
        ))}
      </InfiniteSlider>

      {/* Line 2: Opposite Direction (if twoLines or secondRowLogos) */}
      {isTwoRows && (
        <InfiniteSlider
          gap={gap}
          reverse={true}
          duration={duration}
          durationOnHover={durationOnHover}
        >
          {row2.map((logo, i) => (
            <LogoImage key={`r2-${logo.alt}-${i}`} logo={logo} />
          ))}
        </InfiniteSlider>
      )}
    </div>
  );
});

LogoMarquee.displayName = "LogoMarquee";
export default LogoMarquee;
