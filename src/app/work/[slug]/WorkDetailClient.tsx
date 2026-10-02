"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Play, Pause, Volume2, VolumeX, Maximize2 } from "lucide-react";
import { WorkItem, StillItem } from "@/types";
import { Lightbox } from "@/components/ui/Lightbox";
import { formatTimecode } from "@/lib/utils";

interface WorkDetailClientProps {
  work: WorkItem;
}

export function WorkDetailClient({ work }: WorkDetailClientProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [lightboxData, setLightboxData] = useState<{
    isOpen: boolean;
    initialIndex: number;
    stills: StillItem[];
  }>({
    isOpen: false,
    initialIndex: 0,
    stills: [],
  });

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
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

  const openLightbox = (index: number) => {
    setLightboxData({
      isOpen: true,
      initialIndex: index,
      stills: work.stills,
    });
  };

  return (
    <>
      {/* Hero Media Stage: In-Place Cinema Player */}
      <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0d0b0a] shadow-2xl">
        <div
          className={`relative w-full ${
            work.aspectRatio === "2.39:1"
              ? "aspect-[21/9]"
              : work.aspectRatio === "9:16"
              ? "aspect-[16/10] max-h-[720px]"
              : "aspect-[16/9]"
          } overflow-hidden bg-black`}
        >
          {/* Static Poster image (fades out when video starts playing) */}
          <Image
            src={work.coverImage}
            alt={work.title}
            fill
            priority
            sizes="100vw"
            className={`object-cover filter brightness-90 transition-opacity duration-700 ${
              isPlaying ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          />

          {/* Embedded in-place video player */}
          {work.videoUrl && (
            <video
              ref={videoRef}
              src={work.videoUrl}
              playsInline
              loop
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              className={`absolute inset-0 h-full w-full object-contain bg-black ${
                isPlaying ? "opacity-100 z-10" : "opacity-0 pointer-events-none"
              }`}
            />
          )}

          {/* Center Play Button Overlay when paused */}
          {!isPlaying && work.videoUrl && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/30 backdrop-blur-[1px]">
              <button
                type="button"
                onClick={togglePlay}
                data-cursor="PLAY IN-PLACE"
                aria-label={`Play film ${work.title} in-place`}
                className="group flex items-center gap-4 rounded-full border border-white/30 bg-black/70 px-7 py-4 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-orchid hover:bg-orchid hover:text-white shadow-2xl"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black transition-transform group-hover:scale-110">
                  <Play className="h-4 w-4 fill-current ml-0.5" />
                </div>
                <span className="font-mono-code text-xs font-bold tracking-widest text-white uppercase">
                  PLAY FILM MASTER IN-PLACE ({work.duration || "PLAY"})
                </span>
              </button>
            </div>
          )}

          {/* In-place cinema playback controls when playing */}
          {isPlaying && (
            <div className="absolute bottom-0 inset-x-0 z-30 flex flex-col gap-2 bg-gradient-to-t from-black via-black/80 to-transparent p-6 pt-12">
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                aria-label="Seek video"
                className="h-1 w-full appearance-none rounded-full bg-white/20 accent-orchid cursor-pointer"
              />

              <div className="flex items-center justify-between text-xs font-mono-code pt-1">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="text-white hover:text-orchid transition-colors"
                  >
                    <Pause className="h-4 w-4 fill-current" />
                  </button>

                  <button
                    type="button"
                    onClick={toggleMute}
                    className="text-white hover:text-orchid transition-colors"
                  >
                    {isMuted ? <VolumeX className="h-4 w-4 text-orchid" /> : <Volume2 className="h-4 w-4" />}
                  </button>

                  <span className="text-white/70 tabular-nums">
                    {formatTimecode(currentTime)} / {formatTimecode(duration)}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-[10px] text-white/50 hidden sm:inline uppercase">
                    {work.aspectRatio} // MASTER PRINT
                  </span>
                  <button
                    type="button"
                    onClick={toggleFullscreen}
                    className="text-white/70 hover:text-white"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Framing guides cue when paused */}
          {!isPlaying && (
            <div className="absolute top-4 right-4 z-20 font-mono-code text-[10px] text-white/50 bg-black/60 px-2.5 py-1 rounded backdrop-blur-xs">
              {work.aspectRatio} // MASTER PRINT
            </div>
          )}
        </div>
      </div>

      {/* Production Stills Gallery Section */}
      {work.stills && work.stills.length > 0 && (
        <div className="mt-20">
          <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
            <span className="font-mono-code text-xs text-orchid uppercase tracking-widest">
              // PRODUCTION STILLS & FRAME GRABS
            </span>
            <span className="font-mono-code text-xs text-white/40">
              {work.stills.length} FRAMES ARCHIVED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {work.stills.map((still, idx) => (
              <div
                key={still.id}
                onClick={() => openLightbox(idx)}
                data-cursor="EXPAND"
                className="group relative cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-[#111010] aspect-[16/10] transition-all duration-300 hover:border-white/30"
              >
                <Image
                  src={still.url}
                  alt={still.caption || `${work.title} still ${idx + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-90 group-hover:brightness-100"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs">
                  <span className="font-mono-code text-[10px] text-white/80 truncate">
                    {still.caption || "Frame Grab"}
                  </span>
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white/80">
                    <Maximize2 className="h-3 w-3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox for Stills */}
      <Lightbox
        isOpen={lightboxData.isOpen}
        onClose={() => setLightboxData({ ...lightboxData, isOpen: false })}
        stills={lightboxData.stills}
        initialIndex={lightboxData.initialIndex}
      />
    </>
  );
}
