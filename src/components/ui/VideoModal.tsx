"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { X, Play, Pause, Volume2, VolumeX, Maximize2, ChevronLeft, ChevronRight } from "lucide-react";
import { formatTimecode } from "@/lib/utils";
import { sound } from "@/lib/sound";

export interface VideoModalItem {
  url: string;
  title: string;
  aspectRatio?: string;
  client?: string;
  category?: string;
  year?: string;
  synopsis?: string;
}

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Single item fallback
  videoUrl?: string;
  title?: string;
  aspectRatio?: string;
  // Playlist / Collection
  items?: VideoModalItem[];
  currentIndex?: number;
  onIndexChange?: (index: number) => void;
}

export function VideoModal({
  isOpen,
  onClose,
  videoUrl,
  title = "Cinema Reel",
  aspectRatio = "2.39:1",
  items,
  currentIndex = 0,
  onIndexChange,
}: VideoModalProps) {
  const [internalIndex, setInternalIndex] = useState<number>(currentIndex);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  // Synchronize index
  useEffect(() => {
    setInternalIndex(currentIndex);
  }, [currentIndex, isOpen]);

  const playlist: VideoModalItem[] = items && items.length > 0
    ? items
    : videoUrl
    ? [{ url: videoUrl, title, aspectRatio }]
    : [];

  const count = playlist.length;
  const activeItem = playlist[internalIndex] || {
    url: videoUrl || "",
    title,
    aspectRatio,
  };

  const handleNext = useCallback(() => {
    if (count <= 1) return;
    sound.playClick();
    const nextIdx = (internalIndex + 1) % count;
    setInternalIndex(nextIdx);
    if (onIndexChange) onIndexChange(nextIdx);
  }, [count, internalIndex, onIndexChange]);

  const handlePrev = useCallback(() => {
    if (count <= 1) return;
    sound.playClick();
    const prevIdx = (internalIndex - 1 + count) % count;
    setInternalIndex(prevIdx);
    if (onIndexChange) onIndexChange(prevIdx);
  }, [count, internalIndex, onIndexChange]);

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

  // Keyboard controls
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
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
  }, [isOpen, onClose, handleNext, handlePrev]);

  // Autoplay whenever activeItem changes or modal opens
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
  }, [isOpen, activeItem.url, internalIndex]);

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

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    setTouchStart(null);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={activeItem.title}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-3 sm:p-6 md:p-8 backdrop-blur-2xl select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Click outside backdrop */}
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Backward Navigation Button */}
      {count > 1 && (
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous video"
          className="absolute left-2 sm:left-4 md:left-6 z-20 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/20 bg-black/80 text-white backdrop-blur-md transition-all hover:scale-110 hover:border-white/50 hover:bg-white/15 cursor-pointer active:scale-95"
        >
          <ChevronLeft className="h-6 w-6" strokeWidth={1.5} />
        </button>
      )}

      {/* Forward Navigation Button */}
      {count > 1 && (
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next video"
          className="absolute right-2 sm:right-4 md:right-6 z-20 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/20 bg-black/80 text-white backdrop-blur-md transition-all hover:scale-110 hover:border-white/50 hover:bg-white/15 cursor-pointer active:scale-95"
        >
          <ChevronRight className="h-6 w-6" strokeWidth={1.5} />
        </button>
      )}

      <div className="relative z-10 w-full max-w-5xl overflow-hidden rounded-2xl border border-white/15 bg-[#0c0a09]">
        {/* Top cinema header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 sm:px-6 py-3.5 bg-black/70">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-orchid animate-pulse" />
            {count > 1 && (
              <span className="font-mono-code text-xs text-orchid font-semibold">
                {String(internalIndex + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
              </span>
            )}
            <h3 className="font-display text-sm font-semibold tracking-wider text-bone uppercase truncate max-w-[200px] sm:max-w-md">
              {activeItem.title}
            </h3>
            {activeItem.aspectRatio && (
              <span className="font-mono-code text-[11px] text-white/40 hidden sm:inline">
                [{activeItem.aspectRatio}]
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            data-cursor="CLOSE"
            aria-label="Close cinema player"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-colors hover:border-white/40 hover:bg-white/15 hover:text-white cursor-pointer"
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>

        {/* Video container */}
        <div
          className="relative w-full bg-black flex items-center justify-center cursor-pointer min-h-[280px] sm:min-h-[420px]"
          onClick={togglePlay}
        >
          <video
            ref={videoRef}
            key={activeItem.url}
            src={activeItem.url}
            playsInline
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            className="w-full max-h-[68vh] object-contain"
          />

          {/* Big center play icon when paused */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-black/75 text-white transition-transform hover:scale-110">
                <Play className="h-6 w-6 fill-current ml-1 text-orchid" />
              </div>
            </div>
          )}
        </div>

        {/* Bottom playback chrome */}
        <div className="border-t border-white/10 bg-black/85 px-5 sm:px-6 py-3.5 flex flex-col gap-2">
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
                className="text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                {isPlaying ? <Pause className="h-4 w-4" strokeWidth={1.5} /> : <Play className="h-4 w-4 fill-current" />}
              </button>

              <button
                type="button"
                onClick={toggleMute}
                aria-label={isMuted ? "Unmute" : "Mute"}
                className="text-white/80 hover:text-white transition-colors cursor-pointer"
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
                {count > 1 ? "ARROWS: MOVE BACK/FORWARD • ESC: EXIT" : "PRESS ESC TO EXIT"}
              </span>
              <button
                type="button"
                onClick={toggleFullscreen}
                aria-label="Toggle Fullscreen"
                className="text-white/80 hover:text-white transition-colors cursor-pointer p-1"
                title="Fullscreen"
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
