"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

export function SoundToggle() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const osc1Ref = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);

  const initAudio = () => {
    if (audioCtxRef.current) return;

    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      // Master gain node with smooth ramping
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.connect(ctx.destination);
      gainNodeRef.current = gain;

      // Lowpass filter for warm celluloid / tape tone
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(320, ctx.currentTime);
      filter.Q.setValueAtTime(2, ctx.currentTime);
      filter.connect(gain);
      filterRef.current = filter;

      // Primary warm root oscillator (432Hz / 108Hz cinematic drone)
      const osc1 = ctx.createOscillator();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(108, ctx.currentTime);
      osc1.connect(filter);
      osc1.start();
      osc1Ref.current = osc1;

      // Subtle sub-fifth harmonic
      const osc2 = ctx.createOscillator();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(162, ctx.currentTime);
      
      const subGain = ctx.createGain();
      subGain.gain.setValueAtTime(0.3, ctx.currentTime);
      osc2.connect(subGain);
      subGain.connect(filter);
      osc2.start();
      osc2Ref.current = osc2;
    } catch {
      // Graceful fallback if Web Audio is unsupported
    }
  };

  const toggleSound = () => {
    if (!audioCtxRef.current) {
      initAudio();
    }

    const ctx = audioCtxRef.current;
    const gainNode = gainNodeRef.current;

    if (!ctx || !gainNode) return;

    if (ctx.state === "suspended") {
      ctx.resume();
    }

    if (isPlaying) {
      // Fade out smoothly
      const now = ctx.currentTime;
      gainNode.gain.cancelScheduledValues(now);
      gainNode.gain.setValueAtTime(gainNode.gain.value, now);
      gainNode.gain.exponentialRampToValueAtTime(0.00001, now + 0.8);
      setIsPlaying(false);
    } else {
      // Fade in gently
      const now = ctx.currentTime;
      gainNode.gain.cancelScheduledValues(now);
      gainNode.gain.setValueAtTime(0.0001, now);
      gainNode.gain.exponentialRampToValueAtTime(0.05, now + 1.2);
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <button
      type="button"
      onClick={toggleSound}
      data-cursor="SOUND"
      aria-label={isPlaying ? "Mute ambient cinema soundtrack" : "Play ambient cinema soundtrack"}
      aria-pressed={isPlaying}
      className="group flex items-center gap-2.5 rounded-full border border-white/10 bg-black/40 px-3.5 py-1.5 backdrop-blur-md transition-all duration-300 hover:border-white/30 hover:bg-white/5 focus-visible:outline-orchid"
    >
      <div className="relative flex h-3.5 w-3.5 items-center justify-center text-white/70 group-hover:text-white">
        {isPlaying ? (
          <Volume2 className="h-3.5 w-3.5 text-orchid transition-transform duration-200 group-hover:scale-110" />
        ) : (
          <VolumeX className="h-3.5 w-3.5 transition-transform duration-200 group-hover:scale-110" />
        )}
      </div>

      <span className="font-mono-code text-[11px] font-medium tracking-wider text-white/70 uppercase transition-colors group-hover:text-white">
        {isPlaying ? "SOUND ON" : "SOUND OFF"}
      </span>

      {/* Animated audio visualizer bars when sound is active */}
      <div className="flex h-3 items-end gap-0.5" aria-hidden="true">
        <span
          className={`w-0.5 rounded-full bg-orchid transition-all duration-300 ${
            isPlaying ? "h-3 animate-pulse" : "h-1 bg-white/20"
          }`}
        />
        <span
          className={`w-0.5 rounded-full bg-orchid transition-all duration-300 ${
            isPlaying ? "h-2 animate-bounce" : "h-1.5 bg-white/20"
          }`}
          style={{ animationDelay: "150ms" }}
        />
        <span
          className={`w-0.5 rounded-full bg-orchid transition-all duration-300 ${
            isPlaying ? "h-3.5 animate-pulse" : "h-1 bg-white/20"
          }`}
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </button>
  );
}
