"use client";

import { useEffect, useState } from "react";

interface LiveTimeProps {
  timezone?: string;
  label?: string;
  showSeconds?: boolean;
}

export function LiveTime({
  timezone = "Asia/Kolkata",
  label = "KOLKATA, IN",
  showSeconds = true,
}: LiveTimeProps) {
  const [timeString, setTimeString] = useState<string>("");
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);

    const updateTime = () => {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
        second: showSeconds ? "2-digit" : undefined,
        hour12: false,
      });
      setTimeString(formatter.format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [timezone, showSeconds]);

  if (!isClient) {
    return (
      <div className="flex items-center gap-2 font-mono-code text-[11px] text-white/50">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/50" />
        <span>{label}</span>
        <span>--:--:--</span>
      </div>
    );
  }

  return (
    <div
      className="flex items-center gap-2 font-mono-code text-[11px] text-white/70"
      title={`Live studio time in ${timezone}`}
    >
      <span className="relative flex h-2 w-2 items-center justify-center">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
      </span>
      <span className="tracking-wider text-white/50 uppercase">{label}</span>
      <span className="font-medium text-white/90 tabular-nums">{timeString} IST</span>
    </div>
  );
}
