export function MapIllustration({
  showRoute = false,
  className,
}: {
  showRoute?: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 400 260"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="400" height="260" fill="#EEF1F5" />
      {/* land blocks */}
      <rect x="20" y="20" width="90" height="70" rx="6" fill="#E4E8ED" />
      <rect x="140" y="10" width="120" height="50" rx="6" fill="#E4E8ED" />
      <rect x="290" y="30" width="90" height="90" rx="6" fill="#E4E8ED" />
      <rect x="30" y="140" width="110" height="90" rx="6" fill="#E4E8ED" />
      <rect x="230" y="150" width="150" height="90" rx="6" fill="#E4E8ED" />
      {/* water */}
      <path d="M260 0 C300 40 320 90 300 140 C285 175 320 210 380 200 L400 200 L400 0 Z" fill="#D3E6F0" />
      {/* roads */}
      <path d="M0 100 H400" stroke="#FFFFFF" strokeWidth="8" />
      <path d="M0 190 H400" stroke="#FFFFFF" strokeWidth="6" />
      <path d="M120 0 V260" stroke="#FFFFFF" strokeWidth="8" />
      <path d="M230 0 V260" stroke="#FFFFFF" strokeWidth="5" />
      {showRoute && (
        <>
          <path
            d="M60 210 L120 100 L230 130 L330 60"
            stroke="#2E8B57"
            strokeWidth="4"
            strokeDasharray="1 10"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="60" cy="210" r="7" fill="#2E8B57" stroke="white" strokeWidth="3" />
          <circle cx="330" cy="60" r="7" fill="#E85D4C" stroke="white" strokeWidth="3" />
        </>
      )}
      {!showRoute && (
        <circle cx="200" cy="130" r="8" fill="#14213D" stroke="white" strokeWidth="3" />
      )}
    </svg>
  );
}
