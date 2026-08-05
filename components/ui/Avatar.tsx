import Image from "next/image";
import { cn } from "@/lib/utils";

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
  return (
    <div className={cn("relative shrink-0", className)} style={{ width: size, height: size }}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={`${size}px`}
        className="rounded-full object-cover bg-bg"
      />
      {online && (
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-success ring-2 ring-white" />
      )}
    </div>
  );
}
