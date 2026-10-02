"use client";

import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { sound } from "@/lib/sound";

export function SoundToggle() {
  const [isEnabled, setIsEnabled] = useState<boolean>(true);

  const handleToggle = () => {
    const active = sound.toggleSound();
    setIsEnabled(active);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      data-cursor="SOUND"
      aria-label={isEnabled ? "Mute all website audio" : "Enable website audio"}
      aria-pressed={isEnabled}
      className={`group flex items-center gap-2 rounded-full border px-3 sm:px-3.5 py-1.5 backdrop-blur-md transition-all duration-300 focus-visible:outline-orchid ${
        isEnabled
          ? "border-orchid/60 bg-orchid/20 text-white shadow-[0_0_15px_rgba(225,29,72,0.3)]"
          : "border-white/10 bg-black/40 text-white/70 hover:border-white/30 hover:bg-white/5 hover:text-white"
      }`}
    >
      <div className="relative flex h-3.5 w-3.5 items-center justify-center shrink-0">
        {isEnabled ? (
          <Volume2 className="h-3.5 w-3.5 text-orchid transition-transform duration-200 group-hover:scale-110" />
        ) : (
          <VolumeX className="h-3.5 w-3.5 transition-transform duration-200 group-hover:scale-110" />
        )}
      </div>

      <span className="font-mono-code text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase">
        {isEnabled ? "SOUND ON" : "SOUND OFF"}
      </span>

      {/* Audio indicator bars */}
      <div className="flex h-3 items-end gap-0.5 shrink-0" aria-hidden="true">
        <span
          className={`w-0.5 rounded-full transition-all duration-300 ${
            isEnabled ? "h-3 bg-orchid animate-pulse" : "h-1 bg-white/20"
          }`}
        />
        <span
          className={`w-0.5 rounded-full transition-all duration-300 ${
            isEnabled ? "h-2 bg-orchid animate-bounce" : "h-1.5 bg-white/20"
          }`}
          style={{ animationDelay: "150ms" }}
        />
        <span
          className={`w-0.5 rounded-full transition-all duration-300 ${
            isEnabled ? "h-3.5 bg-orchid animate-pulse" : "h-1 bg-white/20"
          }`}
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </button>
  );
}
