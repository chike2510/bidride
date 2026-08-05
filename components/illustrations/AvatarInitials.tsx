import { cn } from "@/lib/utils";

// A small set of on-brand tint pairs (bg tint / text) so avatars feel varied
// but never clash with the navy/gold palette.
const PALETTE: { bg: string; text: string }[] = [
  { bg: "#FDECC8", text: "#B97A00" }, // gold tint
  { bg: "#DCEAE1", text: "#1F6B45" }, // success tint
  { bg: "#E4E7F0", text: "#14213D" }, // navy tint
  { bg: "#FBE0DB", text: "#C24732" }, // urgency tint
  { bg: "#E1EEF6", text: "#2C6E93" }, // blue tint
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function initialsFor(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export function AvatarInitials({
  name,
  size = 48,
  online = false,
  className,
}: {
  name: string;
  size?: number;
  online?: boolean;
  className?: string;
}) {
  const palette = PALETTE[hashString(name) % PALETTE.length];
  const initials = initialsFor(name) || "?";

  return (
    <div className={cn("relative shrink-0", className)} style={{ width: size, height: size }}>
      <div
        className="h-full w-full rounded-full flex items-center justify-center font-display font-bold select-none"
        style={{
          backgroundColor: palette.bg,
          color: palette.text,
          fontSize: size * 0.36,
        }}
      >
        {initials}
      </div>
      {online && (
        <span
          className="absolute bottom-0 right-0 rounded-full bg-success ring-2 ring-white"
          style={{ width: size * 0.26, height: size * 0.26 }}
        />
      )}
    </div>
  );
}
