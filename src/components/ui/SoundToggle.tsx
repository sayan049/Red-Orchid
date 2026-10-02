"use client";

import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { sound } from "@/lib/sound";

export function SoundToggle() {
  const [isEnabled, setIsEnabled] = useState<boolean>(true);

  const handleToggle = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    try {
      const active = sound.toggleSound();
      setIsEnabled(active);
    } catch {
      setIsEnabled((prev) => !prev);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      data-cursor="SOUND"
      aria-label={isEnabled ? "Mute all website audio" : "Enable website audio"}
      aria-pressed={isEnabled}
      className={`group h-9 inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-mono-code uppercase tracking-wider transition-colors touch-manipulation cursor-pointer select-none active:scale-95 ${
        isEnabled
          ? "text-white/80 hover:text-white hover:bg-white/10"
          : "text-white/40 hover:text-white/70 hover:bg-white/10"
      }`}
    >
      <div className="relative flex h-3.5 w-3.5 items-center justify-center shrink-0 pointer-events-none">
        {isEnabled ? (
          <Volume2 className="h-3.5 w-3.5 text-orchid transition-transform duration-200 group-hover:scale-110 pointer-events-none" strokeWidth={1.5} />
        ) : (
          <VolumeX className="h-3.5 w-3.5 text-white/40 transition-transform duration-200 group-hover:scale-110 pointer-events-none" strokeWidth={1.5} />
        )}
      </div>

      <span className="leading-none">
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
