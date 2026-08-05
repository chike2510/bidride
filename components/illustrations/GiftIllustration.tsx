export function GiftIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 90" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="38" width="80" height="46" rx="4" fill="#F0A202" />
      <rect x="20" y="38" width="80" height="14" rx="4" fill="#D89202" />
      <rect x="54" y="38" width="12" height="46" fill="#14213D" opacity="0.15" />
      <path
        d="M60 38 C50 20 34 22 34 32 C34 38 44 38 60 38 Z"
        fill="#FFD98A"
      />
      <path
        d="M60 38 C70 20 86 22 86 32 C86 38 76 38 60 38 Z"
        fill="#FFD98A"
      />
      <circle cx="94" cy="18" r="4" fill="#F0A202" opacity="0.6" />
      <circle cx="26" cy="14" r="3" fill="#F0A202" opacity="0.5" />
      <circle cx="102" cy="46" r="3" fill="#FFD98A" opacity="0.7" />
    </svg>
  );
}
