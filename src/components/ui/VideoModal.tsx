"use client";

import { useEffect, useRef, useState } from "react";
import { X, Play, Pause, Volume2, VolumeX, Maximize2 } from "lucide-react";
import { formatTimecode } from "@/lib/utils";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
  title: string;
  aspectRatio?: string;
}

export function VideoModal({
  isOpen,
  onClose,
  videoUrl,
  title,
  aspectRatio = "2.39:1",
}: VideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  // Close on Escape & handle space key play/pause
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === " " && e.target === document.body) {
        e.preventDefault();
        togglePlay();
      } else if (e.key.toLowerCase() === "m") {
        toggleMute();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Autoplay video on modal open
  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    } else if (!isOpen && videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isOpen]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      videoRef.current.requestFullscreen().catch(() => {});
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 sm:p-6 md:p-10 backdrop-blur-2xl"
    >
      {/* Click outside backdrop */}
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-6xl overflow-hidden rounded-xl border border-white/10 bg-[#0c0a09] shadow-2xl">
        {/* Top cinema header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-black/60">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-orchid animate-pulse" />
            <h3 className="font-display text-sm font-semibold tracking-wider text-bone uppercase truncate max-w-md">
              {title}
            </h3>
            <span className="font-mono-code text-[11px] text-white/40">
              [{aspectRatio}]
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            data-cursor="CLOSE"
            aria-label="Close cinema player"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition-colors hover:border-white/40 hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>

        {/* Video container */}
        <div
          className="relative w-full bg-black flex items-center justify-center cursor-pointer"
          onClick={togglePlay}
        >
          <video
            ref={videoRef}
            src={videoUrl}
            playsInline
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            className="w-full max-h-[72vh] object-contain"
          />

          {/* Big center play icon when paused */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white shadow-xl transition-transform hover:scale-110">
                <Play className="h-6 w-6 fill-current ml-1 text-orchid" />
              </div>
            </div>
          )}
        </div>

        {/* Bottom playback chrome */}
        <div className="border-t border-white/10 bg-black/80 px-6 py-3.5 flex flex-col gap-2">
          {/* Progress bar */}
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            aria-label="Seek video progress"
            className="h-1 w-full appearance-none rounded-full bg-white/20 accent-orchid cursor-pointer"
          />

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause" : "Play"}
                className="text-white/80 hover:text-white transition-colors"
              >
                {isPlaying ? <Pause className="h-4 w-4" strokeWidth={1.5} /> : <Play className="h-4 w-4 fill-current" />}
              </button>

              <button
                type="button"
                onClick={toggleMute}
                aria-label={isMuted ? "Unmute" : "Mute"}
                className="text-white/80 hover:text-white transition-colors"
              >
                {isMuted ? <VolumeX className="h-4 w-4 text-orchid" strokeWidth={1.5} /> : <Volume2 className="h-4 w-4" strokeWidth={1.5} />}
              </button>

              {/* Precise timecode */}
              <div className="font-mono-code text-[11px] text-white/60 tabular-nums">
                <span>{formatTimecode(currentTime)}</span>
                <span className="text-white/30 mx-1.5">/</span>
                <span>{formatTimecode(duration)}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono-code text-[10px] text-white/40 uppercase hidden sm:inline">
                PRESS ESC TO EXIT
              </span>
              <button
                type="button"
                onClick={toggleFullscreen}
                aria-label="Toggle Fullscreen"
                className="text-white/80 hover:text-white transition-colors"
              >
                <Maximize2 className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
