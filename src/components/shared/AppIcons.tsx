import { useId, type ComponentType } from 'react';

/* -------------------------------------------------------------------------- */
/*  App icon SVGs shared across Dock, Desktop, title bars, and notifications. */
/*  Each uses useId() so gradient/clipPath IDs stay unique per instance.      */
/* -------------------------------------------------------------------------- */

function Squircle({
  fill,
  stroke,
}: {
  fill: string;
  stroke: string;
}) {
  return (
    <>
      <rect width="120" height="120" rx="26" fill={fill} />
      <rect
        x="0.5"
        y="0.5"
        width="119"
        height="119"
        rx="25.5"
        fill="none"
        stroke={stroke}
        strokeWidth="0.5"
      />
    </>
  );
}

export function TerminalIcon() {
  const uid = useId();
  return (
    <svg viewBox="0 0 120 120" width="100%" height="100%" aria-hidden>
      <defs>
        <linearGradient id={`${uid}-bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3F3F46" />
          <stop offset="100%" stopColor="#18181B" />
        </linearGradient>
      </defs>
      <Squircle fill={`url(#${uid}-bg)`} stroke="rgba(255,255,255,0.22)" />
      <path
        d="M32 74L54 56L32 38"
        stroke="#32D74B"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <line
        x1="62"
        y1="76"
        x2="90"
        y2="76"
        stroke="#32D74B"
        strokeWidth="7"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Blue folder icon used for the Files app. */
export function FilesIcon() {
  const uid = useId();
  return (
    <svg viewBox="0 0 120 120" width="100%" height="100%" aria-hidden>
      <defs>
        <linearGradient id={`${uid}-bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5AC8FA" />
          <stop offset="100%" stopColor="#0A84FF" />
        </linearGradient>
        <linearGradient id={`${uid}-body`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7DD3FC" />
          <stop offset="100%" stopColor="#1A8CFF" />
        </linearGradient>
        <linearGradient id={`${uid}-tab`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#BAE6FD" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>
      </defs>
      <Squircle fill={`url(#${uid}-bg)`} stroke="rgba(255,255,255,0.18)" />
      {/* Folder tab */}
      <path
        d="M24 40c0-3.3 2.7-6 6-6h18l8 8h38c3.3 0 6 2.7 6 6v6H24V40z"
        fill={`url(#${uid}-tab)`}
      />
      {/* Folder body */}
      <path
        d="M24 50c0-2.2 1.8-4 4-4h64c2.2 0 4 1.8 4 4v36c0 3.3-2.7 6-6 6H30c-3.3 0-6-2.7-6-6V50z"
        fill={`url(#${uid}-body)`}
      />
      <path
        d="M24 62h72v24c0 3.3-2.7 6-6 6H30c-3.3 0-6-2.7-6-6V62z"
        fill="rgba(255,255,255,0.12)"
      />
    </svg>
  );
}

/** @deprecated Use FilesIcon. Kept so older imports keep working. */
export const FinderIcon = FilesIcon;

export function NotesIcon() {
  const uid = useId();
  return (
    <svg viewBox="0 0 120 120" width="100%" height="100%" aria-hidden>
      <defs>
        <linearGradient id={`${uid}-bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFBCC" />
          <stop offset="100%" stopColor="#F5E6A3" />
        </linearGradient>
      </defs>
      <Squircle fill={`url(#${uid}-bg)`} stroke="rgba(0,0,0,0.08)" />
      <rect x="18" y="16" width="84" height="10" rx="2" fill="#EAB308" />
      <g stroke="rgba(0,0,0,0.08)" strokeWidth="1">
        <line x1="22" y1="42" x2="98" y2="42" />
        <line x1="22" y1="56" x2="98" y2="56" />
        <line x1="22" y1="70" x2="98" y2="70" />
        <line x1="22" y1="84" x2="98" y2="84" />
        <line x1="22" y1="98" x2="98" y2="98" />
      </g>
      <line x1="28" y1="42" x2="90" y2="42" stroke="#3C3C43" strokeWidth="3" strokeLinecap="round" opacity="0.55" />
      <line x1="28" y1="56" x2="82" y2="56" stroke="#3C3C43" strokeWidth="3" strokeLinecap="round" opacity="0.45" />
      <line x1="28" y1="70" x2="74" y2="70" stroke="#3C3C43" strokeWidth="3" strokeLinecap="round" opacity="0.35" />
      <line x1="28" y1="84" x2="58" y2="84" stroke="#3C3C43" strokeWidth="3" strokeLinecap="round" opacity="0.25" />
    </svg>
  );
}

/** @deprecated Use NotesIcon. */
export const TextEditIcon = NotesIcon;

export function BrowserIcon() {
  const uid = useId();
  return (
    <svg viewBox="0 0 120 120" width="100%" height="100%" aria-hidden>
      <defs>
        <linearGradient id={`${uid}-bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#64D2FF" />
          <stop offset="100%" stopColor="#0071E3" />
        </linearGradient>
      </defs>
      <Squircle fill={`url(#${uid}-bg)`} stroke="rgba(255,255,255,0.18)" />
      <circle cx="60" cy="60" r="32" fill="none" stroke="white" strokeWidth="3.5" />
      <ellipse cx="60" cy="60" rx="14" ry="32" fill="none" stroke="white" strokeWidth="2.2" opacity="0.9" />
      <line x1="28" y1="60" x2="92" y2="60" stroke="white" strokeWidth="2.2" />
      <line x1="32" y1="46" x2="88" y2="46" stroke="white" strokeWidth="1.6" opacity="0.55" />
      <line x1="32" y1="74" x2="88" y2="74" stroke="white" strokeWidth="1.6" opacity="0.55" />
    </svg>
  );
}

/** @deprecated Use BrowserIcon. */
export const SafariIcon = BrowserIcon;

export function SettingsIcon() {
  const uid = useId();
  return (
    <svg viewBox="0 0 120 120" width="100%" height="100%" aria-hidden>
      <defs>
        <linearGradient id={`${uid}-bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A1A1A6" />
          <stop offset="100%" stopColor="#636366" />
        </linearGradient>
      </defs>
      <Squircle fill={`url(#${uid}-bg)`} stroke="rgba(255,255,255,0.14)" />
      <g transform="translate(60,60)">
        <path
          d={`${GEAR_PATH} M14,0A14,14,0,1,0,-14,0A14,14,0,1,0,14,0Z`}
          fill="white"
          fillRule="evenodd"
          opacity="0.96"
        />
      </g>
    </svg>
  );
}

export function SnakeIcon() {
  const uid = useId();
  return (
    <svg viewBox="0 0 120 120" width="100%" height="100%" aria-hidden>
      <defs>
        <linearGradient id={`${uid}-bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#30D158" />
          <stop offset="100%" stopColor="#1F8A3A" />
        </linearGradient>
      </defs>
      <Squircle fill={`url(#${uid}-bg)`} stroke="rgba(255,255,255,0.14)" />
      <path
        d="M28 80 C46 80 46 40 60 40 C74 40 74 80 92 80"
        stroke="white"
        strokeWidth="12"
        strokeLinecap="round"
        fill="none"
        opacity="0.96"
      />
      <circle cx="90" cy="76" r="3.2" fill="rgba(31,138,58,0.75)" />
      <circle cx="38" cy="34" r="7" fill="#FF453A" />
      <line
        x1="38"
        y1="27"
        x2="41"
        y2="22"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}

export function VisitorBoardIcon() {
  const uid = useId();
  return (
    <svg viewBox="0 0 120 120" width="100%" height="100%" aria-hidden>
      <defs>
        <linearGradient id={`${uid}-bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF9F0A" />
          <stop offset="100%" stopColor="#E67700" />
        </linearGradient>
      </defs>
      <Squircle fill={`url(#${uid}-bg)`} stroke="rgba(255,255,255,0.16)" />
      <rect x="28" y="30" width="64" height="62" rx="8" fill="white" opacity="0.95" />
      <rect x="36" y="42" width="32" height="6" rx="3" fill="#E67700" opacity="0.85" />
      <rect x="36" y="54" width="48" height="5" rx="2.5" fill="#C7C7CC" />
      <rect x="36" y="66" width="42" height="5" rx="2.5" fill="#C7C7CC" />
      <rect x="36" y="78" width="28" height="5" rx="2.5" fill="#C7C7CC" />
      <circle cx="78" cy="44" r="6" fill="#FF3B30" />
    </svg>
  );
}

export function RahulOSIcon() {
  const uid = useId();
  return (
    <svg viewBox="0 0 120 120" width="100%" height="100%" aria-hidden>
      <defs>
        <linearGradient id={`${uid}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5E5CE6" />
          <stop offset="100%" stopColor="#0A84FF" />
        </linearGradient>
      </defs>
      <Squircle fill={`url(#${uid}-bg)`} stroke="rgba(255,255,255,0.2)" />
      <text
        x="60"
        y="72"
        textAnchor="middle"
        fill="white"
        fontSize="42"
        fontWeight="700"
        fontFamily="-apple-system, BlinkMacSystemFont, system-ui, sans-serif"
      >
        R
      </text>
    </svg>
  );
}

const ICON_MAP: Record<string, ComponentType> = {
  terminal: TerminalIcon,
  filemanager: FilesIcon,
  texteditor: NotesIcon,
  browser: BrowserIcon,
  settings: SettingsIcon,
  snake: SnakeIcon,
  visitorboard: VisitorBoardIcon,
  about: RahulOSIcon,
};

export function AppIcon({ appId }: { appId: string }) {
  const Icon = ICON_MAP[appId] ?? RahulOSIcon;
  return <Icon />;
}

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
