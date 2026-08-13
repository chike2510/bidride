"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function Avatar({
  src,
  alt,
  size = 48,
  online = false,
  className,
}: {
  src: string;
  alt: string;
  size?: number;
  online?: boolean;
  className?: string;
}) {
  const [failed, setFailed] = useState(!src);

  return (
    <div className={cn("relative shrink-0", className)} style={{ width: size, height: size }}>
      {failed ? (
        <div
          className="h-full w-full rounded-full bg-navy text-white flex items-center justify-center font-display font-bold"
          style={{ fontSize: Math.max(12, size * 0.32) }}
          aria-label={alt}
        >
          {initials(alt)}
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={`${size}px`}
          className="rounded-full object-cover bg-bg"
          onError={() => setFailed(true)}
        />
      )}
      {online && (
        <span
          className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-success ring-2 ring-white"
          aria-label="Online"
        />
      )}
    </div>
  );
}
