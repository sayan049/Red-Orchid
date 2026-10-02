"use client";

import React, { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { sound } from "@/lib/sound";
import { cn } from "@/lib/utils";

export interface MetallicButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  icon?: React.ReactNode;
  iconPlacement?: "left" | "right";
  size?: "sm" | "md" | "lg" | "xl" | "icon";
  metallicColor?: "graphite" | "silver";
  borderRadius?: string;
  loading?: boolean;
}

const sizeStyles = {
  sm: "h-9 px-3.5 text-xs font-medium tracking-wider",
  md: "h-11 px-5 text-xs sm:text-sm font-semibold tracking-wider",
  lg: "h-13 px-7 text-sm font-semibold tracking-widest min-h-[50px]",
  xl: "h-14 px-8 text-sm sm:text-base font-bold tracking-widest min-h-[54px]",
  icon: "h-10 w-10 p-0",
};

export const MetallicButton = forwardRef<HTMLButtonElement, MetallicButtonProps>(
  (
    {
      text,
      children,
      icon,
      iconPlacement = "right",
      size = "md",
      metallicColor = "graphite",
      borderRadius = "rounded-xl",
      loading = false,
      disabled = false,
      className,
      onClick,
      type = "button",
      ...props
    },
    ref
  ) => {
    const isGraphite = metallicColor === "graphite";
    const innerRadius =
      borderRadius === "rounded-xl"
        ? "rounded-[11px]"
        : borderRadius === "rounded-lg"
        ? "rounded-[7px]"
        : borderRadius === "rounded-full"
        ? "rounded-full"
        : "rounded-[9px]";

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || loading) return;
      try {
        sound.playClick();
      } catch {}
      if (onClick) {
        onClick(e);
      }
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        onClick={handleClick}
        className={cn(
          "metallic-btn-root group select-none outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:opacity-45 disabled:pointer-events-none disabled:cursor-not-allowed",
          isGraphite ? "metallic-btn-graphite" : "metallic-btn-silver",
          borderRadius,
          className
        )}
        {...props}
      >
        <span
          className={cn(
            "metallic-btn-inner text-bone group-hover:text-white font-sans",
            sizeStyles[size],
            innerRadius
          )}
        >
          {/* Subtle micro-brushed hairline striations */}
          <span className="metallic-btn-brush" aria-hidden="true" />

          {/* Liquid-metal reflection sheen */}
          <span className="metallic-btn-reflection" aria-hidden="true" />

          {/* Upper surface specular highlight rim */}
          <span
            className="absolute top-0 left-3 right-3 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none opacity-75 group-hover:opacity-100 transition-opacity"
            aria-hidden="true"
          />

          {/* Content */}
          <span className="relative z-10 flex items-center justify-center gap-2.5">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin text-white/70" />
            ) : (
              <>
                {icon && iconPlacement === "left" && (
                  <span className="shrink-0 transition-transform duration-300 group-hover:-translate-x-0.5">
                    {icon}
                  </span>
                )}
                <span>{text || children}</span>
                {icon && iconPlacement === "right" && (
                  <span className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    {icon}
                  </span>
                )}
              </>
            )}
          </span>
        </span>
      </button>
    );
  }
);

MetallicButton.displayName = "MetallicButton";
