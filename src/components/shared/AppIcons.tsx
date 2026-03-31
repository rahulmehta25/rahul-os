import { useId } from 'react';

/* -------------------------------------------------------------------------- */
/*  macOS Sequoia-style app icon SVGs                                          */
/*  Shared across Dock, Desktop, and any other surfaces.                       */
/*  Each uses useId() so gradient/clipPath IDs are unique per instance.        */
/* -------------------------------------------------------------------------- */

export function TerminalIcon() {
  const uid = useId();
  return (
    <svg viewBox="0 0 120 120" width="100%" height="100%">
      <defs>
        <linearGradient id={`${uid}-bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#232323" />
          <stop offset="100%" stopColor="#0c0c0c" />
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx="26" fill={`url(#${uid}-bg)`} />
      <rect x="0.5" y="0.5" width="119" height="119" rx="25.5" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
      <path d="M33 75L53 57L33 39" stroke="#32D74B" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <line x1="62" y1="75" x2="87" y2="75" stroke="#32D74B" strokeWidth="6.5" strokeLinecap="round" />
    </svg>
  );
}

export function FinderIcon() {
  const uid = useId();
  return (
    <svg viewBox="0 0 120 120" width="100%" height="100%">
      <defs>
        <linearGradient id={`${uid}-bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5EB5F7" />
          <stop offset="100%" stopColor="#1565C0" />
        </linearGradient>
        <clipPath id={`${uid}-clip`}>
          <rect width="120" height="120" rx="26" />
        </clipPath>
      </defs>
      <rect width="120" height="120" rx="26" fill={`url(#${uid}-bg)`} />
      {/* Two-tone: right half slightly darker */}
      <rect x="60" y="0" width="60" height="120" fill="rgba(0,0,0,0.07)" clipPath={`url(#${uid}-clip)`} />
      <rect x="0.5" y="0.5" width="119" height="119" rx="25.5" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
      {/* Eyes */}
      <rect x="30" y="40" width="16" height="22" rx="8" fill="white" />
      <rect x="74" y="40" width="16" height="22" rx="8" fill="white" />
      {/* Smile */}
      <path d="M36 78 Q60 98 84 78" stroke="white" strokeWidth="4.5" strokeLinecap="round" fill="none" />
      {/* Center dividing line */}
      <line x1="60" y1="34" x2="60" y2="84" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
    </svg>
  );
}

export function TextEditIcon() {
  const uid = useId();
  return (
    <svg viewBox="0 0 120 120" width="100%" height="100%">
      <defs>
        <linearGradient id={`${uid}-bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FEFEFE" />
          <stop offset="100%" stopColor="#E8E5DE" />
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx="26" fill={`url(#${uid}-bg)`} />
      <rect x="0.5" y="0.5" width="119" height="119" rx="25.5" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="0.5" />
      {/* Yellow header strip */}
      <rect x="18" y="16" width="84" height="8" rx="2" fill="#EAB308" opacity="0.7" />
      {/* Ruled lines */}
      <g stroke="rgba(0,0,0,0.05)" strokeWidth="0.5">
        <line x1="18" y1="36" x2="102" y2="36" />
        <line x1="18" y1="50" x2="102" y2="50" />
        <line x1="18" y1="64" x2="102" y2="64" />
        <line x1="18" y1="78" x2="102" y2="78" />
        <line x1="18" y1="92" x2="102" y2="92" />
      </g>
      {/* Text lines (monochrome, decreasing opacity = paragraph effect) */}
      <line x1="24" y1="36" x2="92" y2="36" stroke="#3C3C43" strokeWidth="2.5" strokeLinecap="round" opacity="0.55" />
      <line x1="24" y1="50" x2="84" y2="50" stroke="#3C3C43" strokeWidth="2.5" strokeLinecap="round" opacity="0.45" />
      <line x1="24" y1="64" x2="76" y2="64" stroke="#3C3C43" strokeWidth="2.5" strokeLinecap="round" opacity="0.38" />
      <line x1="24" y1="78" x2="66" y2="78" stroke="#3C3C43" strokeWidth="2.5" strokeLinecap="round" opacity="0.3" />
      <line x1="24" y1="92" x2="50" y2="92" stroke="#3C3C43" strokeWidth="2.5" strokeLinecap="round" opacity="0.22" />
      {/* Red margin line */}
      <line x1="20" y1="14" x2="20" y2="104" stroke="rgba(255,59,48,0.18)" strokeWidth="1" />
    </svg>
  );
}

export function SafariIcon() {
  const uid = useId();
  return (
    <svg viewBox="0 0 120 120" width="100%" height="100%">
      <defs>
        <linearGradient id={`${uid}-bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#56C2FA" />
          <stop offset="100%" stopColor="#0071E3" />
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx="26" fill={`url(#${uid}-bg)`} />
      <rect x="0.5" y="0.5" width="119" height="119" rx="25.5" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
      {/* Compass ring */}
      <circle cx="60" cy="60" r="38" fill="none" stroke="white" strokeWidth="2" opacity="0.85" />
      {/* Cardinal ticks */}
      <g stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.75">
        <line x1="60" y1="24" x2="60" y2="30" />
        <line x1="60" y1="90" x2="60" y2="96" />
        <line x1="24" y1="60" x2="30" y2="60" />
        <line x1="90" y1="60" x2="96" y2="60" />
      </g>
      {/* Intercardinal ticks */}
      <g stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.4">
        <line x1="84" y1="36" x2="87" y2="33" />
        <line x1="84" y1="84" x2="87" y2="87" />
        <line x1="36" y1="84" x2="33" y2="87" />
        <line x1="36" y1="36" x2="33" y2="33" />
      </g>
      {/* Compass needle rotated ~22deg (red points NNE, white points SSW) */}
      <g transform="rotate(22 60 60)">
        <polygon points="60,26 67,56 60,60 53,56" fill="#FF3B30" />
        <polygon points="60,94 67,64 60,60 53,64" fill="white" opacity="0.92" />
      </g>
      {/* Center dot */}
      <circle cx="60" cy="60" r="3" fill="white" />
    </svg>
  );
}

export function SettingsIcon() {
  const uid = useId();
  return (
    <svg viewBox="0 0 120 120" width="100%" height="100%">
      <defs>
        <linearGradient id={`${uid}-bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8E8E93" />
          <stop offset="100%" stopColor="#636366" />
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx="26" fill={`url(#${uid}-bg)`} />
      <rect x="0.5" y="0.5" width="119" height="119" rx="25.5" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
      <g transform="translate(60,60)">
        <path
          d={`${GEAR_PATH} M13,0A13,13,0,1,0,-13,0A13,13,0,1,0,13,0Z`}
          fill="white"
          fillRule="evenodd"
          opacity="0.95"
        />
      </g>
    </svg>
  );
}

export function SnakeIcon() {
  const uid = useId();
  return (
    <svg viewBox="0 0 120 120" width="100%" height="100%">
      <defs>
        <linearGradient id={`${uid}-bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#30D158" />
          <stop offset="100%" stopColor="#248A3D" />
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx="26" fill={`url(#${uid}-bg)`} />
      <rect x="0.5" y="0.5" width="119" height="119" rx="25.5" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
      {/* Snake body: smooth S-curve */}
      <path
        d="M30 78 C46 78 46 42 60 42 C74 42 74 78 90 78"
        stroke="white" strokeWidth="10" strokeLinecap="round" fill="none" opacity="0.95"
      />
      {/* Eye */}
      <circle cx="88" cy="74" r="2.5" fill="rgba(36,138,61,0.6)" />
      {/* Apple */}
      <circle cx="40" cy="36" r="6" fill="#FF453A" opacity="0.85" />
      <line x1="40" y1="30" x2="42" y2="26" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

/* --- Pre-computed gear path for Settings icon ----------------------------- */

const GEAR_PATH = (() => {
  const outerR = 38;
  const innerR = 26;
  const teeth = 8;
  const pts: string[] = [];
  for (let i = 0; i < teeth; i++) {
    const a1 = (Math.PI * 2 * i) / teeth;
    const a2 = (Math.PI * 2 * (i + 0.35)) / teeth;
    const a3 = (Math.PI * 2 * (i + 0.5)) / teeth;
    const a4 = (Math.PI * 2 * (i + 0.85)) / teeth;
    pts.push(`${(outerR * Math.cos(a1)).toFixed(1)},${(outerR * Math.sin(a1)).toFixed(1)}`);
    pts.push(`${(outerR * Math.cos(a2)).toFixed(1)},${(outerR * Math.sin(a2)).toFixed(1)}`);
    pts.push(`${(innerR * Math.cos(a3)).toFixed(1)},${(innerR * Math.sin(a3)).toFixed(1)}`);
    pts.push(`${(innerR * Math.cos(a4)).toFixed(1)},${(innerR * Math.sin(a4)).toFixed(1)}`);
  }
  return `M${pts.join('L')}Z`;
})();
