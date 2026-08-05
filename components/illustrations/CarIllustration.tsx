const COLOR_MAP: Record<string, { body: string; window: string }> = {
  Silver: { body: "#C7CDD6", window: "#14213D" },
  Black: { body: "#242B3D", window: "#0A0E1A" },
  Grey: { body: "#9AA3B2", window: "#14213D" },
  White: { body: "#F2F3F5", window: "#14213D" },
};

export function CarIllustration({
  color = "Silver",
  className,
}: {
  color?: string;
  className?: string;
}) {
  const c = COLOR_MAP[color] ?? COLOR_MAP.Silver;

  return (
    <svg viewBox="0 0 200 90" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* shadow */}
      <ellipse cx="100" cy="80" rx="78" ry="6" fill="#14213D" opacity="0.08" />
      {/* body */}
      <path
        d="M20 62 C20 50 30 46 42 44 L54 26 C58 20 66 16 76 16 L128 16 C138 16 146 20 150 26 L162 44 C174 46 184 50 184 62 L184 66 C184 70 181 72 177 72 L27 72 C23 72 20 70 20 66 Z"
        fill={c.body}
      />
      {/* windows */}
      <path
        d="M62 42 L72 26 C74 23 78 21 82 21 L120 21 C124 21 128 23 130 26 L140 42 Z"
        fill={c.window}
        opacity="0.9"
      />
      <line x1="101" y1="21" x2="101" y2="42" stroke={c.body} strokeWidth="2" />
      {/* wheels */}
      <circle cx="60" cy="72" r="12" fill="#14213D" />
      <circle cx="60" cy="72" r="5" fill="#C7CDD6" />
      <circle cx="146" cy="72" r="12" fill="#14213D" />
      <circle cx="146" cy="72" r="5" fill="#C7CDD6" />
      {/* headlight */}
      <rect x="177" y="52" width="6" height="6" rx="2" fill="#F0A202" />
      <rect x="18" y="52" width="6" height="4" rx="2" fill="#E85D4C" />
    </svg>
  );
}
