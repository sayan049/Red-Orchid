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
      <div className="h-9 inline-flex items-center gap-2 font-mono-code text-xs text-white/50 px-3 py-1.5 select-none leading-none">
        <span className="tracking-wider uppercase">{label}</span>
        <span>--:--:--</span>
      </div>
    );
  }

  return (
    <div
      className="h-9 inline-flex items-center gap-2 font-mono-code text-xs text-white/70 px-3 py-1.5 select-none leading-none"
      title={`Live studio time in ${timezone}`}
    >
      <span className="tracking-wider text-white/50 uppercase">{label}</span>
      <span className="font-medium text-white/90 tabular-nums">{timeString} IST</span>
    </div>
  );
}
